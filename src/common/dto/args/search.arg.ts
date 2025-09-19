import { IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

import { ArgsType, Field } from '@nestjs/graphql';

@ArgsType()
export class SearchArgs {
  @Field(() => String, {
    nullable: true,
    description: 'Término de búsqueda (opcional)',
  })
  @IsOptional()
  @IsString({ message: 'El campo search debe ser una cadena de texto' })
  @MinLength(3, { message: 'El campo search debe tener al menos 3 caracteres' })
  @MaxLength(50, {
    message: 'El campo search no puede tener más de 50 caracteres',
  })
  search?: string;
}
