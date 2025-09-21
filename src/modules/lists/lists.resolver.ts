import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUserGql } from 'src/auth/decorators/graphql/current-user-gql.decorator';
import { JwtAuthGuardGql } from 'src/auth/guards/graphql/jwt-auth-gql.guard';
import { User } from '../users/entities/user.entity';
import { CreateListInput, FindAllListsArgs, UpdateListInput } from './dto';
import { List } from './entities/list.entity';
import { ListsService } from './lists.service';

@Resolver(() => List)
@UseGuards(JwtAuthGuardGql)
export class ListsResolver {
  constructor(private readonly listsService: ListsService) {}

  // Queries
  @Query(() => [List], {
    name: 'lists',
    description:
      'Obtiene todas las listas del usuario autenticado (🔒Usuario autenticado)',
  })
  findAll(@CurrentUserGql() user: User, @Args() findAllArgs: FindAllListsArgs) {
    return this.listsService.findAll(user, findAllArgs);
  }

  @Query(() => List, {
    name: 'list',
    description: 'Obtiene una lista por su ID (🔒Usuario autenticado)',
  })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUserGql() user: User,
  ) {
    return this.listsService.findOne(id, user);
  }

  // Mutations
  @Mutation(() => List, {
    name: 'createList',
    description: 'Crea una nueva lista (🔒Usuario autenticado)',
  })
  createList(
    @CurrentUserGql() user: User,
    @Args('createListInput') createListInput: CreateListInput,
  ) {
    return this.listsService.create(createListInput, user);
  }

  @Mutation(() => List, {
    name: 'updateList',
    description: 'Actualiza una lista (🔒Usuario autenticado)',
  })
  updateList(
    @Args('updateListInput') updateListInput: UpdateListInput,
    @CurrentUserGql() user: User,
  ) {
    return this.listsService.update(updateListInput, user);
  }

  @Mutation(() => List, {
    name: 'removeList',
    description: 'Elimina una lista (🔒Usuario autenticado)',
  })
  removeList(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUserGql() user: User,
  ) {
    return this.listsService.remove(id, user);
  }
}
