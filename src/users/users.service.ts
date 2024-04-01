import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from '@node-rs/bcrypt';
import { getCache } from 'memcachelibrarybeta';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  async findOne(_id: any): Promise<any> {
    const res = await this.userRepository.findOne({ where: { _id: _id } });
    return { ...res, password: undefined };
  }

  async findOneByEmail(email: string): Promise<User> {
    // return this.userRepository.findOne({ where: { email } });
    const getUserByEmail = (emailId: string) =>
      this.userRepository.findOne({ where: { email: emailId } });
    return getCache(`${email}`, getUserByEmail, email);
  }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    createUserDto.password = hash;
    const newUser = await this.userRepository.save(createUserDto);
    return { ...newUser, password: undefined };
  }

  async findAll() {
    const user = await this.userRepository.find();
    return { ...user, password: undefined };
  }

  paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options);
  }
}
