import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { Repository } from 'typeorm';
import { Connection } from '../entities/connections.entity';
import { User } from '../entities/users.entity';
import { UserService } from './user.service';

@Injectable()
export class ConnectionService {
  constructor(
    @InjectRepository(Connection)
    private connectionRepository: Repository<Connection>,
    private userService: UserService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  // send connection request
  async connectionRequest(receiverId, user: User) {
    if (user.is_connected) {
      throw new BadRequestException(
        'you are connected to a user already, disconnect to connect to a new user',
      );
    }

    const receiver = await this.userRepository.findOne({
      where: { unique_id: receiverId },
    });

    if (!receiver) {
      throw new NotFoundException('no user found with this id');
    }

    if (receiverId == user.unique_id) {
      throw new BadRequestException(
        'you cannot send connection request to yourself',
      );
    }

    try {
      let connection = await this.connectionRepository.save({
        token: nanoid(30),
        sender_id: user.id,
        receiver_uniqueId: receiverId,
      });

      return {
        status: 'success',
        data: connection,
      };
    } catch (err) {
      if (err) {
        throw err;
      }
    }
  }

  // accept connection request
  async acceptConnection(token: string, user: User) {
    if (user.is_connected) {
      throw new BadRequestException('you are already connected to a user');
    }

    try {
      let tokenExist = await this.connectionRepository.findOne({
        where: { token: token },
      });

      if (!tokenExist) {
        throw new BadRequestException('invalid connection token');
      }

      if (tokenExist.sender_id == user.id) {
        throw new UnauthorizedException();
      }

      let sender = await this.userRepository.findOne({
        where: { id: tokenExist.sender_id },
      });

      // update user
      await this.userRepository.update(user.id, {
        is_connected: true,
        connected_to: sender,
      });

      //   update sender
      await this.userRepository.update(tokenExist.sender_id, {
        is_connected: true,
        connected_to: user,
      });

      return {
        status: 'success',
        message: 'connection successful',
      };
    } catch (err) {
      if (err) {
        throw err;
      }
    }
  }
}
