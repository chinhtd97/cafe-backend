import { Module, Logger } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModuleOptions } from '@nestjs/mongoose';

export const mongooseConfig = (
  configService: ConfigService,
): MongooseModuleOptions => {
  const uri =
    configService.get<string>('MONGO_URI') || 'mongodb://localhost:27017/demo';
  Logger.log(`🔗 Connecting to MongoDB: ${uri}`);
  return { uri };
};

@Module({
  imports: [
    MongooseModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) =>
        mongooseConfig(configService),
    }),
  ],
  exports: [MongooseModule],
})
export class MongoInit {}
