import { ExecutionContext, Injectable } from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { AuthGuard } from '@nestjs/passport';

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
 *
 * Diferencia clave: GraphQL maneja las peticiones de forma diferente a REST,
 * por lo que necesitamos extraer el request del contexto de GraphQL
 * para que Passport pueda acceder a los headers de autorización.
 */
@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  getRequest(context: ExecutionContext) {
    const ctx = GqlExecutionContext.create(context);
    return ctx.getContext<{ req: Request }>().req;
  }
}
