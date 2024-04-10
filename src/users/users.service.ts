import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CreateUserDto,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  UserDto,
} from './dto/create-user.dto';
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
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    @InjectRepository(User) private mongoUserRepository: MongoRepository<User>,
    private jwtService: JwtService,
  ) {}

  async findOne(_id: any): Promise<User> {
    // await delCache(_id)
    const getUserById = async (_id: any) => {
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

  async Validate(_id: any): Promise<any> {
    const user = await this.userRepository.findOneBy({ _id: _id });
    if (user) {
      return {
        user: {
          uuid: user._id,
          role: 'user',
          data: {
            displayName: user.firstName + ' ' + user.lastName,
            email: user.email,
          },
        },
      };
    } else {
      throw new NotFoundException('user not found');
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
      select: ['_id', 'firstName', 'lastName', 'email'],
    });
  }

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

  async forgotpassword(forgotPassword: ForgotPasswordDTO) {
    console.log('Hitting.......');
    const user = await this.findOneByEmail(forgotPassword.email);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    const payload = {
      _id: user._id,
      firstName: user.firstName,
      lastName: user.lastName,
    };

    const access_token = await this.jwtService.signAsync(payload);
    console.log(access_token);

    const resetPasswordURL = `http://localhost:3000/reset-password/${access_token}`;
    console.log(resetPasswordURL);
    return resetPasswordURL;
  }

  async resetPassword(resetPassword: ResetPasswordDTO, _id: any) {
    console.log(_id);
    const user = await this.userRepository.findOne({ where: { _id } });
    console.log(user, 'user....');

    if (user) {
      const saltRounds = 10;
      const hash = await bcrypt.hash(resetPassword.password, saltRounds);
      user.password = hash;
    }
    await this.userRepository.save(user);
    const { password, ...rest } = user;
    return rest;
  }
}
