import { Injectable } from '@nestjs/common';
import { desc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../../database/database.service';
import { moodEntries } from '../../../database/schema';

@Injectable()
export class WellnessRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async createMoodEntry(input: { userId: string; moodScore: number; note?: string }) {
    const [entry] = await this.databaseService.db
      .insert(moodEntries)
      .values({
        userId: input.userId,
        moodScore: input.moodScore,
        note: input.note,
      })
      .returning();
    return entry;
  }

  async listMoodHistory(userId: string, limit = 30) {
    return this.databaseService.db
      .select()
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId))
      .orderBy(desc(moodEntries.recordedAt))
      .limit(limit);
  }
}
