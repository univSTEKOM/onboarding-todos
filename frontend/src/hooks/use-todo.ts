import { useQuery } from '@tanstack/react-query'
import { useAppMutation } from './use-mutations'
import { getTodos, createTodo, toggleTodo, deleteTodo, updateTodoStatus, editTodo } from '@/lib/services/todo.service'
export const useTodos = () =>
  useQuery({
    queryKey: ['todos'],
    queryFn: getTodos,
  })

export const useCreateTodo = () =>
  useAppMutation({
    mutationFn: (title: string) => createTodo(title),
    invalidateKeys: ['todos'],
    successMessage: 'Todo created!',
  })

export const useToggleTodo = () =>
  useAppMutation({
    mutationFn: ({ id, isCompleted }: { id: string; isCompleted: boolean }) =>
      toggleTodo(id, isCompleted),
    invalidateKeys: ['todos'],
  })

export const useDeleteTodo = () =>
  useAppMutation({
    mutationFn: (id: string) => deleteTodo(id),
    invalidateKeys: ['todos'],
    successMessage: 'Todo deleted!',
  })
  export const useUpdateStatus = () =>
  useAppMutation({
   mutationFn: ({ id, status }: { id: string; status: 'todo' | 'inProgress' | 'done' }) =>
  updateTodoStatus(id, status),
    invalidateKeys: ['todos'],
  })
  export const useEditTodo = () =>
  useAppMutation({
    mutationFn: ({ id, title }: { id: string; title: string }) =>
      editTodo(id, title),
    invalidateKeys: ['todos'],
  })