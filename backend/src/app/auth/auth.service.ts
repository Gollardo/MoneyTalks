import {
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { Repository } from 'typeorm';
import { User } from '../users/user.entity';
import { UsersService } from '../users/users.service';
import { AuthResponseDto } from './dto/auth-response.dto';
import { LoginDto } from './dto/login.dto';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(identifier: string, password: string) {
    const users = await this.usersRepo.find({ where: { login: identifier } });

    if (!users || users.length === 0) {
      throw new UnauthorizedException('Пользователь не найден');
    }

    const user = users[0];

    if (user.failedLoginAttempts >= 3) {
      throw new ForbiddenException(
        'Пользователь заблокирован. Обратитесь к администратору.',
      );
    }

    const hash = await bcrypt.hash(password, user.salt);
    if (hash !== user.passwordHash) {
      user.failedLoginAttempts += 1;
      await this.usersService.save(user);
      throw new UnauthorizedException('Неверный пароль');
    }

    if (user.failedLoginAttempts > 0) {
      user.failedLoginAttempts = 0;
      await this.usersService.save(user);
    }

    return user;
  }

  async login(dto: LoginDto): Promise<AuthResponseDto> {
    const user = await this.validateUser(dto.identifier, dto.password);

    const payload = {
      sub: user.id,
      user: user.login,
    };

    return {
      accessToken: this.jwtService.sign(payload),
    };
  }
}
