import {
  Controller,
  Get,
  Post,
  Body,
  Request,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import {
  CreateUserDto,
  ForgotPasswordDTO,
  ResetPasswordDTO,
  UserDto,
} from './dto/create-user.dto';
import { Public } from 'src/auth/auth.decorator';
import { CheckPolicies } from 'src/casl/casl.decorator';
import {
  AppAbility,
  CaslAbilityFactory,
} from 'src/casl/casl-ability.factory/casl-ability.factory';
import { PoliciesGuard } from 'src/casl/policies.guard';
import { Pagination, IPaginationOptions } from 'nestjs-typeorm-paginate';
import { ObjectId } from 'mongodb';

@Controller('users')
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private caslAbilityFactory: CaslAbilityFactory,
  ) {}

  @Get('profile')
  // getProfile(@Request() req) {
  //   const ability = this.caslAbilityFactory.createForUser(req.user);
  //   if(ability.can('exportUsers', 'users')) {
  //     return this.usersService.findByKeyword("joh");
  //   } else {
  //     throw new ForbiddenException('Not allowed');
  // }
  getProfile(@Request() request) {
    if (process.env.DB_TYPE === 'postgres') {
      return this.usersService.Validate(request.user._id);
    } else {
      const objectId = new ObjectId(request.user._id);
      return this.usersService.Validate(objectId);
    }
  }

  @Public()
  @Post()
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  // @UseGuards(PoliciesGuard)
  // @CheckPolicies((ability: AppAbility) => ability.can('viewUsers', 'users'))
  async findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page = 1,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit = 10,
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
    return users;
  }
  @Public()
  @Post('password/forgot')
  forgotPassword(@Body() forgotPasswordDTO: ForgotPasswordDTO) {
    return this.usersService.forgotpassword(forgotPasswordDTO);
  }

  @Post('reset/password')
  resetPassword(@Request() request, @Body() resetPassword: ResetPasswordDTO) {
    if (process.env.DB_TYPE === 'postgres') {
      return this.usersService.resetPassword(resetPassword, request.user._id);
    } else {
      const objectId = new ObjectId(request.user._id);
      return this.usersService.resetPassword(resetPassword, objectId);
    }
  }
}
