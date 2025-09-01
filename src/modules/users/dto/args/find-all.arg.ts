import { ArgsType, Field } from '@nestjs/graphql';
import { IsArray } from 'class-validator';
import { UserRole } from '../../enums/user-role.enum';

@ArgsType()
export class FindAllArgs {
  @Field(() => [UserRole], { defaultValue: [] })
  @IsArray()
  roles: UserRole[] = [];
}
