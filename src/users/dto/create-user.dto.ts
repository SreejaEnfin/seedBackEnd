import { User } from '../entities/user.entity';

export class CreateUserDto {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  roleId: string;
}

export class UserDto {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  roleId: string;

  constructor(user?: Partial<User>) {
    if (user) {
      this._id = user._id;
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.email = user.email;
      this.roleId = user.roleId;
    }
  }
}

export class SearchUserDTO {
  firstName?: string;
  lastName?: string;
  email?: string;
}
