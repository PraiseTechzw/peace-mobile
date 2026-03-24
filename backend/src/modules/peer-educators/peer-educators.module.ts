import { Module } from '@nestjs/common';
import { PeerEducatorsController } from './peer-educators.controller';
import { PeerEducatorsService } from './peer-educators.service';
import { PeerEducatorsRepository } from './repositories/peer-educators.repository';

@Module({
  controllers: [PeerEducatorsController],
  providers: [PeerEducatorsService, PeerEducatorsRepository],
})
export class PeerEducatorsModule {}
