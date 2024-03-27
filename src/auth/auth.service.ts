import { BadRequestException, Injectable } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from '@node-rs/bcrypt';
@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService
  ) {}

  async signIn(
    email: string,
    password: string,
  ): Promise<{ access_token: string }> {
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      throw new BadRequestException('User does not exist');
    }
    if (!await bcrypt.compare(password, user?.password)) {
      throw new BadRequestException('Invalid password');
    }
    const payload = { _id: user._id, firstName: user.firstName, lastName: user.lastName };
    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}