import { Body, Controller, Delete, Get, Patch } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import type { CurrentUserData } from '../auth/interfaces/current-user.interface';
import { Auth } from '../auth/decorators/auth.decorator';
import { UpdateCurrentUserRequestDto } from './dtos/update-current-user-request.dto';
import { UserProfileResponseDto } from './dtos/user-profile-response.dto';
import { UsersService } from './users.service';

@Auth()
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  findCurrentUser(
    @CurrentUser() user: CurrentUserData,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.findProfileById(user.userId);
  }

  @Patch('me')
  updateCurrentUser(
    @Body() dto: UpdateCurrentUserRequestDto,
    @CurrentUser() user: CurrentUserData,
  ): Promise<UserProfileResponseDto> {
    return this.usersService.updateUserName(user.userId, dto);
  }

  @Delete('me')
  deleteCurrentUser(@CurrentUser() user: CurrentUserData): Promise<void> {
    return this.usersService.remove(user.userId);
  }
}
