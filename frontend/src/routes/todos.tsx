import React from 'react'
import { createFileRoute, redirect } from '@tanstack/react-router'
import { useState } from 'react'
import { isAuthenticated } from '@/lib/utils/cookies'
import { PageHeader } from '@/components/templates/page-header'
import { useTodos, useCreateTodo, useDeleteTodo, useUpdateStatus, useEditTodo } from '@/hooks/use-todo'

export const Route = createFileRoute('/todos')({
  beforeLoad: () => {
    if (!isAuthenticated()) {
      throw redirect({ to: '/login' })
    }
  },
  component: TodoPage,
})

type Status = 'todo' | 'inProgress' | 'done'

const LANES: {
  key: Status
  label: string
  dot: string
  badge: string
  empty: string
  next: Status | null
  nextLabel: string | null
  prev: Status | null
}[] = [
  { key: 'todo',       label: 'To do',       dot: 'bg-danger',  badge: 'bg-danger/10 text-danger',   empty: 'No tasks yet',         next: 'inProgress', nextLabel: 'Start',    prev: null },
  { key: 'inProgress', label: 'In progress', dot: 'bg-warning', badge: 'bg-warning/10 text-warning', empty: 'No tasks in progress', next: 'done',       nextLabel: 'Complete', prev: 'todo' },
  { key: 'done',       label: 'Done',        dot: 'bg-success', badge: 'bg-success/10 text-success', empty: 'Nothing completed yet',next: null,         nextLabel: null,       prev: 'inProgress' },
]

const IconPencil = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0 text-default-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"/>
  </svg>
)
const IconClock = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0 text-warning" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
  </svg>
)
const IconCheck = () => (
  <svg className="w-3.5 h-3.5 flex-shrink-0 text-success" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
)
const IconTrash = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14H6L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/>
  </svg>
)
const IconUndo = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 7v6h6"/><path d="M3 13C5.5 7 12 5 17 8s7 10 3 15"/>
  </svg>
)
const IconChevron = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="9 18 15 12 9 6"/>
  </svg>
)
const IconPlus = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
    <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
  </svg>
)
const IconEdit = () => (
  <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M11 4H4a2 2 0 00-2 2v14a2 2 0 002 2h14a2 2 0 002-2v-7"/>
    <path d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z"/>
  </svg>
)

const cardIcon: Record<Status, React.ReactElement> = {
  todo: <IconPencil />,
  inProgress: <IconClock />,
  done: <IconCheck />,
}

function TodoPage() {
  const [input, setInput] = useState('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editValue, setEditValue] = useState('')
  const { data: todos = [], isLoading } = useTodos()
  const createMutation = useCreateTodo()
  const deleteMutation = useDeleteTodo()
  const statusMutation = useUpdateStatus()
  const editMutation = useEditTodo()

  const handleAdd = () => {
    if (!input.trim()) return
    createMutation.mutate(input.trim())
    setInput('')
  }

  const handleEditSave = (id: string) => {
    if (editValue.trim()) editMutation.mutate({ id, title: editValue.trim() })
    setEditingId(null)
  }

  return (
    <div className="flex flex-col w-full min-h-full pb-10 mx-auto">
      <PageHeader
        title="Task Board"
        breadcrumbs={[{ label: 'Task Board', isCurrent: true }]}
      />

      {/* Summary cards */}
      <div className="grid grid-cols-3 gap-4 mb-6 mt-2">
        {LANES.map((lane) => {
          const count = todos.filter((t) => t.status === lane.key).length
          const iconMap: Record<Status, React.ReactElement> = {
            todo: (
              <div className="w-10 h-10 rounded-full bg-danger/10 flex items-center justify-center">
                <IconPencil />
              </div>
            ),
            inProgress: (
              <div className="w-10 h-10 rounded-full bg-warning/10 flex items-center justify-center">
                <IconClock />
              </div>
            ),
            done: (
              <div className="w-10 h-10 rounded-full bg-success/10 flex items-center justify-center">
                <IconCheck />
              </div>
            ),
          }
          return (
            <div key={lane.key} className="bg-content1 border border-default-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-default-400 mb-1">{lane.label}</p>
                <p className={`text-3xl font-semibold ${lane.dot.replace('bg-', 'text-')}`}>{count}</p>
              </div>
              {iconMap[lane.key]}
            </div>
          )
        })}
      </div>

      {/* Input */}
      <div className="flex gap-2 mb-6">
        <input
          className="flex-1 h-10 border border-default-200 rounded-xl px-4 text-sm bg-content1 outline-none focus:border-default-400 placeholder:text-default-300 transition"
          placeholder="Add a new task..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
        />
        <button
          className="h-10 px-4 flex items-center gap-2 text-sm font-medium border border-default-200 rounded-xl bg-content1 hover:bg-content2 disabled:opacity-50 transition"
          onClick={handleAdd}
          disabled={createMutation.isPending}
        >
          <IconPlus />
          Add task
        </button>
      </div>

      {isLoading ? (
        <p className="text-sm text-default-400">Loading...</p>
      ) : (
        <div className="flex flex-col gap-3">
          {LANES.map((lane) => {
            const items = todos.filter((t) => t.status === lane.key).reverse()
            return (
              <div key={lane.key} className="bg-content1 border border-default-200 rounded-xl overflow-hidden">

                {/* Lane header */}
                <div className="flex items-center gap-2.5 px-5 py-3 border-b border-default-100">
                  <span className={`w-2 h-2 rounded-full ${lane.dot} flex-shrink-0`} />
                  <span className="text-sm font-medium text-default-700">{lane.label}</span>
                  <span className={`ml-auto text-xs font-medium px-2.5 py-0.5 rounded-full ${lane.badge}`}>
                    {items.length}
                  </span>
                </div>

                {/* Lane body */}
                <div className="divide-y divide-default-100">
                  {items.length === 0 ? (
                    <p className="text-xs text-default-300 text-center py-6">{lane.empty}</p>
                  ) : (
                    items.map((todo) => (
                      <div
                        key={todo.id}
                        className="flex items-center gap-3 px-5 py-3 hover:bg-content2 transition"
                      >
                        {cardIcon[lane.key]}

                        {/* Teks / input inline */}
                        {editingId === todo.id ? (
                          <input
                            autoFocus
                            className="flex-1 text-sm bg-transparent border-b border-default-400 outline-none py-0.5"
                            value={editValue}
                            onChange={(e) => setEditValue(e.target.value)}
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') handleEditSave(todo.id)
                              if (e.key === 'Escape') setEditingId(null)
                            }}
                            onBlur={() => handleEditSave(todo.id)}
                          />
                        ) : (
  <div className="flex flex-col flex-1 min-w-0">
    <span className={`text-sm ${lane.key === 'done' ? 'line-through text-default-400' : 'text-default-700'}`}>
      {todo.title}
    </span>
    <span className="text-[11px] text-default-300">
      {new Date(todo.createdAt).toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' })}
    </span>
  </div>
)}

                        <div className="flex items-center gap-1 flex-shrink-0">
                          {/* Tombol edit — tampil di semua lane */}
                          <button
                            title="Edit"
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-default-400 hover:bg-default-100 hover:text-default-600 transition"
                            onClick={() => { setEditingId(todo.id); setEditValue(todo.title) }}
                          >
                            <IconEdit />
                          </button>

                          {lane.prev && (
                            <button
                              title="Undo"
                              className="w-7 h-7 flex items-center justify-center rounded-lg border border-default-200 text-default-400 hover:bg-default-100 hover:text-default-600 transition"
                              onClick={() => statusMutation.mutate({ id: todo.id, status: lane.prev! })}
                            >
                              <IconUndo />
                            </button>
                          )}
                          {lane.next && (
                            <button
                              title={lane.nextLabel ?? ''}
                              className="w-7 h-7 flex items-center justify-center rounded-lg border border-primary/30 text-primary hover:bg-primary/10 transition"
                              onClick={() => statusMutation.mutate({ id: todo.id, status: lane.next! })}
                            >
                              <IconChevron />
                            </button>
                          )}
                          <button
                            title="Delete"
                            className="w-7 h-7 flex items-center justify-center rounded-lg border border-transparent text-default-400 hover:text-danger hover:bg-danger/10 hover:border-danger/20 transition"
                            onClick={() => deleteMutation.mutate(todo.id)}
                          >
                            <IconTrash />
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}