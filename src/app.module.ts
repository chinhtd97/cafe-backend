import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MongoInit } from './config/mongo/mongo.init';
import { RedisInit } from './config/redis/redis.init';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <- quan trọng
    UsersModule,
    MongoInit,
    RedisInit,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
