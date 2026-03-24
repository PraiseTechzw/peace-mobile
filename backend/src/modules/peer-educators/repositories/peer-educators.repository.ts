import { Injectable } from '@nestjs/common';
import { eq } from 'drizzle-orm';
import { DatabaseService } from '../../../database/database.service';
import { peerEducators, profiles, peerSpecializations } from '../../../database/schema';

@Injectable()
export class PeerEducatorsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async listActive() {
    return this.databaseService.db
      .select({
        id: peerEducators.id,
        name: profiles.fullName,
        rating: peerEducators.averageRating,
        available: peerEducators.isActive, // Basic map for now
      })
      .from(peerEducators)
      .leftJoin(profiles, eq(peerEducators.userId, profiles.userId))
      .where(eq(peerEducators.isActive, true));
  }

  async getSpecializations(peerId: string) {
    return this.databaseService.db
      .select({ tag: peerSpecializations.tag })
      .from(peerSpecializations)
      .where(eq(peerSpecializations.peerEducatorId, peerId));
  }
}
