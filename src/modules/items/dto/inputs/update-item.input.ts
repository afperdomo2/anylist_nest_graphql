import { IsNotEmpty, IsUUID } from 'class-validator';

import { Field, ID, InputType, PartialType } from '@nestjs/graphql';

import { CreateItemInput } from './create-item.input';

@InputType()
export class UpdateItemInput extends PartialType(CreateItemInput) {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
