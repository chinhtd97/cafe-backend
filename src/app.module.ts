import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { MongoInit } from './config/mongo/mongo.init';
import { RedisInit } from './config/redis/redis.init';
import { ConfigModule } from '@nestjs/config';
import { RolesModule } from './modules/roles/roles.module';
import { OtpsModule } from './modules/otps/otps.module';
import { ProductsModule } from './modules/products/products.module';
import { UploadsModule } from './modules/uploads/uploads.module';
import { OrdersModule } from './modules/orders/orders.module';
import { CartsModule } from './modules/carts/carts.module';
import { AuthModule } from './modules/auth/auth.module';
import { SeedModule } from './modules/seed/seed.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <- quan trọng
    UsersModule,
    MongoInit,
    RedisInit,
    RolesModule,
    OtpsModule,
    ProductsModule,
    UploadsModule,
    OrdersModule,
    CartsModule,
    AuthModule,
    SeedModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
