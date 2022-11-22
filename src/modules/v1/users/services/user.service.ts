import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { nanoid } from 'nanoid';
import { Like, Repository } from 'typeorm';
import { Connection } from '../entities/connections.entity';
import { User } from '../entities/users.entity';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {}

  // find user by id query
  async findByIdQuery(id: number): Promise<User> {
    return await this.userRepository.findOne({
      where: { id: id },
    });
  }

  // find user by unique id query
  async findByUniqueIdQuery(id: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { unique_id: id },
    });
  }

  // find user by id with relations query
  async findByIdWithRelationsQuery(id: number) {
    return await this.userRepository.findOne({
      where: { id: id },
      relations: ['connected_to', 'notifications', 'buttons'],
    });
  }

  // find user by email query
  async findByEmailQuery(email: string): Promise<User> {
    return await this.userRepository.findOne({
      where: { email: email },
    });
  }

  //   find user by unique id
  async findByUniqueId(uniqueId: string) {
    return await this.userRepository.find({
      where: { unique_id: Like(`%${uniqueId}%`) },
    });
  }
}
