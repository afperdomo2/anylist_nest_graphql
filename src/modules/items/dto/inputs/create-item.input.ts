import { Field, Float, InputType } from '@nestjs/graphql';
import {
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
} from 'class-validator';
import { Item } from '../../entities/item.entity';

type ICreateItemInput = Pick<
  Item,
  'name' | 'description' | 'quantity' | 'unitOfMeasurement'
>;

@InputType()
export class CreateItemInput implements ICreateItemInput {
  @Field(() => String, { description: 'Nombre del item' })
  @IsString()
  @IsNotEmpty()
  name: string;

  @Field(() => String, { nullable: true, description: 'Descripción del item' })
  @IsString()
  @IsOptional()
  description?: string;

  @Field(() => Float, { description: 'Cantidad del item' })
  @IsNumber({ maxDecimalPlaces: 2 })
  @IsPositive()
  @IsNotEmpty()
  quantity: number;

  @Field(() => String, { description: 'Unidad de medida del item' })
  @IsString()
  @IsNotEmpty()
  unitOfMeasurement: string;
}
