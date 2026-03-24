import { IsEnum, IsOptional } from 'class-validator';

export class ListBookingsDto {
  @IsOptional()
  @IsEnum(['pending', 'confirmed', 'cancelled'])
  status?: 'pending' | 'confirmed' | 'cancelled';
}
