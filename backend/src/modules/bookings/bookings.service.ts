import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { AuditService } from '../audit/audit.service';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ListBookingsDto } from './dto/list-bookings.dto';
import { BookingsRepository } from './repositories/bookings.repository';

@Injectable()
export class BookingsService {
  constructor(
    private readonly bookingsRepository: BookingsRepository,
    private readonly auditService: AuditService,
  ) {}

  async listSlots(peerEducatorId?: string) {
    return this.bookingsRepository.listOpenSlots(peerEducatorId);
  }

  async createBooking(userId: string, dto: CreateBookingDto) {
    const slot = await this.bookingsRepository.findSlotById(dto.slotId);
    if (!slot) {
      throw new NotFoundException('Slot not found');
    }

    if (slot.isBooked) {
      throw new BadRequestException('Slot already booked');
    }

    if (slot.peerEducatorId !== dto.peerEducatorId) {
      throw new BadRequestException('Slot does not belong to requested peer educator');
    }

    const booking = await this.bookingsRepository.createBooking({
      userId,
      peerEducatorId: dto.peerEducatorId,
      slotId: dto.slotId,
      sessionType: dto.sessionType,
      notes: dto.notes,
    });

    await this.bookingsRepository.markSlotBooked(dto.slotId);
    await this.auditService.logEvent({
      actorUserId: userId,
      action: 'booking_created',
      entityType: 'booking',
      entityId: booking.id,
      metadata: {
        peerEducatorId: dto.peerEducatorId,
        slotId: dto.slotId,
        sessionType: dto.sessionType,
      },
    });
    return booking;
  }

  async listBookings(userId: string, query: ListBookingsDto) {
    return this.bookingsRepository.listBookings({ userId, status: query.status });
  }
}
