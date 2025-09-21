import { IsNotEmpty, IsString, IsStrongPassword } from 'class-validator';

import { Field, InputType } from '@nestjs/graphql';

@InputType()
export class CreateUserInput {
  @Field(() => String, { description: 'Nombre completo del usuario' })
  @IsString()
  @IsNotEmpty()
  readonly fullName: string;

  @Field(() => String, { description: 'Email del usuario' })
  @IsString()
  @IsNotEmpty()
  readonly email: string;

  @Field(() => String, { description: 'Contraseña del usuario' })
  @IsStrongPassword({ minLength: 6, minNumbers: 1 })
  @IsString()
  @IsNotEmpty()
  readonly password: string;
}
