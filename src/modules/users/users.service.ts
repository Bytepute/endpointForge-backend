import {
  Injectable,
  ConflictException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectDrizzle } from '../../db/db.decorator';
import type { DrizzleDatabase } from '../../db/db.type';
import { eq, sql } from 'drizzle-orm';
import { users } from '../../db/schema';
import { User } from './types/user.type';
import { plainToInstance } from 'class-transformer';
import { UserProfileResponseDto } from './dtos/user-profile-response.dto';
import { UpdateCurrentUserRequestDto } from './dtos/update-current-user-request.dto';

type UserRow = typeof users.$inferSelect;

@Injectable()
export class UsersService {
  constructor(@InjectDrizzle() private readonly db: DrizzleDatabase) {}

  private mapToProfileDto(data: UserRow): UserProfileResponseDto {
    return plainToInstance(UserProfileResponseDto, data, {
      excludeExtraneousValues: true,
    });
  }

  async checkUserNameExist(userName: string): Promise<boolean> {
    const user = await this.db.query.users.findFirst({
      where: eq(users.userName, userName),
      columns: { id: true },
    });
    return !!user;
  }

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
    if (await this.checkUserNameExist(data.userName)) {
      throw new ConflictException('Username already taken');
    }

    const [newUser] = await this.db.insert(users).values(data).returning();

    return newUser;
  }

  async findProfileById(userId: number): Promise<UserProfileResponseDto> {
    const user = await this.findById(userId);
    return this.mapToProfileDto(user);
  }

  async updateUserName(
    userId: number,
    data: UpdateCurrentUserRequestDto,
  ): Promise<UserProfileResponseDto> {
    if (await this.checkUserNameExist(data.userName)) {
      throw new ConflictException('Username already taken');
    }

    const [updatedUser] = await this.db
      .update(users)
      .set({ userName: data.userName })
      .where(eq(users.id, userId))
      .returning();

    if (!updatedUser) {
      throw new UnauthorizedException('User not found');
    }

    return this.mapToProfileDto(updatedUser);
  }

  async remove(userId: number): Promise<void> {
    await this.incrementTokenVersion(userId);

    const [deletedUser] = await this.db
      .delete(users)
      .where(eq(users.id, userId))
      .returning();

    if (!deletedUser) {
      throw new UnauthorizedException('User not found');
    }
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
