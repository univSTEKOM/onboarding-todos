## Todo List / Task Board

A kanban-style task management feature built end-to-end.

### Backend

- **Entity**: `Todo` (`id`, `title`, `isCompleted`, `status`, `createdAt`, `updatedAt`, `deletedAt`)
- **Service**: `TodoService`
- **Endpoints**:
  - `GET /api/todos`: Get all todos
  - `POST /api/todos`: Create new todo
  - `PATCH /api/todos/:id`: Edit todo title
  - `PATCH /api/todos/:id/status`: Update todo status (`todo` | `inProgress` | `done`)
  - `DELETE /api/todos/:id`: Soft delete todo

### Frontend

- **Route**: `/todos`
- **Components**: Task board with 3 lanes (To do, In Progress, Done), summary cards, inline edit
- **State**: `useTodos`, `useCreateTodo`, `useDeleteTodo`, `useUpdateStatus`, `useEditTodo` hooks with TanStack Query