import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/modules/users/users.service';
import { SingInDto, SingUpDto } from './dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { PayloadToken } from './interfaces/payload-token.interface';

interface IAuthService {
  singUp(singUpDto: SingUpDto): Promise<AuthResponse>;
  singIn(singInDto: SingInDto): Promise<AuthResponse>;
}

@Injectable()
export class AuthService implements IAuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async singUp(singUpDto: SingUpDto) {
    const user = await this.usersService.create(singUpDto);
    const payload: PayloadToken = { sub: user.id, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user };
  }

  async singIn(singInDto: SingInDto) {
    const { email, password } = singInDto;
    const user = await this.usersService.findOneByEmailWithPassword(email);

    const isPasswordValid = user.password
      ? await bcrypt.compare(password, user.password)
      : false;

    if (!user || !isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const payload: PayloadToken = { sub: user.id, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user };
  }
}
