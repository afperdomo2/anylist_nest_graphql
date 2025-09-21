import { Logger, ParseUUIDPipe, UseGuards } from '@nestjs/common';
import { Args, ID, Mutation, Query, Resolver } from '@nestjs/graphql';

import { CurrentUserGql } from 'src/auth/decorators/graphql/current-user-gql.decorator';
import { JwtAuthGuardGql } from 'src/auth/guards/graphql/jwt-auth-gql.guard';
import { User } from '../users/entities/user.entity';
import { CreateItemInput, FindAllArgs, UpdateItemInput } from './dto';
import { Item } from './entities/item.entity';
import { ItemsService } from './items.service';

@Resolver(() => Item)
@UseGuards(JwtAuthGuardGql)
export class ItemsResolver {
  private readonly loggger = new Logger('ItemsResolver');

  constructor(private readonly itemsService: ItemsService) {}

  @Query(() => [Item], {
    name: 'items',
    description:
      'Obtiene todos los items del usuario autenticado (🔒Usuario autenticado)',
  })
  findAll(@CurrentUserGql() user: User, @Args() findAllArgs: FindAllArgs) {
    this.loggger.log(`🔒 Authenticated user: ${user.id}`);
    return this.itemsService.findAll(user, findAllArgs);
  }

  @Query(() => Item, {
    name: 'item',
    description: 'Obtiene un item por su ID (🌐Cualquier usuario)',
  })
  findOne(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUserGql() user: User,
  ): Promise<Item> {
    return this.itemsService.findOne(id, user);
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
    @CurrentUserGql() user: User,
  ): Promise<Item> {
    return this.itemsService.update(updateItemInput, user);
  }

  @Mutation(() => Item, {
    name: 'removeItem',
    description: 'Elimina un item existente (🌐Cualquier usuario)',
  })
  removeItem(
    @Args('id', { type: () => ID }, ParseUUIDPipe) id: string,
    @CurrentUserGql() user: User,
  ): Promise<Item> {
    return this.itemsService.remove(id, user);
  }
}
