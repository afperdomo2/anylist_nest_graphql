import {
  IsArray,
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsUUID,
} from 'class-validator';

import { Field, ID, InputType, OmitType, PartialType } from '@nestjs/graphql';

import { UserRole } from '../../enums/user-role.enum';
import { CreateUserInput } from './create-user.input';

@InputType()
export class UpdateUserInput extends PartialType(
  OmitType(CreateUserInput, ['password']),
) {
  @Field(() => ID, { description: 'ID del usuario a actualizar' })
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @Field(() => Boolean, {
    nullable: true,
    description: 'Estado de actividad del usuario',
  })
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @Field(() => [UserRole], { nullable: true, description: 'Rol del usuario' })
  @IsArray()
  @IsOptional()
  roles?: UserRole[];
}
