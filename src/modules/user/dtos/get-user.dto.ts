import { IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GetAllUsersDto {
  @ApiProperty()
  @IsOptional()
  role?: number;
}
