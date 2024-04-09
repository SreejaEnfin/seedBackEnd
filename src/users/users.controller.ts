import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto, UserDto } from './dto/create-user.dto';
import { Public } from 'src/auth/auth.decorator';
import { IPaginationOptions, Pagination } from 'nestjs-typeorm-paginate';
import { ObjectId } from 'mongodb';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  getProfile(@Request() request) {
    if (process.env.DB_TYPE === 'postgres') {
      return this.usersService.findOne(request.user._id);
    } else {
      const objectId = new ObjectId(request.user._id);
      return this.usersService.findOne(objectId);
    }
  }

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }
  @Public()
  @Get()
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number = 12,
    @Query('search') search?: string,
  ): Promise<Pagination<UserDto>> {
    limit = limit > 100 ? 100 : limit;
    const options: IPaginationOptions = {
      page,
      limit,
    };

    let users: Pagination<UserDto>;

    if (search) {
      users = await this.usersService.searchAndPaginate(options, search);
    } else {
      users = await this.usersService.paginate(options);
    }

    // const users = await this.usersService.paginate(options);
    return users;
    // return this.usersService.paginate({
    //   page,
    //   limit,
    // });
  }
}
