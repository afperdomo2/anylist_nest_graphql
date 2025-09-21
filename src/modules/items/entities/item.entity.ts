import { Field, ID, ObjectType } from '@nestjs/graphql';
import { User } from 'src/modules/users/entities/user.entity';
import {
  Column,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';

@ObjectType()
@Entity({ name: 'items' })
export class Item {
  @Field(() => ID, { description: 'ID del item' })
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Field(() => String, { description: 'Nombre del item' })
  @Column('varchar')
  name: string;

  @Field(() => String, { nullable: true, description: 'Descripción del item' })
  @Column('text', { nullable: true })
  description?: string;

  // @Field(() => Float, { description: 'Cantidad del item' })
  // @Column('decimal', { precision: 10, scale: 2 })
  // quantity: number;

  @Field(() => String, { description: 'Unidad de medida del item' })
  @Column('varchar', { name: 'unit_of_measurement' })
  unitOfMeasurement: string;

  @Field(() => ID, { description: 'ID del usuario que creó el item' })
  @Index('idx_item_user_id')
  @Column('uuid', { name: 'user_id' })
  userId: string;

  // Relaciones
  @Field(() => User, { description: 'Usuario que creó el item' })
  @ManyToOne(() => User, (user) => user.items)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
