import { apiGet, apiPost, apiPatch, apiDelete } from '@/lib/api'

export interface Todo {
  id: string
  title: string
  isCompleted: boolean
  status: 'todo' | 'inProgress' | 'done'  // tambahkan ini
  createdAt: string
  updatedAt: string
}

export const getTodos = () =>
  apiGet<Todo[]>('api/todos')

export const createTodo = (title: string) =>
  apiPost<Todo>('api/todos', { title })

export const toggleTodo = (id: string, isCompleted: boolean) =>
  apiPatch<Todo>(`api/todos/${id}`, { isCompleted })

export const deleteTodo = (id: string) =>
  apiDelete(`api/todos/${id}`)

// ganti 'apiClient' dengan nama yang sama seperti fungsi lain di file itu
export const updateTodoStatus = (id: string, status: 'todo' | 'inProgress' | 'done') =>
  apiPatch<Todo>(`api/todos/${id}/status`, { status })

export const editTodo = (id: string, title: string) =>
  apiPatch<Todo>(`api/todos/${id}`, { title })