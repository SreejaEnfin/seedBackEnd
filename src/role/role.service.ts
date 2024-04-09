import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { CreateRoleDto } from './dto/create-role.dto';
import { Role, RoleType } from './entities/role.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from 'src/users/entities/user.entity';

@Injectable()
export class RoleService {
  constructor(
    @InjectRepository(Role) private roleRepository: Repository<Role>,
  ) {}

  async create(createRole: CreateRoleDto) {
    const { name, roleType, acl } = createRole;
    if (!Object.values(RoleType).includes(roleType)) {
      throw new BadRequestException('Invalid roleType');
    }

    const role = new Role();

    role.name = name;
    role.roleType = roleType || RoleType.ADMIN;
    role.acl = acl;
    return await this.roleRepository.save(role);
  }

  async findAll(): Promise<any> {
    const roles = await this.roleRepository.find();
    console.log(roles);
    return roles;
  }

  async findOne(_id: any) {
    const role = await this.roleRepository.findOne(_id);

    if (role) {
      const { name, ...rest } = role;
      return rest;
    } else {
      throw new NotFoundException('Role not found');
    }
  }
}
