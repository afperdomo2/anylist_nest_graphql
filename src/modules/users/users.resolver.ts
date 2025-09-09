import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import {
  Args,
  ID,
  Int,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';

import {
  CurrentUserGql,
  JwtAuthGuardGql,
  Public,
  Roles,
  RolesGuardGql,
} from 'src/auth';
import { ItemsService } from '../items/items.service';
import { CreateUserInput, FindAllArgs, UpdateUserInput } from './dto';
import { User } from './entities/user.entity';
import { UserRole } from './enums/user-role.enum';
import { UsersService } from './users.service';

@Resolver(() => User)
@UseGuards(JwtAuthGuardGql, RolesGuardGql)
export class UsersResolver {
  constructor(
    private readonly usersService: UsersService,
    private readonly itemsService: ItemsService,
  ) {}

  // ! Queries
  @Roles(UserRole.Admin)
  @Query(() => [User], {
    name: 'users',
    description: 'Obtiene todos los usuarios (🔒Solo administradores)',
  })
  findAll(@Args() findAllArgs: FindAllArgs) {
    return this.usersService.findAll(findAllArgs);
  }

  @Roles(UserRole.Admin)
  @Query(() => User, {
    name: 'user',
    description: 'Obtiene un usuario por su ID (🔒Solo administradores)',
  })
  findOne(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  // SECTION - Query público
  // Los públicos omiten el jwtAuthGuard y el RolesGuard
  @Public()
  @Query(() => Number, {
    name: 'totalUsers',
    description: 'Obtiene el total de usuarios registrados (🌐Público)',
  })
  async getTotalUsers(): Promise<number> {
    return this.usersService.getTotalUsers();
  }

  // ! Mutations
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
  updateUser(
    @Args('updateUserInput') updateUserInput: UpdateUserInput,
    @CurrentUserGql() user: User,
  ) {
    return this.usersService.update(updateUserInput.id, updateUserInput, user);
  }

  @Roles(UserRole.Admin)
  @Mutation(() => User, {
    name: 'removeUser',
    description: 'Elimina un usuario existente (🔒Solo administradores)',
  })
  removeUser(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }

  @Roles(UserRole.Admin)
  @Mutation(() => User, {
    name: 'blockUser',
    description: 'Bloquea un usuario existente (🔒Solo administradores)',
  })
  blockUser(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUserGql() user: User,
  ) {
    return this.usersService.block(id, user);
  }

  // ! ResolveFields
  @Roles(UserRole.Admin)
  @ResolveField(() => Int, {
    name: 'itemCount',
    description:
      'Número de items creados por el usuario (🔒Solo administradores)',
  })
  getUserItemCount(@Parent() user: User) {
    // return user.items?.length ?? 0; // NOTE: Esta es otra forma si ya tenemos la relación cargada
    return this.itemsService.itemCountByUser(user);
  }
}
