import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateMoodEntryDto {
  @IsInt()
  @Min(1)
  @Max(4)
  moodScore!: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  note?: string;
}
