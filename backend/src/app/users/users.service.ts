import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import * as bcrypt from 'bcrypt';
import { In, QueryFailedError, Repository } from 'typeorm';
import { ChangePasswordDto } from './dto/change-password.dto';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepo: Repository<User>,
  ) {}

  async findAll(query: {
    page?: number;
    limit?: number;
    sortBy?: string;
    sortOrder?: 'ASC' | 'DESC';
  }) {
    const page = parseInt(query.page as any) || 1;
    const limit = parseInt(query.limit as any) || 15;
    const skip = (page - 1) * limit;
    const sortBy = query.sortBy ?? 'fullName';
    const sortOrder = query.sortOrder ?? 'ASC';

    const [items, total] = await this.usersRepo.findAndCount({
      skip,
      take: limit,
      order: {
        [sortBy]: sortOrder,
      },
    });

    return {
      data: items,
      total,
      page,
      hasMore: skip + limit < total,
    };
  }

  findOne(id: string) {
    return this.usersRepo.findOne({ where: { id } });
  }

  async create(dto: CreateUserDto): Promise<User> {
    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.password, salt);

    const user = this.usersRepo.create({
      login: dto.login,
      passwordHash,
      salt,
    });

    try {
      return await this.usersRepo.save(user);
    } catch (error) {
      if (
        error instanceof QueryFailedError &&
        (error as any).code === '23505'
      ) {
        // 23505 = unique_violation (Postgres)
        throw new ConflictException(
          'Пользователь с таким логином уже существует',
        );
      }

      // если другая ошибка
      throw new InternalServerErrorException(
        'Ошибка при создании пользователя',
      );
    }
  }

  async update(id: string, dto: UpdateUserDto): Promise<User | null> {
    const user = await this.usersRepo.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    // Только разрешённые поля
    const allowedFields: Partial<User> = {
      login: dto.login,
    };

    Object.assign(user, allowedFields);

    await this.usersRepo.save(user);
    return this.findOne(id);
  }

  async remove(id: string) {
    const usr = await this.findOne(id);
    if (!usr) throw new NotFoundException('Пользователь не найден');
    return this.usersRepo.delete(id);
  }

  getRepository() {
    return this.usersRepo;
  }

  async save(user: User): Promise<User> {
    return this.usersRepo.save(user);
  }

  async changePassword(userId: string, dto: ChangePasswordDto): Promise<void> {
    const user = await this.usersRepo.findOne({ where: { id: userId } });
    if (!user) {
      throw new NotFoundException('Пользователь не найден');
    }

    const isPasswordValid = await bcrypt.compare(
      dto.currentPassword,
      user.passwordHash,
    );
    if (!isPasswordValid) {
      throw new UnauthorizedException('Текущий пароль неверный');
    }

    const salt = await bcrypt.genSalt();
    const passwordHash = await bcrypt.hash(dto.newPassword, salt);

    user.passwordHash = passwordHash;
    user.salt = salt;

    await this.usersRepo.save(user);
  }
}
