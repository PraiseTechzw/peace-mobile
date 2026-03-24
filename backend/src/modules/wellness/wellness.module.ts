import { Module } from '@nestjs/common';
import { WellnessController } from './wellness.controller';
import { WellnessService } from './wellness.service';
import { WellnessRepository } from './repositories/wellness.repository';

@Module({
  controllers: [WellnessController],
  providers: [WellnessService, WellnessRepository],
})
export class WellnessModule {}
