import { validate } from 'class-validator';
import { UpdateCurrentUserRequestDto } from './update-current-user-request.dto';

describe('UpdateCurrentUserRequestDto', () => {
  const validateUserName = (userName: unknown) => {
    const dto = new UpdateCurrentUserRequestDto();
    dto.userName = userName as string;
    return validate(dto);
  };

  it('accepts usernames that match registration rules', async () => {
    await expect(validateUserName('user_123')).resolves.toHaveLength(0);
  });

  it('rejects invalid usernames', async () => {
    await expect(validateUserName('ab')).resolves.not.toHaveLength(0);
    await expect(validateUserName('profile-user')).resolves.not.toHaveLength(0);
    await expect(
      validateUserName('username_that_is_too_long'),
    ).resolves.not.toHaveLength(0);
  });
});
