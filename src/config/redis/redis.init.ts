import { Module, Global, Logger } from '@nestjs/common';
import Redis from 'ioredis';
import { RedisService } from './redis.service';
import { ConfigService } from '@nestjs/config';

const redisProvider = {
  provide: 'REDIS_CLIENT',
  useFactory: (configService: ConfigService) => {
    const uri = configService.get<string>('REDIS_URI');
    if (!uri) throw new Error('REDIS_URI is not defined in .env');

    const client = new Redis(uri);

    client.on('connect', () => {
      Logger.log('✅ Redis connected successfully');
    });
    client.on('error', (err) => {
      Logger.error('Redis connection error', err);
    });

    return client;
  },
  inject: [ConfigService],
};

@Global()
@Module({
  providers: [redisProvider, RedisService],
  exports: ['REDIS_CLIENT', RedisService],
})
export class RedisInit {}
