import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class EnvsConfigService {
  constructor(private readonly configService: ConfigService) {}

  get environment(): string {
    return this.configService.get<string>('environment', 'development');
  }

  get port(): number {
    return this.configService.get<number>('port', 3000);
  }

  get jwtSecret(): string {
    return this.configService.get<string>('jwtSecret')!;
  }

  get databaseConfig() {
    return {
      host: this.configService.get<string>('database.host', 'localhost'),
      port: this.configService.get<number>('database.port', 5432),
      user: this.configService.get<string>('database.user', 'postgres'),
      password: this.configService.get<string>('database.password'),
      name: this.configService.get<string>('database.name'),
    };
  }

  get isDevelopment(): boolean {
    return this.environment === 'development';
  }

  get isProduction(): boolean {
    return this.environment === 'production';
  }
}
