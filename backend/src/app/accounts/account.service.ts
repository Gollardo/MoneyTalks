import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, SelectQueryBuilder } from 'typeorm';
import { Account } from './account.entity';

@Injectable()
export class AccountService {
  constructor(
    @InjectRepository(Account)
    private readonly accountRepo: Repository<Account>,
  ) {}

  private buildBaseQuery(
    includeRelations = false,
  ): SelectQueryBuilder<Account> {
    const qb = this.accountRepo.createQueryBuilder('account');
    if (includeRelations) {
      qb.leftJoinAndSelect(
        'account.operations',
        'operations',
      ).leftJoinAndSelect('account.fundBalances', 'fundBalances');
    }
    return qb;
  }

  async create(data: Partial<Account>): Promise<Account> {
    const entity = this.accountRepo.create(data);
    return this.accountRepo.save(entity);
  }

  async findAll(
    page = 1,
    limit = 10,
    type?: 'expense' | 'savings',
    includeRelations = false,
  ) {
    const qb = this.buildBaseQuery(includeRelations);

    if (type) {
      qb.andWhere('account.type = :type', { type });
    }

    qb.orderBy('account.name', 'ASC')
      .skip((page - 1) * limit)
      .take(limit + 1);

    const result = await qb.getMany();

    const isNextPageExist = result.length > limit;
    return {
      page,
      isNextPageExist,
      data: result.slice(0, limit),
    };
  }

  async findById(id: number, includeRelations = false): Promise<Account> {
    const qb = this.buildBaseQuery(includeRelations);
    qb.where('account.id = :id', { id });
    const entity = await qb.getOne();
    if (!entity) throw new NotFoundException(`Account ${id} not found`);
    return entity;
  }

  async findByName(name: string, includeRelations = false): Promise<Account[]> {
    const qb = this.buildBaseQuery(includeRelations);
    qb.where('account.name ILIKE :name', { name: `%${name}%` }).orderBy(
      'account.name',
      'ASC',
    );
    return qb.getMany();
  }

  async update(id: number, data: Partial<Account>): Promise<Account> {
    const entity = await this.findById(id);
    Object.assign(entity, data);
    return this.accountRepo.save(entity);
  }

  async remove(id: number): Promise<void> {
    await this.accountRepo.delete(id);
  }
}
