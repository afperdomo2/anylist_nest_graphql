import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUserGql } from 'src/auth/decorators/graphql/current-user-gql.decorator';
import { JwtAuthGuardGql } from 'src/auth/guards/graphql/jwt-auth-gql.guard';
import { User } from '../users/entities/user.entity';
import { CreateItemListInput, UpdateItemListInput } from './dto';
import { ItemList } from './entities/item-list.entity';
import { ItemListsService } from './item-lists.service';

@Resolver(() => ItemList)
@UseGuards(JwtAuthGuardGql)
export class ItemListsResolver {
  constructor(private readonly itemListsService: ItemListsService) {}

  // ! Queries
  @Query(() => ItemList, { name: 'itemList' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUserGql() user: User,
  ): Promise<ItemList> {
    return this.itemListsService.findOne(id, user);
  }

  // ! Mutations
  @Mutation(() => ItemList, {
    name: 'createItemList',
    description: 'Crea un nuevo itemList',
  })
  createItemList(
    @Args('createItemListInput') createItemListInput: CreateItemListInput,
    @CurrentUserGql() user: User,
  ): Promise<ItemList> {
    return this.itemListsService.create(createItemListInput, user);
  }

  @Mutation(() => ItemList, {
    name: 'updateItemList',
    description: 'Actualiza un itemList',
  })
  updateItemList(
    @Args('updateItemListInput') updateItemListInput: UpdateItemListInput,
    @CurrentUserGql() user: User,
  ): Promise<ItemList> {
    return this.itemListsService.update(updateItemListInput, user);
  }

  @Mutation(() => ItemList, {
    name: 'removeItemList',
    description: 'Elimina un itemList',
  })
  removeItemList(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUserGql() user: User,
  ): Promise<ItemList> {
    return this.itemListsService.remove(id, user);
  }
}
