import { IsEnum, IsOptional, IsString, IsUUID, MaxLength } from 'class-validator';

export class CreateBookingDto {
  @IsUUID()
  peerEducatorId!: string;

  @IsUUID()
  slotId!: string;

  @IsEnum(['chat', 'voice', 'video', 'in_person'])
  sessionType!: 'chat' | 'voice' | 'video' | 'in_person';

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;
}
