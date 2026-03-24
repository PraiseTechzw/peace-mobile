import { Injectable } from '@nestjs/common';
import { and, eq, isNull } from 'drizzle-orm';
import { DatabaseService } from '../../../database/database.service';
import { roles, userRoles, users } from '../../../database/schema';

@Injectable()
export class AuthRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async findUserByEmail(email: string) {
    const [user] = await this.databaseService.db
      .select()
      .from(users)
      .where(and(eq(users.email, email), isNull(users.deletedAt)))
      .limit(1);
    return user;
  }

  async createUser(input: { email: string; passwordHash: string }) {
    const [user] = await this.databaseService.db
      .insert(users)
      .values({
        email: input.email,
        passwordHash: input.passwordHash,
      })
      .returning();
    return user;
  }

  async ensureRole(name: 'user' | 'peer_educator' | 'admin') {
    const [existing] = await this.databaseService.db
      .select()
      .from(roles)
      .where(eq(roles.name, name))
      .limit(1);
    if (existing) {
      return existing;
    }
    const [created] = await this.databaseService.db
      .insert(roles)
      .values({ name, description: `${name} role` })
      .returning();
    return created;
  }

  async addUserRole(userId: string, roleId: string) {
    const [existing] = await this.databaseService.db
      .select()
      .from(userRoles)
      .where(and(eq(userRoles.userId, userId), eq(userRoles.roleId, roleId)))
      .limit(1);
    if (!existing) {
      await this.databaseService.db.insert(userRoles).values({ userId, roleId });
    }
  }

  async getUserRoles(userId: string) {
    const rows = await this.databaseService.db
      .select({ roleName: roles.name })
      .from(userRoles)
      .innerJoin(roles, eq(roles.id, userRoles.roleId))
      .where(eq(userRoles.userId, userId));

    return rows.map((row) => row.roleName);
  }

  async updateLastLogin(userId: string) {
    await this.databaseService.db
      .update(users)
      .set({ lastLoginAt: new Date(), updatedAt: new Date() })
      .where(eq(users.id, userId));
  }
}
