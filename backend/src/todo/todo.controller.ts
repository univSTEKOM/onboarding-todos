import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TodoService } from './todo.service';

@Controller('todos')
export class TodoController {
  constructor(private readonly todoService: TodoService) {}

  @Get()
  async getAll() {
    return this.todoService.findAll();
  }

  @Post()
  async create(@Body('title') title: string) {
    return this.todoService.create(title);
  }

  @Patch(':id/status')
  updateStatus(@Param('id') id: string, @Body('status') status: 'todo' | 'inProgress' | 'done') {
    return this.todoService.updateStatus(id, status);
  }

  @Patch(':id')
  async toggle(@Param('id') id: string, @Body('isCompleted') isCompleted: boolean) {
    return this.todoService.toggleComplete(id, isCompleted);
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    await this.todoService.softDelete(id);
    return { success: true };
  }
}