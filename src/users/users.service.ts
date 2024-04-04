import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { ILike, MongoRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from '@node-rs/bcrypt';
import { delCache, getCache } from 'memcachelibrarybeta';
import { determineDB } from 'src/utils/helper';

const isMongoDB = determineDB() === 'mongo';
import {
  IPaginationOptions,
  Pagination,
  paginate,
} from 'nestjs-typeorm-paginate';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(User) private mongoUserRepository: MongoRepository<User>,
  ) { }

  async findOne(_id: any): Promise<User> {
    // await delCache(_id)
    const getUserById = (_id: any) => this.userRepository.findOne(_id);
    return getCache(_id, getUserById, _id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
    // const getUserByEmail = (emailId: string) =>
    //   this.userRepository.findOne({ where: { email: emailId } });
    // return getCache(email, getUserByEmail, email);
  }

  findByKeyword(keyword: string) {
    if(isMongoDB) {
      return this.mongoUserRepository.find({ 
        where: { 
          $or: [
            { firstName: { $regex: keyword, $options: "i" } },
            { lastName: { $regex: keyword, $options: "i" } },
          ] 
        },
        select: ["_id", "firstName", "lastName", "email"],
      });
    } else {
      return this.userRepository.find({ 
        where: [{ firstName: ILike(`%${keyword}%`) }, { lastName: ILike(`%${keyword}%`) }],
        select: ["_id", "firstName", "lastName", "email"]
      })
    }
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

  findAll() {
    return this.userRepository.find({
      select: ["_id", "firstName", "lastName", "email"]
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  paginate(options: IPaginationOptions): Promise<Pagination<User>> {
    return paginate<User>(this.userRepository, options);
  }
}
