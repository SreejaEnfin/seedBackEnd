import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { TodosService } from './todo.service';
import { Public } from 'src/auth/auth.decorator';
import { CreateTodoDto } from './dto/create-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Public()
  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.createTodo(createTodoDto);
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.todosService.findOneTodo(_id);
  }
}
