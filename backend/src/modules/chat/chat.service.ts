import { Injectable } from '@nestjs/common';
import { ChatRepository } from './repositories/chat.repository';

@Injectable()
export class ChatService {
  constructor(private readonly chatRepository: ChatRepository) {}

  async getMessages(userId: string) {
    let convoId = await this.chatRepository.findConversationByUser(userId);
    if (!convoId) {
        convoId = await this.chatRepository.createConversation(userId);
    }
    
    const msgs = await this.chatRepository.listMessages(convoId);
    return msgs.reverse().map(m => ({
        id: m.id,
        fromSelf: m.senderUserId === userId,
        text: m.body,
        time: m.sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }));
  }

  async sendMessage(userId: string, text: string) {
    let convoId = await this.chatRepository.findConversationByUser(userId);
    if (!convoId) {
        convoId = await this.chatRepository.createConversation(userId);
    }
    
    const msg = await this.chatRepository.insertMessage(convoId, userId, text);
    return {
        id: msg.id,
        fromSelf: true,
        text: msg.body,
        time: msg.sentAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };
  }

  async escalate() {
    return { success: true };
  }
}
