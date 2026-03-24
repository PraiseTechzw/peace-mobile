import { Injectable } from '@nestjs/common';
import { and, asc, eq } from 'drizzle-orm';
import { DatabaseService } from '../../../database/database.service';
import { bookingSlots, bookings } from '../../../database/schema';
import { ListBookingsFilter } from '../types/booking.types';

@Injectable()
export class BookingsRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async listOpenSlots(peerEducatorId?: string) {
    const whereClause = peerEducatorId
      ? and(eq(bookingSlots.peerEducatorId, peerEducatorId), eq(bookingSlots.isBooked, false))
      : eq(bookingSlots.isBooked, false);

    return this.databaseService.db
      .select()
      .from(bookingSlots)
      .where(whereClause)
      .orderBy(asc(bookingSlots.startsAt));
  }

  async findSlotById(slotId: string) {
    const [slot] = await this.databaseService.db
      .select()
      .from(bookingSlots)
      .where(eq(bookingSlots.id, slotId))
      .limit(1);
    return slot;
  }

  async createBooking(input: {
    userId: string;
    peerEducatorId: string;
    slotId: string;
    sessionType: 'chat' | 'voice' | 'video' | 'in_person';
    notes?: string;
  }) {
    const [booking] = await this.databaseService.db
      .insert(bookings)
      .values({
        userId: input.userId,
        peerEducatorId: input.peerEducatorId,
        slotId: input.slotId,
        sessionType: input.sessionType,
        notes: input.notes,
        status: 'pending',
      })
      .returning();

    return booking;
  }

  async markSlotBooked(slotId: string) {
    await this.databaseService.db
      .update(bookingSlots)
      .set({ isBooked: true, updatedAt: new Date() })
      .where(eq(bookingSlots.id, slotId));
  }

  async listBookings(filter: ListBookingsFilter) {
    const whereClause = filter.status
      ? and(eq(bookings.userId, filter.userId), eq(bookings.status, filter.status))
      : eq(bookings.userId, filter.userId);

    return this.databaseService.db
      .select()
      .from(bookings)
      .where(whereClause)
      .orderBy(asc(bookings.createdAt));
  }
}
