import {
  boolean,
  index,
  integer,
  jsonb,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from 'drizzle-orm/pg-core';
import { relations } from 'drizzle-orm';

export const roleEnum = pgEnum('role', ['user', 'peer_educator', 'admin']);
export const bookingStatusEnum = pgEnum('booking_status', [
  'pending',
  'confirmed',
  'cancelled',
]);
export const sessionTypeEnum = pgEnum('session_type', [
  'chat',
  'voice',
  'video',
  'in_person',
]);
export const notificationTypeEnum = pgEnum('notification_type', [
  'booking',
  'chat',
  'resource',
  'system',
  'admin',
]);

const timestamps = {
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow().notNull(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
};

export const roles = pgTable('roles', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: roleEnum('name').notNull().unique(),
  description: text('description'),
  ...timestamps,
});

export const users = pgTable(
  'users',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    email: varchar('email', { length: 255 }).notNull().unique(),
    passwordHash: varchar('password_hash', { length: 255 }),
    isEmailVerified: boolean('is_email_verified').default(false).notNull(),
    lastLoginAt: timestamp('last_login_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [index('users_email_idx').on(table.email)],
);

export const userRoles = pgTable(
  'user_roles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    roleId: uuid('role_id')
      .notNull()
      .references(() => roles.id, { onDelete: 'cascade' }),
    ...timestamps,
  },
  (table) => [uniqueIndex('user_role_unique_idx').on(table.userId, table.roleId)],
);

export const profiles = pgTable(
  'profiles',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    fullName: varchar('full_name', { length: 120 }),
    bio: text('bio'),
    avatarUrl: text('avatar_url'),
    prefersAnonymity: boolean('prefers_anonymity').default(false).notNull(),
    shareMoodWithPeer: boolean('share_mood_with_peer').default(false).notNull(),
    preferences: jsonb('preferences').default({}).notNull(),
    ...timestamps,
  },
  (table) => [index('profiles_user_id_idx').on(table.userId)],
);

export const peerEducators = pgTable(
  'peer_educators',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .unique()
      .references(() => users.id, { onDelete: 'cascade' }),
    headline: varchar('headline', { length: 160 }),
    about: text('about'),
    yearsExperience: integer('years_experience'),
    isActive: boolean('is_active').default(true).notNull(),
    averageRating: integer('average_rating'),
    ratingCount: integer('rating_count').default(0).notNull(),
    ...timestamps,
  },
  (table) => [index('peer_educators_user_id_idx').on(table.userId)],
);

export const peerSpecializations = pgTable(
  'peer_specializations',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    peerEducatorId: uuid('peer_educator_id')
      .notNull()
      .references(() => peerEducators.id, { onDelete: 'cascade' }),
    tag: varchar('tag', { length: 80 }).notNull(),
    ...timestamps,
  },
  (table) => [
    index('peer_specializations_peer_idx').on(table.peerEducatorId),
    uniqueIndex('peer_specializations_unique_idx').on(table.peerEducatorId, table.tag),
  ],
);

export const resourceCategories = pgTable('resource_categories', {
  id: uuid('id').defaultRandom().primaryKey(),
  name: varchar('name', { length: 120 }).notNull().unique(),
  slug: varchar('slug', { length: 120 }).notNull().unique(),
  description: text('description'),
  ...timestamps,
});

export const resources = pgTable(
  'resources',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    categoryId: uuid('category_id')
      .notNull()
      .references(() => resourceCategories.id, { onDelete: 'restrict' }),
    title: varchar('title', { length: 180 }).notNull(),
    summary: text('summary'),
    body: text('body').notNull(),
    thumbnailUrl: text('thumbnail_url'),
    isPublished: boolean('is_published').default(true).notNull(),
    publishedAt: timestamp('published_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [
    index('resources_category_idx').on(table.categoryId),
    index('resources_published_idx').on(table.isPublished, table.publishedAt),
  ],
);

export const moodEntries = pgTable(
  'mood_entries',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    moodScore: integer('mood_score').notNull(),
    note: text('note'),
    recordedAt: timestamp('recorded_at', { withTimezone: true }).defaultNow().notNull(),
    ...timestamps,
  },
  (table) => [index('mood_entries_user_recorded_idx').on(table.userId, table.recordedAt)],
);

export const conversations = pgTable('conversations', {
  id: uuid('id').defaultRandom().primaryKey(),
  title: varchar('title', { length: 160 }),
  isGroup: boolean('is_group').default(false).notNull(),
  ...timestamps,
});

export const conversationParticipants = pgTable(
  'conversation_participants',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    joinedAt: timestamp('joined_at', { withTimezone: true }).defaultNow().notNull(),
    ...timestamps,
  },
  (table) => [
    uniqueIndex('conversation_participants_unique_idx').on(table.conversationId, table.userId),
    index('conversation_participants_user_idx').on(table.userId),
  ],
);

export const messages = pgTable(
  'messages',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    conversationId: uuid('conversation_id')
      .notNull()
      .references(() => conversations.id, { onDelete: 'cascade' }),
    senderUserId: uuid('sender_user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    body: text('body').notNull(),
    sentAt: timestamp('sent_at', { withTimezone: true }).defaultNow().notNull(),
    ...timestamps,
  },
  (table) => [
    index('messages_conversation_sent_idx').on(table.conversationId, table.sentAt),
    index('messages_sender_idx').on(table.senderUserId),
  ],
);

export const bookingSlots = pgTable(
  'booking_slots',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    peerEducatorId: uuid('peer_educator_id')
      .notNull()
      .references(() => peerEducators.id, { onDelete: 'cascade' }),
    startsAt: timestamp('starts_at', { withTimezone: true }).notNull(),
    endsAt: timestamp('ends_at', { withTimezone: true }).notNull(),
    isBooked: boolean('is_booked').default(false).notNull(),
    ...timestamps,
  },
  (table) => [
    index('booking_slots_peer_starts_idx').on(table.peerEducatorId, table.startsAt),
    index('booking_slots_booked_idx').on(table.isBooked),
  ],
);

export const bookings = pgTable(
  'bookings',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    peerEducatorId: uuid('peer_educator_id')
      .notNull()
      .references(() => peerEducators.id, { onDelete: 'cascade' }),
    slotId: uuid('slot_id')
      .notNull()
      .unique()
      .references(() => bookingSlots.id, { onDelete: 'restrict' }),
    status: bookingStatusEnum('status').default('pending').notNull(),
    sessionType: sessionTypeEnum('session_type').notNull(),
    notes: text('notes'),
    ...timestamps,
  },
  (table) => [
    index('bookings_user_idx').on(table.userId),
    index('bookings_peer_idx').on(table.peerEducatorId),
    index('bookings_status_idx').on(table.status),
  ],
);

export const notifications = pgTable(
  'notifications',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    userId: uuid('user_id')
      .notNull()
      .references(() => users.id, { onDelete: 'cascade' }),
    type: notificationTypeEnum('type').notNull(),
    title: varchar('title', { length: 160 }).notNull(),
    body: text('body').notNull(),
    metadata: jsonb('metadata').default({}).notNull(),
    isRead: boolean('is_read').default(false).notNull(),
    readAt: timestamp('read_at', { withTimezone: true }),
    ...timestamps,
  },
  (table) => [index('notifications_user_read_idx').on(table.userId, table.isRead)],
);

export const auditLogs = pgTable(
  'audit_logs',
  {
    id: uuid('id').defaultRandom().primaryKey(),
    actorUserId: uuid('actor_user_id').references(() => users.id, { onDelete: 'set null' }),
    action: varchar('action', { length: 160 }).notNull(),
    entityType: varchar('entity_type', { length: 120 }).notNull(),
    entityId: varchar('entity_id', { length: 120 }),
    metadata: jsonb('metadata').default({}).notNull(),
    ipAddress: varchar('ip_address', { length: 64 }),
    userAgent: text('user_agent'),
    ...timestamps,
  },
  (table) => [index('audit_logs_actor_action_idx').on(table.actorUserId, table.action)],
);

export const usersRelations = relations(users, ({ one, many }) => ({
  profile: one(profiles, { fields: [users.id], references: [profiles.userId] }),
  roles: many(userRoles),
  moodEntries: many(moodEntries),
  bookings: many(bookings),
  notifications: many(notifications),
}));

export const bookingsRelations = relations(bookings, ({ one }) => ({
  user: one(users, { fields: [bookings.userId], references: [users.id] }),
  peerEducator: one(peerEducators, {
    fields: [bookings.peerEducatorId],
    references: [peerEducators.id],
  }),
  slot: one(bookingSlots, { fields: [bookings.slotId], references: [bookingSlots.id] }),
}));
