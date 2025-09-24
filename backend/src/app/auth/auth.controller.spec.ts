import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { UnauthorizedException, BadRequestException } from '@nestjs/common';

describe('AuthController', () => {
  let controller: AuthController;
  let authService: Partial<AuthService>;

  beforeEach(async () => {
    authService = {
      login: jest.fn(),
      impersonateByEmail: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [{ provide: AuthService, useValue: authService }],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('должен вызывать login и возвращать accessToken', async () => {
    const dto = { identifier: 'test@example.com', password: 'secret' };
    (authService.login as jest.Mock).mockResolvedValue({
      accessToken: 'jwt-token',
    });

    const res = await controller.login(dto);

    expect(authService.login).toHaveBeenCalledWith(dto);
    expect(res.accessToken).toBe('jwt-token');
  });

  it('должен прокидывать исключение при ошибке login', async () => {
    const dto = { identifier: 'unknown@example.com', password: 'secret' };
    (authService.login as jest.Mock).mockRejectedValue(
      new UnauthorizedException(),
    );

    await expect(controller.login(dto)).rejects.toThrow(UnauthorizedException);
  });

  it('должен вызывать impersonateByEmail и возвращать accessToken', async () => {
    const email = 'user@example.com';
    (authService.impersonateByEmail as jest.Mock).mockResolvedValue({
      accessToken: 'jwt-token',
    });

    const res = await controller.impersonate(email);

    expect(authService.impersonateByEmail).toHaveBeenCalledWith(email);
    expect(res.accessToken).toBe('jwt-token');
  });

  it('должен прокидывать исключение при ошибке impersonate', async () => {
    const email = 'user@example.com';
    (authService.impersonateByEmail as jest.Mock).mockRejectedValue(
      new BadRequestException(),
    );

    await expect(controller.impersonate(email)).rejects.toThrow(
      BadRequestException,
    );
  });
});
