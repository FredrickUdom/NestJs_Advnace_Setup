import {
  BadRequestException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { LoginI } from 'src/interfaces/login.interface';
import { JwtService } from '@nestjs/jwt';
import { User } from '../../users/entities/users.entity';
import { UserService } from '../../users/services/user.service';
import { CreateUserDto } from '../dtos/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { nanoid } from 'nanoid';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User) private userRepository: Repository<User>,
    private jwtService: JwtService,
    private userService: UserService,
  ) {}

  // hash password
  async hashPassword(password: string) {
    return await bcrypt.hash(password, 10);
  }

  //generate jwt token
  generateToken(user: User) {
    return this.jwtService.sign({
      sub: user.id,
    });
  }

  //  register new user
  async register(createUserPayload: CreateUserDto): Promise<object> {
    const {
      firstname,
      lastname,
      email,
      password,
      phone_number,
      confirmPassword,
    } = createUserPayload;

    try {
      let emailExists = await this.userService.findByEmailQuery(email);

      if (emailExists) {
        throw new BadRequestException('User with this email already exists');
      }

      if (password != confirmPassword) {
        throw new BadRequestException(
          'Password and confirm Password do not match ',
        );
      }

      let result = await this.userRepository.save({
        firstname,
        lastname,
        email,
        phone_number,
        password: await this.hashPassword(createUserPayload.password),
        unique_id: nanoid(5),
      });

      // todo -> generate otp for account verification

      delete result.password;
      return {
        status: 'success',
        data: result,
      };
    } catch (e) {
      throw e;
    }
  }

  // validate credentials for login
  async validateCredentials(email: string, password: string) {
    try {
      let user = await this.userService.findByEmailQuery(email);

      if (!user) throw new NotFoundException('No user found with this email');

      // compare passwords
      if (!(await bcrypt.compare(password, user.password))) {
        throw new BadRequestException('Invalid Credentials');
      }

      // check if user is verified
      if (!user.is_verified) {
        throw new UnauthorizedException('User account not verified');
      }

      delete user.password;
      return user;
    } catch (e) {
      throw e;
    }
  }

  // user login
  async login(email: string, password: string): Promise<LoginI> {
    try {
      let user = await this.validateCredentials(email, password);
      let token = this.generateToken(user);

      return {
        user,
        token,
      };
    } catch (e) {
      throw e;
    }
  }
}
