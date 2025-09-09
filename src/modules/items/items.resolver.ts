import { ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUserGql, JwtAuthGuardGql } from 'src/auth';
import { User } from '../users/entities/user.entity';
import { CreateItemInput, UpdateItemInput } from './dto';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';

@Resolver(() => Item)
@UseGuards(JwtAuthGuardGql)
export class ItemsResolver {
  constructor(private readonly itemsService: ItemsService) {}

  @Query(() => [Item], {
    name: 'items',
    description: 'Obtiene todos los items (🌐Cualquier usuario)',
  })
  findAll(@CurrentUserGql() user: User): Promise<Item[]> {
    console.info('🔒 Authenticated user:', user);
    return this.itemsService.findAll();
  }

  @Query(() => Item, {
    name: 'item',
    description: 'Obtiene un item por su ID (🌐Cualquier usuario)',
  })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Item> {
    return this.itemsService.findOne(id);
  }

  @Mutation(() => Item, {
    name: 'createItem',
    description: 'Crea un nuevo item (🌐Cualquier usuario)',
  })
  createItem(
    @Args('createItemInput') createItemInput: CreateItemInput,
    @CurrentUserGql() user: User,
  ): Promise<Item> {
    return this.itemsService.create(createItemInput, user);
  }

  @Mutation(() => Item, {
    name: 'updateItem',
    description: 'Actualiza un item existente (🌐Cualquier usuario)',
  })
  updateItem(
    @Args('updateItemInput') updateItemInput: UpdateItemInput,
  ): Promise<Item> {
    return this.itemsService.update(updateItemInput);
  }

  @Mutation(() => Item, {
    name: 'removeItem',
    description: 'Elimina un item existente (🌐Cualquier usuario)',
  })
  removeItem(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
  ): Promise<Item> {
    return this.itemsService.remove(id);
  }
}
