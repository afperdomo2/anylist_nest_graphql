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
  @Query(() => [User], { name: 'users' })
  findAll() {
    return this.usersService.findAll();
  }

  @Roles(UserRole.User)
  @Query(() => User, { name: 'user' })
  findOne(@Args('id', { type: () => String }) id: string) {
    return this.usersService.findOne(id);
  }

  // Solo administradores pueden crear usuarios
  @Roles(UserRole.Admin)
  @Mutation(() => User)
  createUser(@Args('createUserInput') createUserInput: CreateUserInput) {
    return this.usersService.create(createUserInput);
  }

  @Roles(UserRole.Admin)
  @Mutation(() => User)
  updateUser(@Args('updateUserInput') updateUserInput: UpdateUserInput) {
    return this.usersService.update(updateUserInput.id, updateUserInput);
  }

  @Roles(UserRole.Admin)
  @Mutation(() => User)
  removeUser(@Args('id', { type: () => String }) id: string) {
    return this.usersService.remove(id);
  }

  // Query público
  @Public()
  @Query(() => Number, {
    name: 'totalUsers',
    description: 'Obtiene el total de usuarios registrados (endpoint público)',
  })
  async getTotalUsers(): Promise<number> {
    return this.usersService.getTotalUsers();
  }
}
