import { Injectable } from '@nestjs/common';
import { eq, desc, and } from 'drizzle-orm';
import { DatabaseService } from '../../../database/database.service';
import { messages, conversations, conversationParticipants } from '../../../database/schema';

@Injectable()
export class ChatRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findConversationByUser(userId: string) {
    const [participated] = await this.databaseService.db
      .select({ conversationId: conversationParticipants.conversationId })
      .from(conversationParticipants)
      .where(eq(conversationParticipants.userId, userId))
      .limit(1);
    return participated?.conversationId;
  }

  async createConversation(userId: string) {
    const [convo] = await this.databaseService.db
      .insert(conversations)
      .values({ title: 'AI Support Chat', isGroup: false })
      .returning();
    
    await this.databaseService.db
      .insert(conversationParticipants)
      .values({ conversationId: convo.id, userId })
    
    return convo.id;
  }

  async listMessages(conversationId: string, limit = 50) {
    return this.databaseService.db
      .select()
      .from(messages)
      .where(eq(messages.conversationId, conversationId))
      .orderBy(desc(messages.sentAt))
      .limit(limit);
  }

  async insertMessage(conversationId: string, senderId: string, body: string) {
    const [inserted] = await this.databaseService.db
        .insert(messages)
        .values({ conversationId, senderUserId: senderId, body })
        .returning();
    return inserted;
  }
}
