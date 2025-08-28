import { User } from 'src/modules/users/entities/user.entity';

export interface AuthResponse {
  accessToken: string;
  user: User;
}
