import { ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Guard de autenticación JWT para GraphQL.
 *
 * Esta clase extiende el AuthGuard de Passport para funcionar específicamente
 * con el contexto de GraphQL en NestJS. Su responsabilidad es proteger
 * resolvers y endpoints GraphQL requiriendo autenticación válida.
 *
 * Funcionalidades:
 * - Adapta el AuthGuard('jwt') para trabajar con el contexto de GraphQL
 * - Extrae la petición HTTP del contexto de ejecución de GraphQL
 * - Permite que la estrategia JWT acceda al request para validar el token
 * - Se aplica como decorador (@UseGuards(JwtAuthGuard)) en resolvers
 * - Respeta el decorador @Public() para omitir la autenticación
 *
 * Diferencia clave: GraphQL maneja las peticiones de forma diferente a REST,
 * por lo que necesitamos extraer el request del contexto de GraphQL
 * para que Passport pueda acceder a los headers de autorización.
 *
 * Comportamiento con @Public():
 * - Si un resolver tiene @Public(), el guard permite el acceso sin autenticación
 * - Si no tiene @Public(), requiere un token JWT válido
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  constructor(private reflector: Reflector) {
    super();
  }

  canActivate(context: ExecutionContext) {
    // Verificar si el endpoint está marcado como público
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // Si está marcado como público, permitir el acceso sin autenticación
    if (isPublic) {
      return true;
    }

    // Si no es público, ejecutar la validación JWT normal
    return super.canActivate(context);
  }

  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<{ req: Request }>().req;
  }
}
