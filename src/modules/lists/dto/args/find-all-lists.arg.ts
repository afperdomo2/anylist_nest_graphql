import { ArgsType, IntersectionType } from '@nestjs/graphql';

import { PaginationArgs, SearchArgs } from 'src/common/dto';

@ArgsType()
export class FindAllListsArg extends IntersectionType(
  PaginationArgs,
  SearchArgs,
) {}
