import { Exclude, Expose } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';

@Exclude()
export class UpdateUserDto {
  @Expose()
  login?: string;
  @Expose()
  password?: string;
}
