import { Module } from '@nestjs/common';
import * as Joi from 'joi';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { OpenAIModule } from './integrations/openai/openai.module';
import { RealtimeModule } from './domain/realtime/realtime.module';
import { NotificationModule } from './domain/notification/notification.module';
//import * as fs from 'fs';

@Module({
  imports: [
    ScheduleModule.forRoot(),
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath:
        process.env.NODE_ENV === 'production'
          ? 'config/env/.env.prod'
          : 'config/env/.env.dev',
      validationSchema: Joi.object({
        NODE_ENV: Joi.string()
          .valid('development', 'production', 'test')
          .default('development'),
        DB_HOST: Joi.string().required(),
        DB_PORT: Joi.number().required(),
        DB_USERNAME: Joi.string().required(),
        DB_PASSWORD: Joi.string().required(),
        DB_DATABASE: Joi.string().required(),
        OPEN_AI_API_KEY: Joi.string().required(),
        OPEN_AI_PROJECT_ID: Joi.string().required(),
        APN_KEY_PATH: Joi.string().required(),
        APN_KEY_ID: Joi.string().required(),
        APN_TEAM_ID: Joi.string().required(),
        APN_BUNDLE_ID: Joi.string().required(),
      }),
    }),
    TypeOrmModule.forRootAsync({
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get('DB_HOST'),
        port: +configService.get('DB_PORT'),
        username: configService.get('DB_USERNAME'),
        password: configService.get('DB_PASSWORD'),
        database: configService.get('DB_DATABASE'),
        synchronize: false, //configService.get('NODE_ENV') !== 'production',
        logging: configService.get('NODE_ENV') !== 'production',
        autoLoadEntities: true,
        namingStrategy: new SnakeNamingStrategy(),
        // ssl: {
        //   ca: fs.readFileSync('config/ssl/global-bundle.pem'),
        // },
        // extra: {
        //   ssl: { rejectUnauthorized: false },
        // },
        timezone: 'Z',
      }),
      inject: [ConfigService],
    }),
    OpenAIModule,
    RealtimeModule,
    NotificationModule,
  ],
  controllers: [],
})
export class AppModule {}
