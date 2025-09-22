import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  Unique,
} from 'typeorm';

import { Field, ID, ObjectType } from '@nestjs/graphql';

import { Item } from 'src/modules/items/entities/item.entity';
import { List } from 'src/modules/lists/entities/list.entity';

@ObjectType()
@Entity({ name: 'lists_has_items' })
@Unique(['listId', 'itemId'])
export class ItemList {
  @Field(() => ID, { description: 'ID del item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => ID, { description: 'ID de la lista' })
  @Column('uuid', { name: 'list_id' })
  listId: string;

  @Field(() => ID, { description: 'ID del item' })
  @Column('uuid', { name: 'item_id' })
  itemId: string;

  @Field(() => Number, { description: 'Cantidad del item' })
  @Column('decimal', { precision: 10, scale: 2, default: 0 })
  quantity: number;

  @Field(() => Boolean, { description: 'Indica si el item está completado' })
  @Column('boolean', { default: false, name: 'is_completed' })
  isCompleted: boolean;

  // Relaciones
  @Field(() => List, {
    nullable: true,
    description: 'Lista a la que pertenece el item',
  })
  @ManyToOne(() => List, (list) => list.items)
  @JoinColumn({ name: 'list_id' })
  list: List;

  @Field(() => Item, {
    nullable: true,
    description: 'Item que pertenece a la lista',
  })
  @ManyToOne(() => Item, (item) => item.itemLists)
  @JoinColumn({ name: 'item_id' })
  item: Item;
}
