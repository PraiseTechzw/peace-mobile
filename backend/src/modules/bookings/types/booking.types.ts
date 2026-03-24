import { InferInsertModel, InferSelectModel } from 'drizzle-orm';
import { bookingSlots, bookings } from '../../../database/schema';

export type Booking = InferSelectModel<typeof bookings>;
export type NewBooking = InferInsertModel<typeof bookings>;
export type BookingSlot = InferSelectModel<typeof bookingSlots>;

export interface ListBookingsFilter {
  userId: string;
  status?: 'pending' | 'confirmed' | 'cancelled';
}
