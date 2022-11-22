import { Controller, Param, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { User } from '../entities/users.entity';
import { ConnectionService } from '../services/connection.service';

@Controller('connection')
export class ConnectionController {
  constructor(private connectionService: ConnectionService) {}

  // send connection request
  @Post('send/:userId')
  @UseGuards(JwtAuthGuard)
  async connectionRequest(
    @Param('userId') receiverId: string,
    @CurrentUser() user: User,
  ) {
    return await this.connectionService.connectionRequest(receiverId, user);
  }

  // accept connection request
  @Post('accept/:token')
  @UseGuards(JwtAuthGuard)
  async acceptConnection(@Param('token') token: string, @CurrentUser() user: User) {
    return await this.connectionService.acceptConnection(token, user);
  }
}
