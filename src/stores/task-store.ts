import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { Task, TaskFilters, TaskStatus, BoardColumn } from '@/types/tasks'
import { DEFAULT_COLUMNS } from '@/types/tasks'

interface TaskState {
  tasks: Task[]
  columns: BoardColumn[]
  filters: TaskFilters
  sortBy: 'priority' | 'deadline' | 'created'
  selectedTaskId: string | null
  activeTimerTaskId: string | null

  setTasks: (tasks: Task[]) => void
  addTask: (task: Task) => void
  updateTask: (id: string, updates: Partial<Task>) => void
  removeTask: (id: string) => void
  moveTask: (id: string, newStatus: TaskStatus) => void
  setFilters: (filters: Partial<TaskFilters>) => void
  setSortBy: (sort: 'priority' | 'deadline' | 'created') => void
  setSelectedTaskId: (id: string | null) => void
  setColumns: (columns: BoardColumn[]) => void
  startTimer: (taskId: string) => void
  stopTimer: () => void
}

export const useTaskStore = create<TaskState>()(
  devtools(
    (set) => ({
      tasks: [],
      columns: DEFAULT_COLUMNS,
      filters: {
        status: ['to_do', 'in_progress', 'waiting'],
        priority: [],
        type: [],
        search: '',
      },
      sortBy: 'priority',
      selectedTaskId: null,
      activeTimerTaskId: null,

      setTasks: (tasks) => set({ tasks }),
      addTask: (task) => set((state) => ({
        tasks: [task, ...state.tasks],
      })),
      updateTask: (id, updates) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id ? { ...t, ...updates } : t
        ),
      })),
      removeTask: (id) => set((state) => ({
        tasks: state.tasks.filter((t) => t.id !== id),
      })),
      moveTask: (id, newStatus) => set((state) => ({
        tasks: state.tasks.map((t) =>
          t.id === id
            ? {
                ...t,
                status: newStatus,
                completed_at: newStatus === 'done'
                  ? new Date().toISOString()
                  : t.completed_at,
              }
            : t
        ),
      })),
      setFilters: (filters) => set((state) => ({
        filters: { ...state.filters, ...filters },
      })),
      setSortBy: (sortBy) => set({ sortBy }),
      setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),
      setColumns: (columns) => set({ columns }),
      startTimer: (taskId) => set((state) => ({
        activeTimerTaskId: taskId,
        tasks: state.tasks.map((t) =>
          t.id === taskId
            ? { ...t, is_timing: true, timing_started_at: new Date().toISOString() }
            : t
        ),
      })),
      stopTimer: () => set((state) => ({
        activeTimerTaskId: null,
        tasks: state.tasks.map((t) =>
          t.is_timing
            ? { ...t, is_timing: false, timing_started_at: undefined }
            : t
        ),
      })),
    }),
    { name: 'task-store' }
  )
)
