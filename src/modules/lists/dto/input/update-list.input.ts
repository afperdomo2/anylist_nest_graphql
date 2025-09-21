import { Field, ID, InputType, PartialType } from '@nestjs/graphql';
import { IsNotEmpty, IsUUID } from 'class-validator';
import { CreateListInput } from './create-list.input';

@InputType()
export class UpdateListInput extends PartialType(CreateListInput) {
  @Field(() => ID)
  @IsUUID()
  @IsNotEmpty()
  id: string;
}
