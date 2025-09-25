import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Param,
  Query,
  Body,
  DefaultValuePipe,
  ParseIntPipe,
} from '@nestjs/common';
import { AccountService } from './account.service';
import { Account } from './account.entity';

@Controller('accounts')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Post()
  create(@Body() data: Partial<Account>) {
    return this.accountService.create(data);
  }

  @Get()
  findAll(
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('type') type?: 'expense' | 'savings',
    @Query('includeRelations', new DefaultValuePipe(false))
    includeRelations?: boolean,
  ) {
    return this.accountService.findAll(page, limit, type, includeRelations);
  }

  @Get('by-name')
  findByName(
    @Query('name') name: string,
    @Query('includeRelations', new DefaultValuePipe(false))
    includeRelations?: boolean,
  ) {
    return this.accountService.findByName(name, includeRelations);
  }

  @Get(':id')
  findById(
    @Param('id', ParseIntPipe) id: number,
    @Query('includeRelations', new DefaultValuePipe(false))
    includeRelations?: boolean,
  ) {
    return this.accountService.findById(id, includeRelations);
  }

  @Put(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() data: Partial<Account>,
  ) {
    return this.accountService.update(id, data);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.accountService.remove(id);
  }
}
