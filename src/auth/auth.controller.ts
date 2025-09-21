import { Body, Controller, Post, ValidationPipe } from '@nestjs/common';
import {
  ApiCreatedResponse,
  ApiOkResponse,
  ApiOperation,
  ApiTags,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';

import { AuthService } from './auth.service';
import { SignInDto, SignUpDto } from './dto';
import { AuthResponse } from './interfaces/auth-response.interface';

@Controller('auth')
@ApiTags('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('singup')
  @ApiOperation({ summary: 'Permite el registro de un nuevo usuario' })
  @ApiCreatedResponse({ description: 'Usuario creado correctamente' })
  signUp(@Body(ValidationPipe) signUpDto: SignUpDto): Promise<AuthResponse> {
    return this.authService.signUp(signUpDto);
  }

  @Post('login')
  @ApiOperation({ summary: 'Permite el inicio de sesión de un usuario' })
  @ApiOkResponse({ description: 'Usuario autenticado correctamente' })
  @ApiUnauthorizedResponse({ description: 'Credenciales inválidas' })
  signIn(@Body(ValidationPipe) signInDto: SignInDto) {
    return this.authService.signIn(signInDto);
  }
}
