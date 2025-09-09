import { Global, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { EnvsConfigService } from './envs.service';

@Global()
@Module({
  imports: [ConfigModule],
  providers: [EnvsConfigService],
  exports: [EnvsConfigService],
})
export class EnvsConfigModule {}
