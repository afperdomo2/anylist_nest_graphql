import * as bcrypt from 'bcrypt';

import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';

import { UsersService } from 'src/modules/users/users.service';
import { SignInDto, SignUpDto } from './dto';
import { AuthResponse } from './interfaces/auth-response.interface';
import { PayloadToken } from './interfaces/payload-token.interface';

@Injectable()
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponse> {
    const user = await this.usersService.create(signUpDto);
    const payload: PayloadToken = { sub: user.id, roles: user.roles };
    const accessToken = await this.jwtService.signAsync(payload);
    return { accessToken, user };
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponse> {
    const { email, password } = signInDto;
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
