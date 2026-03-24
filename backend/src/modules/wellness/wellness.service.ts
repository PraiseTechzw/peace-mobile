import { Injectable } from '@nestjs/common';
import { CreateMoodEntryDto } from './dto/create-mood-entry.dto';
import { WellnessRepository } from './repositories/wellness.repository';

@Injectable()
export class WellnessService {
  constructor(private readonly wellnessRepository: WellnessRepository) {}

  async createMood(userId: string, dto: CreateMoodEntryDto) {
    return this.wellnessRepository.createMoodEntry({
      userId,
      moodScore: dto.moodScore,
      note: dto.note,
    });
  }

  async getMoodHistory(userId: string) {
    return this.wellnessRepository.listMoodHistory(userId);
  }
}
