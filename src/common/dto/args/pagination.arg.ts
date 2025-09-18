import { IsInt, IsOptional, Max, Min } from 'class-validator';

import { ArgsType, Field, Int } from '@nestjs/graphql';

@ArgsType()
export class PaginationArgs {
  @Field(() => Int, {
    defaultValue: 1,
    description: 'Número de página (por defecto: 1)',
  })
  @IsOptional()
  @Min(1, { message: 'El campo page debe ser mayor a 0' })
  @IsInt({ message: 'El campo page debe ser un número entero' })
  page: number = 1;

  @Field(() => Int, {
    defaultValue: 10,
    description: 'Límite de resultados (por defecto: 10, máximo: 100)',
  })
  @IsOptional()
  @Min(1, { message: 'El campo limit debe ser mayor a 0' })
  @Max(100, { message: 'El campo limit no puede ser mayor a 100' })
  @IsInt({ message: 'El campo limit debe ser un número entero' })
  limit: number = 10;
}
