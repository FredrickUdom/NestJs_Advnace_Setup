import { forwardRef, Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ButtonController } from './controllers/button.controller';
import { ConnectionController } from './controllers/connection.controller';
import { MessageController } from './controllers/message.controller';
import { UserController } from './controllers/user.controller';
import { Button } from './entities/buttons.entity';
import { Connection } from './entities/connections.entity';
import { Message } from './entities/messages.entity';
import { User } from './entities/users.entity';
import { ButtonService } from './services/button.service';
import { ConnectionService } from './services/connection.service';
import { MessageService } from './services/message.service';
import { UserService } from './services/user.service';

@Module({
  imports: [TypeOrmModule.forFeature([User, Button, Message, Connection])],
  providers: [UserService, MessageService, ConnectionService, ButtonService],
  controllers: [UserController, MessageController, ConnectionController, ButtonController],
  exports: [UserService],
})
export class UserModule {}
