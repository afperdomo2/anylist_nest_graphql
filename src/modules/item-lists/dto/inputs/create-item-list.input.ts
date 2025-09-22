import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsUUID,
  Min,
} from 'class-validator';

import { Field, ID, InputType } from '@nestjs/graphql';

import { ItemList } from '../../entities/item-list.entity';

type ICreateItemListInput = Pick<ItemList, 'itemId' | 'listId'>;

@InputType()
export class CreateItemListInput implements ICreateItemListInput {
  @Field(() => ID, { description: 'ID de la lista a la que pertenece el item' })
  @IsUUID()
  @IsNotEmpty()
  listId: string;

  @Field(() => ID, {
    description: 'ID del item que se va a agregar a la lista',
  })
  @IsUUID()
  @IsNotEmpty()
  itemId: string;

  @Field(() => Number, {
    description: 'Cantidad del item',
    nullable: true,
    defaultValue: 0,
  })
  @IsNumber()
  @Min(0)
  @IsOptional()
  quantity?: number = 0;

  @Field(() => Boolean, {
    description: '¿Está completado el item?',
    nullable: true,
    defaultValue: false,
  })
  @IsBoolean()
  @IsOptional()
  isCompleted?: boolean = false;
}
