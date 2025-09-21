import { ArgsType, IntersectionType } from '@nestjs/graphql';

import { PaginationArgs } from 'src/common/dto/args/pagination.arg';
import { SearchArgs } from 'src/common/dto/args/search.arg';

@ArgsType()
export class FindAllItemsArgs extends IntersectionType(
  PaginationArgs,
  SearchArgs,
) {}
