import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDrizzle } from 'src/db/db.decorator';
import type { DrizzleDatabase } from 'src/db/db.type';
import { eq, sql } from 'drizzle-orm';
import { users } from 'src/db/schema';
import { User } from './types/user.type';

@Injectable()
export class UsersService {
  constructor(@InjectDrizzle() private readonly db: DrizzleDatabase) {}

  async findByUsername(userName: string): Promise<User> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.userName, userName),
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async findById(userId: number): Promise<User> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
    });
    if (!user) throw new UnauthorizedException('User not found');
    return user;
  }

  async create(data: { userName: string; passwordHash: string }) {
    const existing = await this.findByUsername(data.userName);

    if (existing) {
      throw new ConflictException('Username already taken');
    }

    const [newUser] = await this.db.insert(users).values(data).returning();

    return newUser;
  }

  async getTokensVersion(userId: number): Promise<number> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.id, userId),
      columns: { tokenVersion: true },
    });
    return user?.tokenVersion ?? 0;
  }

  async incrementTokenVersion(userId: number): Promise<void> {
    await this.db
      .update(users)
      .set({
        tokenVersion: sql`${users.tokenVersion} + 1`,
      })
      .where(eq(users.id, userId));
  }
}
