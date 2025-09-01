import { registerEnumType } from '@nestjs/graphql';

export enum UserRole {
  User = 'user',
  Admin = 'admin',
  SuperAdmin = 'superadmin',
}

registerEnumType(UserRole, {
  name: 'UserRole',
  description: 'Roles de usuario',
});
