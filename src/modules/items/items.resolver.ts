import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CreateItemInput } from './dto';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';
import { ParseUUIDPipe } from '@nestjs/common';

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
  createItem(@Args('data') data: CreateItemInput): Promise<Item> {
    return this.itemsService.create(data);
  }

  // @Mutation(() => Item)
  // updateItem(@Args('updateItemInput') updateItemInput: UpdateItemInput) {
  //   return this.itemsService.update(updateItemInput.id, updateItemInput);
  // }

  @Mutation(() => Item)
  removeItem(@Args('id', { type: () => ID }, ParseUUIDPipe) id: string) {
    return this.itemsService.remove(id);
  }
}
