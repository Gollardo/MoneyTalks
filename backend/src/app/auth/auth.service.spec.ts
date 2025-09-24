import {
  BadRequestException,
  ForbiddenException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthService } from './auth.service';

describe('service', () => {
  let service: AuthService;
  let usersService: Partial<UsersService>;
  let jwtService: Partial<JwtService>;
  let usersRepo: Partial<Repository<User>>;

  const password = 'secret123';
  let salt: string;
  let passwordHash: string;

  beforeAll(async () => {
    salt = await bcrypt.genSalt();
    passwordHash = await bcrypt.hash(password, salt);
  });

  beforeEach(async () => {
    usersService = {
      save: jest.fn(async (u) => u),
    };

    usersRepo = {
      find: jest.fn(),
      save: jest.fn(),
    };

    jwtService = {
      sign: jest.fn().mockReturnValue('jwt-token'),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: getRepositoryToken(User), useValue: usersRepo },
        { provide: UsersService, useValue: usersService },
        { provide: JwtService, useValue: jwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  const makeUser = (overrides: Partial<User> = {}): User =>
    ({
      id: 'bcae515a-7138-4cd8-92f6-c4f79896a4eb',
      email: 'test@example.com',
      phone: '+79991234567',
      fullName: 'Test User',
      telegramChatId: '',
      passwordHash,
      salt,
      legacyId: '',
      roles: [],
      failedLoginAttempts: 0,
      isNeedToChangePassword: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      createdBy: null,
      updatedBy: null,
      ...overrides,
    }) as unknown as User;

  it('успешный вход по email', async () => {
    (usersRepo.find as jest.Mock).mockResolvedValue([makeUser()]);
    const res = await service.login({
      identifier: 'test@example.com',
      password,
    });
    expect(res.accessToken).toBe('jwt-token');
    expect(usersRepo.find).toHaveBeenCalledWith({
      where: { email: 'test@example.com' },
    });
  });

  it('успешный вход по телефону', async () => {
    (usersRepo.find as jest.Mock).mockResolvedValue([makeUser()]);
    const res = await service.login({
      identifier: '+7 (999) 123-45-67',
      password,
    });
    expect(res.accessToken).toBe('jwt-token');
    // Для телефона find вызывается с normalized phone
    expect(usersRepo.find).toHaveBeenCalledWith({
      where: { phone: '+79991234567' },
    });
  });

  it('пользователь не найден', async () => {
    (usersRepo.find as jest.Mock).mockResolvedValue([]);
    await expect(
      service.login({ identifier: 'unknown@example.com', password }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('несколько пользователей по телефону', async () => {
    (usersRepo.find as jest.Mock).mockResolvedValue([
      makeUser({ id: 'bcae515a-7138-4cd8-92f6-c4f79896a4eb' }),
      makeUser({ id: 'bcae515a-7138-4cd8-92f6-c4f79896a4e2' }),
    ]);
    await expect(
      service.login({ identifier: '+7 (999) 123-45-67', password }),
    ).rejects.toThrow(BadRequestException);
  });

  it('пользователь заблокирован', async () => {
    (usersRepo.find as jest.Mock).mockResolvedValue([
      makeUser({ failedLoginAttempts: 3 }),
    ]);
    await expect(
      service.login({ identifier: 'test@example.com', password }),
    ).rejects.toThrow(ForbiddenException);
  });

  it('неверный пароль', async () => {
    (usersRepo.find as jest.Mock).mockResolvedValue([makeUser()]);
    await expect(
      service.login({ identifier: 'test@example.com', password: 'wrongpass' }),
    ).rejects.toThrow(UnauthorizedException);
  });

  it('сбрасывает счётчик попыток при успешном входе', async () => {
    const user = makeUser({ failedLoginAttempts: 2 });
    (usersRepo.find as jest.Mock).mockResolvedValue([user]);
    await service.login({ identifier: 'test@example.com', password });
    expect(user.failedLoginAttempts).toBe(0);
    expect(usersService.save).toHaveBeenCalledWith(user);
  });
});
