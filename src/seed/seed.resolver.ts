import { Mutation, Resolver } from '@nestjs/graphql';

import { SeedService } from './seed.service';

@Resolver()
// @UseGuards(JwtAuthGuardGql, RolesGuardGql)
export class SeedResolver {
  constructor(private readonly seedService: SeedService) {}

  @Mutation(() => Boolean, {
    name: 'executeSeed',
    description: 'Ejecuta la semilla de datos',
  })
  executeSeed() {
    return this.seedService.executeSeed();
  }
}
