import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestUser } from '../../common/types/request-user.type';
import { CreateBookingDto } from './dto/create-booking.dto';
import { ListBookingsDto } from './dto/list-bookings.dto';
import { BookingsService } from './bookings.service';

@Controller()
@UseGuards(JwtAuthGuard)
export class BookingsController {
  constructor(private readonly bookingsService: BookingsService) {}

  @Get('slots')
  listSlots(@Query('peerEducatorId') peerEducatorId?: string) {
    return this.bookingsService.listSlots(peerEducatorId);
  }

  @Post('bookings')
  createBooking(@CurrentUser() user: RequestUser, @Body() dto: CreateBookingDto) {
    return this.bookingsService.createBooking(user.sub, dto);
  }

  @Get('bookings')
  listBookings(@CurrentUser() user: RequestUser, @Query() query: ListBookingsDto) {
    return this.bookingsService.listBookings(user.sub, query);
  }
}
