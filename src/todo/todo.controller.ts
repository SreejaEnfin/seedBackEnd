import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { TodosService } from './todo.service';
import { CreateTodoDto } from './dto/create-todo.dto';
import { UpdateTodoDto } from './dto/update-todo.dto';

@Controller('todos')
export class TodosController {
  constructor(private todosService: TodosService) {}

  @Post()
  create(@Body() createTodoDto: CreateTodoDto) {
    return this.todosService.createTodo(createTodoDto);
  }

  @Get()
  findAll(): Promise<CreateTodoDto[]> {
    return this.todosService.findAllTodos();
  }

  @Get(':id')
  findOne(@Param('id') _id: string) {
    return this.todosService.findOneTodo(_id);
  }

  @Patch(':id')
  update(@Param('id') _id: string, @Body() updateTodoDto: UpdateTodoDto) {
    return this.todosService.updateTodo(_id, updateTodoDto);
  }

  @Delete(':id')
  remove(@Param('id') _id: string) {
    return this.todosService.deleteTodo(_id);
  }
}
