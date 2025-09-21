import { ArgsType, IntersectionType } from '@nestjs/graphql';

import { PaginationArgs, SearchArgs } from 'src/common/dto';

@ArgsType()
export class FindAllListsArgs extends IntersectionType(
  PaginationArgs,
  SearchArgs,
) {}
