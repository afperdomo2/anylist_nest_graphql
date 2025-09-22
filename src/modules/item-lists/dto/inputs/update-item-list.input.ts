import { IsNotEmpty, IsUUID } from 'class-validator';

import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

import { CreateItemListInput } from './create-item-list.input';

@InputType()
export class UpdateItemListInput extends PartialType(CreateItemListInput) {
  @Field(() => ID, { description: 'ID del item-list a actualizar' })
  @IsUUID()
  @IsNotEmpty()
  id: number;
}
