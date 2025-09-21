import { IsNotEmpty, IsString } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateListInput {
  @Field(() => String, { description: 'Nombre de la lista' })
  @IsString()
  @IsNotEmpty()
  name: string;
}
