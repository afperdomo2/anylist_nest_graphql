import {
  createParamDecorator,
  ExecutionContext,
  InternalServerErrorException,
} from '@nestjs/common';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';

/**
 * Decorador de parámetro para obtener el usuario autenticado actual.
 *
 * Este decorador personalizado permite extraer automáticamente la información
 * del usuario autenticado desde el contexto de la petición en resolvers de GraphQL.
 * Su responsabilidad es simplificar el acceso a los datos del usuario logueado.
 *
 * Funcionalidades:
 * - Extrae el usuario del request después de la autenticación JWT
 * - Funciona específicamente con el contexto de GraphQL
 * - Proporciona type safety retornando una entidad User tipada
 * - Se usa como parámetro en métodos de resolvers: @CurrentUser() user: User
 *
 * Flujo de funcionamiento:
 * 1. El JwtAuthGuard valida el token y adjunta el usuario al request
 * 2. Este decorador extrae ese usuario del contexto de GraphQL
 * 3. Lo inyecta como parámetro en el método del resolver
 *
 * Beneficios:
 * - Código más limpio y reutilizable
 * - Evita repetir lógica de extracción de usuario
 * - Mejora la legibilidad de los resolvers
 */
export const CurrentUserGql = createParamDecorator(
  (data: unknown, context: ExecutionContext): User => {
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext<{ req: Request & { user: User } }>().req;
    const user = request.user;
    if (!user) {
      throw new InternalServerErrorException(
        'User not found in request. Make sure that JwtAuthGuard is applied.',
      );
    }
    return user;
  },
);
