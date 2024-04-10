import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto, UserDto } from './dto/create-user.dto';
import { ILike, MongoRepository, Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from '@node-rs/bcrypt';
import { getCache } from 'memcachelibrarybeta';
import { determineDB } from 'src/utils/helper';
import { ObjectId } from 'mongodb';

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
  ) {}

  async findOne(_id: any): Promise<User> {
    // await delCache(_id)
    const getUserById = (_id: any) => {
      if (isMongoDB) {
        return this.mongoUserRepository.findOne({
          where: { _id: new ObjectId(_id) },
        });
      }
      return this.userRepository.findOne({ where: { _id: _id } });
    };
    return getCache(_id, getUserById, _id);
  }

  async findOneByEmail(email: string): Promise<User> {
    return this.userRepository.findOne({ where: { email } });
    // const getUserByEmail = (emailId: string) =>
    //   this.userRepository.findOne({ where: { email: emailId } });
    // return getCache(email, getUserByEmail, email);
  }

  findByKeyword(keyword: string) {
    if (isMongoDB) {
      return this.mongoUserRepository.find({
        where: {
          $or: [
            { firstName: { $regex: keyword, $options: 'i' } },
            { lastName: { $regex: keyword, $options: 'i' } },
          ],
        },
        select: ['_id', 'firstName', 'lastName', 'email'],
      });
    } else {
      return this.userRepository.find({
        where: [
          { firstName: ILike(`%${keyword}%`) },
          { lastName: ILike(`%${keyword}%`) },
        ],
        select: ['_id', 'firstName', 'lastName', 'email'],
      });
    }
  }
  // async findOne(_id: any): Promise<any> {
  //   const user = await this.userRepository.findOneBy({ _id: _id });
  //   if (user) {
  //     return {
  //       user: {
  //         uuid: user._id,
  //         role: 'user',
  //         data: {
  //           displayName: user.firstName + ' ' + user.lastName,
  //           email: user.email,
  //         },
  //       },
  //     };
  //   } else {
  //     throw new NotFoundException('user not found');
  //   }
  // }

  // async findOneByEmail(email: string): Promise<User> {
  //   const getUserByEmail = (emailId: string) =>
  //     this.userRepository.findOne({ where: { email: emailId } });
  //   return getCache(`${email}`, getUserByEmail, email);
  // }

  async create(createUserDto: CreateUserDto) {
    const { email, password } = createUserDto;
    const user = await this.userRepository.findOne({ where: { email } });
    if (user) {
      throw new BadRequestException('User already exists');
    }
    const saltRounds = 10;
    const hash = await bcrypt.hash(password, saltRounds);
    createUserDto.password = hash;
    createUserDto.roleId = '660bde226f92f9623487271a';
    const newUser = await this.userRepository.save(createUserDto);
    return { ...newUser, password: undefined };
  }

  findAll() {
    return this.userRepository.find({
      select: ['_id', 'firstName', 'lastName', 'email'],
    });
  }

  // findOne(id: number) {
  //   return `This action returns a #${id} user`;
  // }

  // paginate(options: IPaginationOptions): Promise<Pagination<User>> {
  //   return paginate<User>(this.userRepository, options);
  // }
  // async paginate(
  //   options: IPaginationOptions,
  //   search: SearchUserDTO,
  // ): Promise<Pagination<UserDto>> {
  //   const queryBuilder = this.userRepository.createQueryBuilder('user');

  //   if (search) {
  //     queryBuilder.where(
  //       'user.firstName LIKE :search OR user.lastName LIKE :search OR user.email LIKE :search',
  //       {
  //         search: `%${search}`,
  //       },
  //     );
  //   }
  //   console.log(search);
  //   const { items, ...paginationInfo } = await paginate<User>(
  //     queryBuilder,
  //     options,
  //   );
  //   const users = items.map((user) => new UserDto(user)); // Map to UserDto
  //   return { items: users, ...paginationInfo };
  // }

  async paginate(options: IPaginationOptions): Promise<Pagination<UserDto>> {
    const { items, ...paginationInfo } = await paginate<User>(
      this.userRepository,
      options,
    );
    const users = items.map((user) => new UserDto(user)); // Map to UserDto
    return { items: users, ...paginationInfo };
  }

  async searchAndPaginate(
    options: IPaginationOptions,
    search: string,
  ): Promise<Pagination<UserDto>> {
    const page = Number(options.page);
    const limit = Number(options.limit);

    if (this.userRepository instanceof MongoRepository) {
      const query = {
        $or: [
          { firstName: { $regex: new RegExp(search, 'i') } },
          { lastName: { $regex: new RegExp(search, 'i') } },
          { email: { $regex: new RegExp(search) } },
        ],
      };
      const totalItems = await this.userRepository.countDocuments(query);
      const items = await this.userRepository.find({
        skip: (page - 1) * limit,
        take: limit,
        where: query,
      });

      const users = items.map((user) => new UserDto(user));

      return {
        items: users,
        meta: {
          totalItems,
          itemCount: items.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
        },
      };
    } else {
      const queryBuilder = this.userRepository
        .createQueryBuilder('User')
        .where(
          'User.firstName LIKE :searchTerm OR User.lastName LIKE :searchTerm OR User.email LIKE :searchTerm',
          { searchTerm: `%${search}%` },
        )
        .skip((page - 1) * limit)
        .take(limit);

      const [items, totalItems] = await queryBuilder.getManyAndCount();

      const users = items.map((user) => new UserDto(user));

      return {
        items: users,
        meta: {
          totalItems,
          itemCount: items.length,
          itemsPerPage: limit,
          totalPages: Math.ceil(totalItems / limit),
          currentPage: page,
        },
      };
    }
  }
}
