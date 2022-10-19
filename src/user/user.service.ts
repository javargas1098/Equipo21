import { Injectable } from '@nestjs/common';
import { Role } from '../shared/roles/role';
import { User } from './user';
import {
  BusinessError,
  BusinessLogicException,
} from '../shared/errors/business-errors';

@Injectable()
export class UserService {
  private readonly users: User[] = [
    new User(1, 'admin', 'admin', [Role.ADMIN]),
    new User(2, 'reader', 'reader', [Role.USER_READER]),
    new User(3, 'specific', 'specific', [Role.USER_SPECIFIC]),
    new User(4, 'creator', 'creator', [Role.USER_CREATOR]),
    new User(5, 'remover', 'remover', [Role.USER_REMOVER]),
  ];

  async findOne(username: string): Promise<User | undefined> {
    const user = this.users.find((user) => user.username === username);
    if (!user)
      throw new BusinessLogicException(
        'The user with the given username was not found',
        BusinessError.NOT_FOUND,
      );
    else return user;
  }
}
