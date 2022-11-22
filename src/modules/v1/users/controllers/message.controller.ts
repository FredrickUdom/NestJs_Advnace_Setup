import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { User } from '../entities/users.entity';
import { MessageService } from '../services/message.service';

@Controller('messages')
export class MessageController {
  constructor(private messageService: MessageService) {}

  // send message
  @Post()
  @UseGuards(JwtAuthGuard)
  async send(
    @Body() createMessagePayload: CreateMessageDto,
    @CurrentUser() user: User,
  ) {
    return await this.messageService.send(createMessagePayload, user);
  }

  // get user messages
  @Get()
  @UseGuards(JwtAuthGuard)
  async getMessages(@CurrentUser() user: User) {
    return await this.messageService.getMessages(user.id);
  }
}
