import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TodoEntity } from './todo.entity';

@Injectable()
export class TodoService {
  constructor(
    @InjectRepository(TodoEntity)
    private readonly todoRepository: Repository<TodoEntity>,
  ) {}

  async findAll() {
    return this.todoRepository.find();
  }
  async updateStatus(id: string, status: 'todo' | 'inProgress' | 'done') {
  await this.todoRepository.update(id, { status });
  return this.todoRepository.findOne({ where: { id } });
}
  async create(title: string) {
    const todo = this.todoRepository.create({ title });
    return this.todoRepository.save(todo);
  }

  async toggleComplete(id: string, isCompleted: boolean) {
    await this.todoRepository.update(id, { isCompleted });
    return this.todoRepository.findOne({ where: { id } });
  }

  async softDelete(id: string) {
    return this.todoRepository.softDelete(id);
  }
}