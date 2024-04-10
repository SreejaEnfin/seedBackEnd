import { User } from '../entities/user.entity';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleIds: string[];
}

export class UserDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleIds: string[];

  constructor(user?: Partial<User>) {
    if (user) {
      this._id = user._id;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.email = user.email;
      // TODO Temp typescript fix
      this.roleIds = user.roleIds;
    }
  }
}

export class SearchUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
}

export class ForgotPasswordDTO {
  email: string;
}

export class ResetPasswordDTO {
  password: string;
}
