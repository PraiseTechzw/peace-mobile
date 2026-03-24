import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import type { RequestUser } from '../../common/types/request-user.type';
import { CreateMoodEntryDto } from './dto/create-mood-entry.dto';
import { WellnessService } from './wellness.service';

@Controller('mood')
@UseGuards(JwtAuthGuard)
export class WellnessController {
  constructor(private readonly wellnessService: WellnessService) {}

  @Post()
  createMood(@CurrentUser() user: RequestUser, @Body() dto: CreateMoodEntryDto) {
    return this.wellnessService.createMood(user.sub, dto);
  }

  @Get('history')
  history(@CurrentUser() user: RequestUser) {
    return this.wellnessService.getMoodHistory(user.sub);
  }
}
