import { Injectable, NotFoundException } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { CreateRoleDto } from './dto/create-role.dto';
import { Role } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(createRole: CreateRoleDto) {
    const { name, acl } = createRole;
    const role = new Role();

    role.name = name;
    role.acl = JSON.stringify(acl);
    return await this.roleRepository.save(role);
  }

  findAll() {
    return this.roleRepository.find();
  }

  async findOne(_id: any) {
    const user = await this.roleRepository.findOne(_id);

    if (user) {
      return user;
    } else {
      throw new NotFoundException('User not found');
    }
  }

  // async update(_id: string, updateRole: any) {
  //   const existRole = await this.roleRepository.findOne(_id)

  //   if (existRole) {
  //     const changedRole = await this.roleRepository.findByIdAndUpdate(
  //       id,
  //       updateRole,
  //       { new: true },
  //     );

  //     return changedRole;
  //   } else {
  //     throw new NotFoundException('No such role to update');
  //   }
  // }

  // async remove(id: string) {
  //   const existUser = await this.roleModel.findById({ _id: id });

  //   if (existUser) {
  //     await this.roleModel.findByIdAndDelete(id);
  //     return 'Deleted Successfully';
  //   } else {
  //     throw new NotFoundException('No such user to delete');
  //   }
  // }
}
