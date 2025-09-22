import { UseGuards } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUserGql } from 'src/auth/decorators/graphql/current-user-gql.decorator';
import { JwtAuthGuardGql } from 'src/auth/guards/graphql/jwt-auth-gql.guard';
import { User } from '../users/entities/user.entity';
import { CreateItemListInput, UpdateItemListInput } from './dto/indext';
import { ItemList } from './entities/item-list.entity';
import { ItemListsService } from './item-lists.service';

@Resolver(() => ItemList)
@UseGuards(JwtAuthGuardGql)
export class ItemListsResolver {
  constructor(private readonly itemListsService: ItemListsService) {}

  // Queries
  @Query(() => [ItemList], { name: 'itemLists' })
  findAll() {
    return this.itemListsService.findAll();
  }

  @Query(() => ItemList, { name: 'itemList' })
  findOne(@Args('id', { type: () => Int }) id: number) {
    return this.itemListsService.findOne(id);
  }

  // Mutations
  @Mutation(() => ItemList, {
    name: 'createItemList',
    description: 'Crea un nuevo itemList',
  })
  createItemList(
    @Args('createItemListInput') createItemListInput: CreateItemListInput,
    @CurrentUserGql() user: User,
  ) {
    return this.itemListsService.create(createItemListInput, user);
  }

  @Mutation(() => ItemList)
  updateItemList(
    @Args('updateItemListInput') updateItemListInput: UpdateItemListInput,
  ) {
    return this.itemListsService.update(
      updateItemListInput.id,
      updateItemListInput,
    );
  }

  @Mutation(() => ItemList)
  removeItemList(@Args('id', { type: () => Int }) id: number) {
    return this.itemListsService.remove(id);
  }
}
