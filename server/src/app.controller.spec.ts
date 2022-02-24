import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { ConfigModule } from '@nestjs/config';
import { WinstonModule } from 'nest-winston';
import DailyRotateFile from 'winston-daily-rotate-file';
import { format } from 'winston';
import config from './config/configuration';
import { AuthModule } from './auth/auth.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { User } from './users/users.entity';
import { UsersModule } from './users/users.module';
import { MailModule } from './mail/mail.module';
import { TokenModule } from './token/token.module';

const { combine, timestamp, errors, json } = format;

describe('AppController', () => {
  let appController: AppController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          load: [config],
        }),
        TypeOrmModule.forRootAsync({
          useFactory: () => ({
            type: 'mysql',
            host: process.env.DATABASE_HOST,
            port: parseInt(process.env.DATABASE_PORT, 10),
            username: process.env.DATABASE_USERNAME,
            password: process.env.DATABASE_PASSWORD,
            database: process.env.DATABASE_DATABASE,
            entities: [User],
            synchronize: true,
          }),
        }),
        WinstonModule.forRootAsync({
          useFactory: () => ({
            transports: [
              new DailyRotateFile({
                dirname: process.env.LOG_DIRNAME,
                filename: process.env.LOG_FILENAME,
                datePattern: process.env.LOG_DATA_PATTERN,
                zippedArchive: true,
                maxSize: process.env.LOG_MAX_SIZE,
                maxFiles: process.env.LOG_MAX_FILES,
                format: combine(errors({ stack: true }), timestamp(), json()),
              }),
            ],
          }),
        }),
        AuthModule,
        UsersModule,
        MailModule,
        TokenModule,
      ],
      controllers: [AppController],
      providers: [AppService],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appController.getHello()).toBe('Hello World!');
    });
  });
});
