'use client'

import { useState, useMemo } from 'react'
import {
  DndContext,
  closestCorners,
  PointerSensor,
  TouchSensor,
  useSensor,
  useSensors,
  DragOverlay,
  type DragStartEvent,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable'
import { useDroppable } from '@dnd-kit/core'
import { useTaskStore } from '@/stores/task-store'
import { useTaskMutations } from '@/hooks/use-tasks'
import { TaskCard } from './task-card'
import { QuickAdd } from './quick-add'
import type { Task, TaskStatus, BoardColumn } from '@/types/tasks'

function DroppableColumn({
  column,
  tasks,
  children,
}: {
  column: BoardColumn
  tasks: Task[]
  children: React.ReactNode
}) {
  const { setNodeRef, isOver } = useDroppable({
    id: column.column_key,
  })

  return (
    <div
      ref={setNodeRef}
      className="flex flex-col min-h-[calc(100vh-200px)] w-72 shrink-0"
      style={{
        backgroundColor: isOver ? 'var(--accent-subtle)' : undefined,
      }}
    >
      <div
        className="h-1 w-full"
        style={{ backgroundColor: column.color }}
      />
      <div
        className="flex items-center justify-between px-3 py-2"
        style={{ borderBottom: '1px solid var(--border-subtle)' }}
      >
        <h3
          className="text-sm font-semibold"
          style={{ color: 'var(--text-primary)' }}
        >
          {column.label}
        </h3>
        <span
          className="text-xs px-1.5 py-0.5"
          style={{
            color: 'var(--text-muted)',
            backgroundColor: 'var(--bg-secondary)',
          }}
        >
          {tasks.length}
        </span>
      </div>
      <div className="flex-1 p-2 space-y-2 overflow-y-auto">
        {children}
        {tasks.length === 0 && (
          <div
            className="flex items-center justify-center h-24 text-xs"
            style={{
              color: 'var(--text-muted)',
              border: '1px dashed var(--border-default)',
            }}
          >
            Drop tasks here
          </div>
        )}
      </div>
    </div>
  )
}

export function KanbanBoard() {
  const { tasks, columns } = useTaskStore()
  const { updateStatus } = useTaskMutations()
  const [activeTask, setActiveTask] = useState<Task | null>(null)

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: { distance: 8 },
    }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 200, tolerance: 5 },
    })
  )

  const tasksByColumn = useMemo(() => {
    const grouped: Record<string, Task[]> = {}
    for (const col of columns) {
      grouped[col.column_key] = []
    }
    for (const task of tasks) {
      if (grouped[task.status]) {
        grouped[task.status].push(task)
      }
    }
    return grouped
  }, [tasks, columns])

  function handleDragStart(event: DragStartEvent) {
    const task = tasks.find((t) => t.id === event.active.id)
    setActiveTask(task || null)
  }

  function handleDragEnd(event: DragEndEvent) {
    setActiveTask(null)
    const { active, over } = event
    if (!over) return

    const taskId = active.id as string
    const newStatus = over.id as TaskStatus

    const task = tasks.find((t) => t.id === taskId)
    if (!task || task.status === newStatus) return

    updateStatus(taskId, newStatus)
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCorners}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="flex gap-4 overflow-x-auto pb-4">
        {columns
          .sort((a, b) => a.position - b.position)
          .map((column) => {
            const columnTasks = tasksByColumn[column.column_key] || []
            return (
              <DroppableColumn
                key={column.column_key}
                column={column}
                tasks={columnTasks}
              >
                {column.column_key === 'to_do' && <QuickAdd />}
                <SortableContext
                  items={columnTasks.map((t) => t.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {columnTasks.map((task) => (
                    <TaskCard key={task.id} task={task} />
                  ))}
                </SortableContext>
              </DroppableColumn>
            )
          })}
      </div>

      <DragOverlay>
        {activeTask ? (
          <div className="opacity-80 rotate-2">
            <TaskCard task={activeTask} isDragging />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  )
}
