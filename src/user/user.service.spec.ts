import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { User } from './user';
import { faker } from '@faker-js/faker';
import { AuthService } from '../auth/auth.service';
import { JwtModule, JwtService } from '@nestjs/jwt';
import { JwtStrategy } from '../auth/strategies/jwt-strategy';
import { LocalStrategy } from '../auth/strategies/local-strategy';
import { PassportModule } from '@nestjs/passport';
import { UserModule } from './user.module';
import constants from '../shared/security/constants';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        UserModule,
        PassportModule,
        JwtModule.register({
          secret: constants.JWT_SECRET,
          signOptions: { expiresIn: '60s' },
        }),
      ],
      providers: [
        UserService,
        AuthService,
        JwtService,
        LocalStrategy,
        JwtStrategy,
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
  it('findOne should return a user by username', async () => {
    const storedUser: User = new User(1, 'admin', 'admin', []);
    const user: User = await service.findOne(storedUser.username);
    expect(user).not.toBeNull();
    expect(user.username).toEqual(storedUser.username);
  });

  it('findOne should throw an exception for an invalid user', async () => {
    await expect(() => service.findOne('0')).rejects.toHaveProperty(
      'message',
      'The user with the given username was not found',
    );
  });
});
