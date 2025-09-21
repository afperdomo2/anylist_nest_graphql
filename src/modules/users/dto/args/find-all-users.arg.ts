import { IsArray } from 'class-validator';

import { ArgsType, Field, IntersectionType } from '@nestjs/graphql';

import { PaginationArgs, SearchArgs } from 'src/common/dto';
import { UserRole } from '../../enums/user-role.enum';

@ArgsType()
export class FindAllUsersArgs extends IntersectionType(
  PaginationArgs,
  SearchArgs,
) {
  @Field(() => [UserRole], { defaultValue: [] })
  @IsArray()
  roles: UserRole[] = [];
}
