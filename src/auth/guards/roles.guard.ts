import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';
import { UserRole } from 'src/modules/users/enums/user-role.enum';
import { ROLES_KEY } from '../decorators/roles.decorator';
import { IS_PUBLIC_KEY } from '../decorators/public.decorator';

/**
 * Guard que controla el acceso basado en roles de usuario.
 *
 * Este guard verifica si el usuario autenticado tiene los roles necesarios
 * para acceder a un endpoint específico. Funciona en conjunto con el
 * decorador @Roles() para definir qué roles tienen acceso.
 *
 * Funcionalidades:
 * - Extrae los roles requeridos de los metadatos del endpoint
 * - Obtiene el usuario autenticado del contexto de la petición
 * - Verifica si el usuario tiene al menos uno de los roles requeridos
 * - Compatible con el contexto de GraphQL
 *
 * Uso:
 * ```typescript
 * @Roles(UserRole.Admin)
 * @UseGuards(JwtAuthGuard, RolesGuard)
 * @Mutation(() => User)
 * createUser() { ... }
 * ```
 *
 * IMPORTANTE: Este guard debe usarse después del JwtAuthGuard para
 * asegurar que el usuario esté autenticado antes de verificar roles.
 */
@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    // 1. Verificar si el endpoint está marcado como público
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    // 2. Si está marcado como público, permitir el acceso sin autenticación
    if (isPublic) {
      return true;
    }

    // 3. Obtener los roles requeridos de los metadatos
    const requiredRoles = this.reflector.getAllAndOverride<UserRole[]>(
      ROLES_KEY,
      [context.getHandler(), context.getClass()],
    );

    // 4. Si no hay roles requeridos, permitir acceso
    if (!requiredRoles) {
      return true;
    }

    // 5. Extraer el usuario del contexto de GraphQL
    const ctx = GqlExecutionContext.create(context);
    const request = ctx.getContext<{ req: Request & { user: User } }>().req;
    const user = request.user;

    // 6. Si no hay usuario (no debería pasar si JwtAuthGuard está antes), denegar acceso
    if (!user) {
      throw new InternalServerErrorException(
        'User not found in request. Make sure that JwtAuthGuard is applied.',
      );
    }

    // 7. Verificar si el usuario tiene al menos uno de los roles requeridos
    const hasRole = requiredRoles.some((role) => user.roles?.includes(role));
    if (!hasRole) {
      throw new ForbiddenException(
        'You do not have permission to access this resource.',
      );
    }
    return true;
  }
}
