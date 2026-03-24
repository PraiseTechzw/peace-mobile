import { Controller, Get, UseGuards } from '@nestjs/common';
import { PeerEducatorsService } from './peer-educators.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@Controller('peer-educators')
@UseGuards(JwtAuthGuard)
export class PeerEducatorsController {
  constructor(private readonly peerService: PeerEducatorsService) {}

  @Get()
  getPeers() {
    return this.peerService.getPeerEducators();
  }
}
