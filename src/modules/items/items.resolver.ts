import { ParseUUIDPipe } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';

@Resolver(() => Item)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Query(() => [Item], { name: 'items' })
  findAll(): Promise<Item[]> {
    return this.itemsService.findAll();
  }

  @Query(() => Item, { name: 'item' })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Item)
  createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
  ): Promise<Item> {
    return this.itemsService.create(createItemInput);
  }

  @Mutation(() => Item)
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
  ): Promise<Item> {
    return this.itemsService.update(updateItemInput);
  }

  @Mutation(() => Item)
  removeItem(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Item> {
    return this.itemsService.remove(id);
  }
}
