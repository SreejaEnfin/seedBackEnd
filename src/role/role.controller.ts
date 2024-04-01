import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { RoleService } from './role.service';
import { CreateRoleDto } from './dto/create-role.dto';

@Controller('role')
export class RoleController {
  constructor(private readonly roleService: RoleService) {}

  @Post()
  create(@Body() role: CreateRoleDto) {
    return this.roleService.create(role);
  }

  @Get()
  findAll() {
    return this.roleService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: any) {
    return this.roleService.findOne(id);
  }

  // @Patch(':id')
  // update(@Param('id') id: any, @Body() updateRole: any) {
  //   return this.roleService.update(id, updateRole);
  // }

  // @Delete(':id')
  // remove(@Param('id') id: string) {
  //   return this.roleService.remove(id);
  // }
}
