import { IsNotEmpty, IsOptional, Length } from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  login: string;
  @IsOptional()
  @Length(8)
  password: string;
}
