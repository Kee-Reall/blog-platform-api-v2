import { CookieOptions } from 'express';
import { exceptionFactory } from './exceptionFactory.function';
import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { MailerOptions } from '@nestjs-modules/mailer';

type EnvironmentsTypes = 'DEVELOPMENT' | 'STAGING' | 'PRODUCTION';

class EnvironmentSettings {
  constructor(private readonly mode: EnvironmentsTypes) {}

  getMode(): EnvironmentsTypes {
    return this.mode;
  }

  isProduction(): boolean {
    return this.getMode() === 'PRODUCTION';
  }

  isStaging(): boolean {
    return this.getMode() === 'STAGING';
  }

  isDevelopment(): boolean {
    return this.getMode() === 'DEVELOPMENT';
  }
}

class AppConfig {
  private environment: any;
  constructor(public mode: EnvironmentSettings) {
    this.environment = process.env;
  }

  get mailOptions(): MailerOptions {
    return {
      transport: `smtps://${this.environment.MAIL_NAME}:${this.environment.MAIL_PASSWORD}@smtp.${this.environment.MAIL_DOMAIN}`,
      defaults: {
        from: `"Blog-platform-api-v2" <${this.environment.MAIL_NAME}>`,
      },
    };
  }

  get corsOptions() {
    return {
      credentials: true,
      origin: this.environment.FRONTEND_DOMAIN ?? 'http//localhost:3000/',
    };
  }

  get port(): number {
    return this.environment.PORT ?? 3000;
  }

  get throttlerOptions() {
    return {
      limit: +this.environment.IP_RESTRICTION_LIMIT || 5,
      ttl: +this.environment.IP_RESTRICTION_TTL || 10,
    };
  }

  get jwtLifeTimePair(): [number, number] {
    return [
      this.environment.JWT_ACCESS_LIFETIME,
      this.environment.JWT_REFRESH_LIFETIME,
    ];
  }

  get jwtSecret(): string {
    return this.environment.JWT_SECRET;
  }

  get cookiesOptions(): CookieOptions {
    return {
      //domain: this.mode.isDevelopment() ? undefined : this.environment.DOMAIN,
      sameSite: 'none',
      secure: !this.mode.isDevelopment(),
      httpOnly: true,
    };
  }

  get basicAuthPair(): [string, string] {
    return [this.environment.LOGIN, this.environment.PASSWORD];
  }

  get env(): EnvironmentsTypes {
    return this.mode.getMode();
  }

  get dbOptions(): TypeOrmModuleOptions {
    return {
      type: 'postgres',
      host: this.environment.DB_HOST,
      port: this.environment.DB_PORT,
      username: this.environment.DB_LOGIN,
      password: this.environment.DB_PASSWORD,
      database: this.environment.DB_NAME,
      synchronize: false,
      autoLoadEntities: false,
    };
  }
  get globalValidatorOptions() {
    return { transform: true, exceptionFactory: exceptionFactory };
  }

  get globalContainerOptions() {
    return { fallbackOnErrors: true };
  }

  get cookieSecret(): string {
    return this.environment.COOKIES_SECRET;
  }
}

export const appConfig = new AppConfig(
  new EnvironmentSettings(<EnvironmentsTypes>process.env.MODE ?? 'DEVELOPMENT'),
);
