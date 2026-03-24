import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from './database/database.module';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { ProfilesModule } from './modules/profiles/profiles.module';
import { PeerEducatorsModule } from './modules/peer-educators/peer-educators.module';
import { ResourcesModule } from './modules/resources/resources.module';
import { WellnessModule } from './modules/wellness/wellness.module';
import { ChatModule } from './modules/chat/chat.module';
import { BookingsModule } from './modules/bookings/bookings.module';
import { NotificationsModule } from './modules/notifications/notifications.module';
import { AdminModule } from './modules/admin/admin.module';
import { AuditModule } from './modules/audit/audit.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
    AuthModule,
    UsersModule,
    ProfilesModule,
    PeerEducatorsModule,
    ResourcesModule,
    WellnessModule,
    ChatModule,
    BookingsModule,
    NotificationsModule,
    AdminModule,
    AuditModule,
  ],
})
export class AppModule {}
