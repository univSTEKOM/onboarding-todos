import { Test, TestingModule } from '@nestjs/testing';
import { TodoService } from './todo.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TodoEntity } from './todo.entity';

const mockRepo = {
  find: jest.fn(),
  create: jest.fn(),
  save: jest.fn(),
  update: jest.fn(),
  findOne: jest.fn(),
  softDelete: jest.fn(),
};

describe('TodoService', () => {
  let service: TodoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        TodoService,
        { provide: getRepositoryToken(TodoEntity), useValue: mockRepo },
      ],
    }).compile();

    service = module.get<TodoService>(TodoService);
  });

  afterEach(() => jest.clearAllMocks());

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('findAll — should return all todos', async () => {
    const todos = [{ id: '1', title: 'Test', status: 'todo', isCompleted: false }];
    mockRepo.find.mockResolvedValue(todos);
    const result = await service.findAll();
    expect(result).toEqual(todos);
  });

  it('create — should create and save a todo', async () => {
    const todo = { id: '1', title: 'Belajar NestJS', status: 'todo', isCompleted: false };
    mockRepo.create.mockReturnValue(todo);
    mockRepo.save.mockResolvedValue(todo);
    const result = await service.create('Belajar NestJS');
    expect(mockRepo.create).toHaveBeenCalledWith({ title: 'Belajar NestJS' });
    expect(result).toEqual(todo);
  });

  it('updateStatus — should update status of a todo', async () => {
    const todo = { id: '1', title: 'Test', status: 'inProgress', isCompleted: false };
    mockRepo.update.mockResolvedValue(undefined);
    mockRepo.findOne.mockResolvedValue(todo);
    const result = await service.updateStatus('1', 'inProgress');
    expect(mockRepo.update).toHaveBeenCalledWith('1', { status: 'inProgress' });
    expect(result).toEqual(todo);
  });

  it('softDelete — should soft delete a todo', async () => {
    mockRepo.softDelete.mockResolvedValue(undefined);
    await service.softDelete('1');
    expect(mockRepo.softDelete).toHaveBeenCalledWith('1');
  });
});