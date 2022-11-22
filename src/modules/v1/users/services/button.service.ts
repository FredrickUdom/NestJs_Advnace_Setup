import { Injectable, InternalServerErrorException, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Button } from '../entities/buttons.entity';
import { User } from '../entities/users.entity';

@Injectable()
export class ButtonService {
  constructor(
    @InjectRepository(Button) private buttonRepository: Repository<Button>,
  ) {}

  //  get user buttons
  async findAll(userId: number) {
    try {
      let result = await this.buttonRepository
        .createQueryBuilder('b')
        .leftJoinAndSelect('b.user', 'bu')
        .where('bu.id = :userId', { userId: userId })
        .getMany();

      result.map((item) => delete item.user);
      return result;
    } catch (err) {
      if (err) {
        throw new InternalServerErrorException(err.message);
      }
    }
  }

  // create button
  async create(createButtonPayload, user: User) {
    let result = await this.buttonRepository.save({
      value: createButtonPayload.value,
      userId: user.id,
    });

    return {
      status: 'success',
      data: result,
    };
  }

  // delete button
  async deleteButton(id: number, user: User){
    let button = await this.buttonRepository.findOne({
        where: {id: id}
    })

    if(!button){
        throw new NotFoundException('button does not exist')
    }

    if(button.userId != user.id){
        throw new UnauthorizedException();
    }

    try{
        await this.buttonRepository.delete(id);

        return {
            status: "success",
            message: "button deleted successfully"
        }
    } catch(err){
        if(err){
            throw new InternalServerErrorException(err.message)
        }
      }
  }
}
