import {
  Controller,
  Get,
  Param,
  Post,
  SerializeOptions,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { User } from '../entities/users.entity';
import { UserService } from '../services/user.service';

@Controller('user')
@SerializeOptions({ strategy: 'exposeAll' })
export class UserController {
  constructor(private userService: UserService) {}

  // profile
  @Get('profile')
  @UseGuards(JwtAuthGuard)
  async getProfile(@CurrentUser() user: User) {
    return await this.userService.findByIdWithRelationsQuery(user.id);
  }

  // find user by unique id
  @Get('/filter/:unique_id')
  async findByUniqueId(@Param('unique_id') uniqueId: string) {
    return await this.userService.findByUniqueId(uniqueId);
  }
}
