import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';

import { Field, ID, ObjectType } from '@nestjs/graphql';

import { ItemList } from 'src/modules/item-lists/entities/item-list.entity';
import { User } from 'src/modules/users/entities/user.entity';

@ObjectType()
@Entity({ name: 'lists' })
export class List {
  @Field(() => ID, { description: 'ID de la lista' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'Nombre de la lista' })
  @Column('varchar')
  name: string;

  @Field(() => String, {
    nullable: true,
    description: 'Descripción de la lista',
  })
  @Index('idx_list_user_id')
  @Column('uuid', { name: 'user_id' })
  userId: string;

  // Relaciones
  @Field(() => User, { description: 'Usuario que creó la lista' })
  @ManyToOne(() => User, (user) => user.lists)
  @JoinColumn({ name: 'user_id' })
  user: User;

  // @Field(() => [ItemList], { description: 'Items de la lista' })
  @OneToMany(() => ItemList, (itemList) => itemList.list)
  items: ItemList[];
}
