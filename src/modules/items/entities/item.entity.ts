import { Field, Float, ID, ObjectType } from '@nestjs/graphql';
import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

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

  @Field(() => Float, { description: 'Cantidad del item' })
  @Column('decimal', { precision: 10, scale: 2 })
  quantity: number;

  @Field(() => String, { description: 'Unidad de medida del item' })
  @Column('varchar', { name: 'unit_of_measurement' })
  unitOfMeasurement: string;
}
