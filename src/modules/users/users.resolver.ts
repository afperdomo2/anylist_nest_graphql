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

import { CurrentUserGql } from 'src/auth/decorators/graphql/current-user-gql.decorator';
import { Public } from 'src/auth/decorators/public.decorator';
import { Roles } from 'src/auth/decorators/roles.decorator';
import { JwtAuthGuardGql } from 'src/auth/guards/graphql/jwt-auth-gql.guard';
import { RolesGuardGql } from 'src/auth/guards/graphql/roles.guard-gql.guard';
import { FindAllItemsArgs } from '../items/dto';
import { Item } from '../items/entities/item.entity';
import { ItemsService } from '../items/items.service';
import { CreateUserInput, FindAllUsersArgs, UpdateUserInput } from './dto';
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
  findAll(@Args() findAllArgs: FindAllUsersArgs) {
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
  getUserItemCount(@Parent() user: User): Promise<number> {
    // return user.items?.length ?? 0; // Esta es otra forma si ya tenemos la relación cargada
    return this.itemsService.itemCountByUser(user);
  }

  @Roles(UserRole.Admin)
  @ResolveField(() => [Item], {
    name: 'items',
    description: 'Items creados por el usuario (🔒Solo administradores)',
  })
  getItemsByUser(
    @Parent() user: User,
    @Args() findAllArgs: FindAllItemsArgs,
  ): Promise<Item[]> {
    return this.itemsService.findAll(user, findAllArgs);
  }
}
