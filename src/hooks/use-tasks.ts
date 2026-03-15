'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { useTaskStore } from '@/stores/task-store'
import { useRealtimeSubscription } from '@/hooks/use-realtime'
import { createClient } from '@/lib/supabase/client'
import { useToast } from '@/providers/toast-provider'
import type { Task, TaskStats, TaskDigest, TaskStatus } from '@/types/tasks'

interface FetchResult<T> {
  data: T | null
  planGated: boolean
  error: string | null
}

async function apiFetch<T>(path: string, options: RequestInit = {}): Promise<FetchResult<T>> {
  try {
    const supabase = createClient()
    const { data: { session } } = await supabase.auth.getSession()
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
      ...(options.headers as Record<string, string>),
    }
    if (session?.access_token) {
      headers['Authorization'] = `Bearer ${session.access_token}`
    }

    const res = await fetch(`/api/v1${path}`, {
      ...options,
      headers,
    })
    if (res.status === 402) {
      return { data: null, planGated: true, error: null }
    }
    if (!res.ok) {
      const body = await res.json().catch(() => ({ error: 'Request failed' }))
      return { data: null, planGated: false, error: body.error || 'Request failed' }
    }
    const body = await res.json()
    return { data: body.data as T, planGated: false, error: null }
  } catch {
    return { data: null, planGated: false, error: 'Network error' }
  }
}

export function useTasks() {
  const { tasks, filters, setTasks } = useTaskStore()
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [planGated, setPlanGated] = useState(false)
  const fetchIdRef = useRef(0)

  const fetchTasks = useCallback(async () => {
    const currentFetchId = ++fetchIdRef.current
    setIsLoading(true)
    setError(null)

    const params = new URLSearchParams()
    if (filters.status.length > 0) params.set('status', filters.status.join(','))
    if (filters.priority.length > 0) params.set('priority', filters.priority.join(','))
    if (filters.type.length > 0) params.set('type', filters.type.join(','))
    if (filters.search) params.set('search', filters.search)

    const result = await apiFetch<Task[]>(`/tasks?${params.toString()}`)

    if (currentFetchId !== fetchIdRef.current) return

    if (result.planGated) {
      setPlanGated(true)
      setTasks([])
    } else if (result.error) {
      setError(result.error)
    } else {
      setPlanGated(false)
      setTasks(result.data || [])
    }

    setIsLoading(false)
  }, [filters, setTasks])

  useEffect(() => {
    fetchTasks()
  }, [fetchTasks])

  // Realtime subscription for live task updates
  useRealtimeSubscription<Task>({
    table: 'tasks',
    event: '*',
    onInsert: (newTask) => {
      useTaskStore.getState().addTask(newTask)
    },
    onUpdate: (updatedTask) => {
      useTaskStore.getState().updateTask(updatedTask.id, updatedTask)
    },
    onDelete: (deleted) => {
      useTaskStore.getState().removeTask(deleted.id)
    },
  })

  return { tasks, isLoading, error, planGated, refetch: fetchTasks }
}

export function useTaskMutations() {
  const { addTask, updateTask, removeTask, moveTask } = useTaskStore()
  const { addToast } = useToast()

  const createTask = useCallback(async (input: {
    title: string
    description?: string
    priority?: string
    deadline?: string
  }): Promise<Task | null> => {
    const result = await apiFetch<Task>('/tasks', {
      method: 'POST',
      body: JSON.stringify(input),
    })
    if (result.data) {
      addTask(result.data)
      addToast('success', 'Task created')
      return result.data
    }
    if (result.error) {
      addToast('error', result.error)
    }
    return null
  }, [addTask, addToast])

  const patchTask = useCallback(async (id: string, updates: Partial<Task>) => {
    // Optimistic update
    updateTask(id, updates)
    const result = await apiFetch<Task>(`/tasks/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(updates),
    })
    if (result.error) {
      addToast('error', 'Failed to update task')
    } else {
      addToast('success', 'Task updated')
    }
  }, [updateTask, addToast])

  const updateStatus = useCallback(async (id: string, status: TaskStatus) => {
    // Optimistic update
    moveTask(id, status)
    const result = await apiFetch<Task>(`/tasks/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    })
    if (result.error) {
      addToast('error', 'Failed to move task')
    }
  }, [moveTask, addToast])

  const dismissTask = useCallback(async (id: string) => {
    // Optimistic update
    removeTask(id)
    const result = await apiFetch<void>(`/tasks/${id}`, {
      method: 'DELETE',
    })
    if (result.error) {
      addToast('error', 'Failed to dismiss task')
    } else {
      addToast('info', 'Task dismissed')
    }
  }, [removeTask, addToast])

  const snoozeTask = useCallback(async (id: string, until: Date) => {
    updateTask(id, { snoozed_until: until.toISOString() })
    const result = await apiFetch<void>(`/tasks/${id}/snooze`, {
      method: 'POST',
      body: JSON.stringify({ until: until.toISOString() }),
    })
    if (result.error) {
      addToast('error', 'Failed to snooze task')
    } else {
      addToast('success', 'Task snoozed')
    }
  }, [updateTask, addToast])

  const delegateTask = useCallback(async (
    id: string,
    email: string,
    name: string,
    followUpAt: Date
  ) => {
    const result = await apiFetch<Task>(`/tasks/${id}/delegate`, {
      method: 'POST',
      body: JSON.stringify({
        email,
        name,
        follow_up_at: followUpAt.toISOString(),
      }),
    })
    if (result.data) {
      moveTask(id, 'waiting')
      addToast('success', `Task delegated to ${name}`)
    } else if (result.error) {
      addToast('error', result.error)
    }
    return result
  }, [moveTask, addToast])

  return { createTask, patchTask, updateStatus, dismissTask, snoozeTask, delegateTask }
}

export function useTaskStats() {
  const [stats, setStats] = useState<TaskStats | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    apiFetch<TaskStats>('/tasks/stats')
      .then((result) => {
        if (result.data) setStats(result.data)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return { stats, isLoading }
}

export function useTaskDigest() {
  const [digest, setDigest] = useState<TaskDigest | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    apiFetch<TaskDigest>('/tasks/digest')
      .then((result) => {
        if (result.data) setDigest(result.data)
      })
      .finally(() => setIsLoading(false))
  }, [])

  return { digest, isLoading }
}
