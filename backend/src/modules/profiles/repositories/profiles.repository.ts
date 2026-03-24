import { Injectable } from '@nestjs/common';
import { eq, sql } from 'drizzle-orm';
import { DatabaseService } from '../../../database/database.service';
import { profiles, moodEntries, bookings, resources } from '../../../database/schema';

@Injectable()
export class ProfilesRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findByUserId(userId: string) {
    const [profile] = await this.databaseService.db
      .select()
      .from(profiles)
      .where(eq(profiles.userId, userId))
      .limit(1);
    return profile;
  }

  async update(userId: string, data: Partial<typeof profiles.$inferInsert>) {
    const [updated] = await this.databaseService.db
      .update(profiles)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(profiles.userId, userId))
      .returning();
    return updated;
  }

  async getCounts(userId: string) {
    const [checkIns] = await this.databaseService.db
      .select({ count: sql<number>`count(*)` })
      .from(moodEntries)
      .where(eq(moodEntries.userId, userId));

    const [sessions] = await this.databaseService.db
      .select({ count: sql<number>`count(*)` })
      .from(bookings)
      .where(eq(bookings.userId, userId));

    const [resCount] = await this.databaseService.db
      .select({ count: sql<number>`count(*)` })
      .from(resources); // Simple total for now

    return {
      checkIns: Number(checkIns?.count || 0),
      sessions: Number(sessions?.count || 0),
      resources: Number(resCount?.count || 0),
    };
  }
}
