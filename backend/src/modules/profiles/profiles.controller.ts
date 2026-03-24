import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { ProfilesService } from './profiles.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/request-user.type';

@Controller('profile')
@UseGuards(JwtAuthGuard)
export class ProfilesController {
  constructor(private readonly profilesService: ProfilesService) {}

  @Get()
  getProfile(@CurrentUser() user: RequestUser) {
    return this.profilesService.getProfile(user.sub);
  }

  @Patch()
  updateProfile(@CurrentUser() user: RequestUser, @Body() body: any) {
    return this.profilesService.updateProfile(user.sub, body);
  }
}
