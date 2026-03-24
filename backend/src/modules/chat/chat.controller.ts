import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { ChatService } from './chat.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { CurrentUser } from '../../common/decorators/current-user.decorator';
import type { RequestUser } from '../../common/types/request-user.type';

@Controller('chat')
@UseGuards(JwtAuthGuard)
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  @Get()
  getMessages(@CurrentUser() user: RequestUser) {
    return this.chatService.getMessages(user.sub);
  }

  @Post()
  sendMessage(@CurrentUser() user: RequestUser, @Body() body: any) {
    return this.chatService.sendMessage(user.sub, body.text);
  }

  @Post('escalate')
  escalate() {
    return this.chatService.escalate();
  }
}
