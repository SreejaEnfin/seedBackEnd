import { Injectable, NotFoundException } from '@nestjs/common';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Todo } from './entities/todo.entity';
import { Repository } from 'typeorm';

@Injectable()
export class TodosService {
  constructor(
    @InjectRepository(Todo) private todoRepository: Repository<Todo>,
  ) {}

  public async createTodo(createTodoDto: CreateTodoDto) {
    return await this.todoRepository.save(createTodoDto);
  }

  public async findAllTodos(): Promise<Todo[]> {
    return await this.todoRepository.find();
  }

  public async findOneTodo(_id: any): Promise<Todo> {
    return await this.todoRepository.findOne({ where: { _id } });
  }

  public async updateTodo(
    _id: any,
    updateTodoDto: UpdateTodoDto,
  ): Promise<Todo> {
    const todo = await this.findOneTodo(_id);
    if (!todo) {
      throw new NotFoundException('Todo not found');
    }

    await this.todoRepository.update({ _id }, updateTodoDto);
    return todo;
  }

  public async deleteTodo(_id: any): Promise<void> {
    await this.todoRepository.delete(_id);
  }
}
