import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from '@node-rs/bcrypt';

@Injectable()
export class UsersService {
  constructor( @InjectRepository(User) private userRepository: Repository<User>, ) {}

  async findOne(_id: any): Promise<User> {
    return this.userRepository.findOne(_id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if(user) {
      throw new BadRequestException('User already exists')
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds)
    createUserDto.password = hash;
    const newUser = await this.userRepository.save(createUserDto);
    return { ...newUser, password: undefined };
  }

  // findAll() {
  //   return `This action returns all users`;
  // }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // update(id: number, updateUserDto: UpdateUserDto) {
  //   return `This action updates a #${id} user`;
  // }

  // remove(id: number) {
  //   return `This action removes a #${id} user`;
  // }
}
