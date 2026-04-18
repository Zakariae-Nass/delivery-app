import { IsIn, IsString } from 'class-validator';

export class UpdateLivreurStatusDto {
  @IsString()
  @IsIn(['online', 'offline'])
  status: 'online' | 'offline';
}
