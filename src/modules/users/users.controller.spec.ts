jest.mock('../auth/decorators/auth.decorator', () => ({
  Auth: () => () => undefined,
}));

import { UsersController } from './users.controller';
import { UsersService } from './users.service';

describe('UsersController', () => {
  const profile = {
    id: 7,
    userName: 'profile_user',
    createdAt: new Date('2026-05-11T08:34:00.000Z'),
  };
  const currentUser = {
    userId: profile.id,
    username: profile.userName,
  };

  const createController = () => {
    const usersService = {
      findProfileById: jest.fn(),
      updateUserName: jest.fn(),
      remove: jest.fn(),
    } as unknown as UsersService;

    return {
      controller: new UsersController(usersService),
      usersService,
    };
  };

  it('loads the authenticated user profile', async () => {
    const { controller, usersService } = createController();
    jest.spyOn(usersService, 'findProfileById').mockResolvedValue(profile);

    await expect(controller.findCurrentUser(currentUser)).resolves.toBe(
      profile,
    );
    expect(usersService.findProfileById).toHaveBeenCalledWith(profile.id);
  });

  it('updates the authenticated user username', async () => {
    const { controller, usersService } = createController();
    const dto = { userName: 'updated_user' };
    jest.spyOn(usersService, 'updateUserName').mockResolvedValue({
      ...profile,
      userName: dto.userName,
    });

    await expect(
      controller.updateCurrentUser(dto, currentUser),
    ).resolves.toMatchObject(dto);
    expect(usersService.updateUserName).toHaveBeenCalledWith(profile.id, dto);
  });

  it('deletes the authenticated user account', async () => {
    const { controller, usersService } = createController();
    jest.spyOn(usersService, 'remove').mockResolvedValue(profile);

    await expect(controller.deleteCurrentUser(currentUser)).resolves.toBe(
      profile,
    );
    expect(usersService.remove).toHaveBeenCalledWith(profile.id);
  });
});
