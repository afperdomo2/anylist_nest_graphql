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
import { JwtAuthGuardGql } from 'src/auth/guards/graphql/jwt-auth-gql.guard';
import { ItemList } from '../item-lists/entities/item-list.entity';
import { ItemListsService } from '../item-lists/item-lists.service';
import { User } from '../users/entities/user.entity';
import { CreateListInput, FindAllListsArgs, UpdateListInput } from './dto';
import { List } from './entities/list.entity';
import { ListsService } from './lists.service';
import { PaginationArgs } from 'src/common/dto';

@Resolver(() => List)
@UseGuards(JwtAuthGuardGql)
export class ListsResolver {
  constructor(
    private readonly listsService: ListsService,
    private readonly itemListsService: ItemListsService,
  ) {}

  // ! Queries
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

  // ! Mutations
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

  // ! ResolveFields
  @ResolveField(() => Int, {
    name: 'itemCount',
    description:
      'Número de items creados por el usuario (🔒Solo administradores)',
  })
  getListItemCount(@Parent() list: List): Promise<number> {
    return this.itemListsService.getListItemCount(list);
  }

  @ResolveField(() => [ItemList], {
    name: 'items',
    description: 'Items asociados a la lista (🔒Usuario autenticado)',
  })
  getListItems(
    @Parent() list: List,
    @Args() paginationArgs: PaginationArgs,
  ): Promise<ItemList[]> {
    return this.itemListsService.findAllByList(list, paginationArgs);
  }
}
