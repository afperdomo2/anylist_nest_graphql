import { IsNotEmpty, IsUUID } from 'class-validator';

import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

import { CreateListInput } from './create-list.input';

@InputType()
export class UpdateListInput extends PartialType(CreateListInput) {
  @Field(() => ID, { description: 'ID de la lista a actualizar' })
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
