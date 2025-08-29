import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from 'src/modules/users/users.service';
import { PayloadToken } from '../interfaces/payload-token.interface';

/**
 * Estrategia JWT para autenticación con Passport.
 *
 * Esta clase implementa la estrategia de autenticación JWT utilizando Passport.js.
 * Su responsabilidad principal es validar los tokens JWT entrantes en las peticiones
 * y verificar que el usuario asociado al token sea válido y esté activo.
 *
 * Funcionalidades:
 * - Extrae el token JWT del header Authorization (Bearer token)
 * - Valida la firma del token usando el secreto JWT configurado
 * - Verifica que el usuario del payload existe en la base de datos
 * - Confirma que el usuario esté activo antes de permitir el acceso
 *
 * Esta estrategia se ejecuta automáticamente cuando se aplica el JwtAuthGuard
 * en controladores o resolvers que requieren autenticación.
 */
@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private readonly usersService: UsersService,
    configService: ConfigService,
  ) {
    const jwtSecret = configService.get<string>('jwtSecret')!;
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: jwtSecret,
    });
  }

  async validate(payload: PayloadToken) {
    const { sub } = payload;
    const user = await this.usersService.findOne(sub);
    if (!user) {
      throw new UnauthorizedException('Token not valid');
    }
    if (!user.isActive) {
      throw new UnauthorizedException('User is inactive, talk with an admin');
    }
    return user;
  }
}
