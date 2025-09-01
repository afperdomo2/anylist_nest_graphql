import { UseGuards } from '@nestjs/common';
import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { JwtAuthGuardGql, Public, Roles, RolesGuardGql } from 'src/auth';
import { CreateUserInput } from './dto/create-user.input';
import { UpdateUserInput } from './dto/update-user.input';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';
import { UsersService } from './users.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuardGql, RolesGuardGql)
export class UsersResolver {
  constructor(private readonly usersService: UsersService) {}

  @Roles(UserRole.User)
  @Query(() => [User], {
    name: 'users',
    description: 'Obtiene todos los usuarios (🔒Solo usuarios)',
  })
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(UserRole.User)
  @Query(() => User, {
    name: 'user',
    description: 'Obtiene un usuario por su ID (🔒Solo usuarios)',
  })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }

  // Solo administradores pueden crear usuarios
  @Roles(UserRole.Admin)
  @Mutation(() => User, {
    name: 'createUser',
    description: 'Crea un nuevo usuario (🔒Solo administradores)',
  })
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Roles(UserRole.Admin)
  @Mutation(() => User, {
    name: 'updateUser',
    description: 'Actualiza un usuario existente (🔒Solo administradores)',
  })
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Roles(UserRole.Admin)
  @Mutation(() => User, {
    name: 'removeUser',
    description: 'Elimina un usuario existente (🔒Solo administradores)',
  })
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.remove(id);
  }

  // Query público
  @Public()
  @Query(() => Number, {
    name: 'totalUsers',
    description: 'Obtiene el total de usuarios registrados (🌐Público)',
  })
  async getTotalUsers(): Promise<number> {
    return this.usersService.getTotalUsers();
  }
}
