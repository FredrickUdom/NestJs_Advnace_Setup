import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/decorators/current-user.decorator';
import { JwtAuthGuard } from '../../auth/guards/jwt.guard';
import { CreateButtonDto } from '../dtos/create-button.dto';
import { User } from '../entities/users.entity';
import { ButtonService } from '../services/button.service';

@Controller('button')
export class ButtonController {
  constructor(private buttonService: ButtonService) {}

  // get user buttons
  @Get()
  @UseGuards(JwtAuthGuard)
  async findAll(@CurrentUser() user: User) {
    return await this.buttonService.findAll(user.id);
  }

  // create button
  @Post()
  @UseGuards(JwtAuthGuard)
  async create(
    @Body() createButtonPayload: CreateButtonDto,
    @CurrentUser() user: User,
  ) {
    return await this.buttonService.create(createButtonPayload, user);
  }

  // delete button
  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  async deleteButton(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: User,
  ) {
    return await this.buttonService.deleteButton(id, user);
  }
}
