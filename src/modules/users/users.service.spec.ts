import { ConflictException } from '@nestjs/common';
import type { DrizzleDatabase } from 'src/db/db.type';
import { UsersService } from './users.service';

describe('UsersService profile APIs', () => {
  const user = {
    id: 7,
    userName: 'profile_user',
    passwordHash: 'secret-hash',
    createdAt: new Date('2026-05-11T08:34:00.000Z'),
    tokenVersion: 2,
  };

  const createDb = () => {
    const returning = jest.fn();
    const where = jest.fn(() => ({ returning }));
    const set = jest.fn(() => ({ where }));
    const update = jest.fn(() => ({ set }));
    const deleteUser = jest.fn(() => ({ where }));
    const findFirst = jest.fn();

    return {
      db: {
        query: {
          users: { findFirst },
        },
        update,
        delete: deleteUser,
      } as unknown as DrizzleDatabase,
      findFirst,
      returning,
    };
  };

  it('returns only profile fields for the current user', async () => {
    const { db, findFirst } = createDb();
    findFirst.mockResolvedValue(user);
    const service = new UsersService(db);

    const profile = await service.findProfileById(user.id);

    expect(profile).toEqual({
      id: user.id,
      userName: user.userName,
      createdAt: user.createdAt,
    });
    expect(profile).not.toHaveProperty('passwordHash');
    expect(profile).not.toHaveProperty('tokenVersion');
  });

  it('updates the current user username and returns a safe profile', async () => {
    const { db, findFirst, returning } = createDb();
    const updatedUser = { ...user, userName: 'updated_user' };
    findFirst.mockResolvedValue(undefined);
    returning.mockResolvedValue([updatedUser]);
    const service = new UsersService(db);

    const profile = await service.updateUserName(user.id, {
      userName: updatedUser.userName,
    });

    expect(profile).toEqual({
      id: updatedUser.id,
      userName: updatedUser.userName,
      createdAt: updatedUser.createdAt,
    });
    expect(profile).not.toHaveProperty('passwordHash');
    expect(profile).not.toHaveProperty('tokenVersion');
  });

  it('rejects usernames owned by another user', async () => {
    const { db, findFirst } = createDb();
    findFirst.mockResolvedValue({ id: user.id + 1 });
    const service = new UsersService(db);

    await expect(
      service.updateUserName(user.id, { userName: 'already_taken' }),
    ).rejects.toThrow(new ConflictException('Username already taken'));
  });

  it('deletes the current user and returns a safe profile', async () => {
    const { db, returning } = createDb();
    returning.mockResolvedValue([user]);
    const service = new UsersService(db);

    const profile = await service.remove(user.id);

    expect(profile).toEqual({
      id: user.id,
      userName: user.userName,
      createdAt: user.createdAt,
    });
    expect(profile).not.toHaveProperty('passwordHash');
    expect(profile).not.toHaveProperty('tokenVersion');
  });
});
