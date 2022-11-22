import {
  Injectable,
  InternalServerErrorException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from '../dtos/create-message.dto';
import { Message } from '../entities/messages.entity';
import { User } from '../entities/users.entity';
import { UserService } from './user.service';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    private userService: UserService,
  ) {}

  // send message
  async send(payload: CreateMessageDto, user: User) {
    if (!user.is_connected) {
      throw new UnprocessableEntityException(
        'connect to a user to send message',
      );
    }

    try {
      let userFromDb = await this.userService.findByIdWithRelationsQuery(
        user.id,
      );
      let result = await this.messageRepository.save({
        value: payload.value,
        receiver_id: userFromDb.connected_to.id,
        sender_id: user.id,
      });

      return {
        status: 'success',
        data: result,
      };
    } catch (err) {
      if (err) {
        throw err;
      }
    }
  }

  // get user messages
  async getMessages(userId: number) {
    try {
      return await this.messageRepository.find({
        where: { receiver_id: userId },
      });
    } catch (err) {
      if (err) {
        throw new InternalServerErrorException(err.message);
      }
    }
  }
}
