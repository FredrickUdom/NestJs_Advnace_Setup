import { User } from 'src/modules/v1/users/entities/users.entity';

export interface LoginI {
  user: User;
  token: string;
}
