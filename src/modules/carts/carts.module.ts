import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { CartSchema } from './schemas/carts.schema';
import { CartsService } from './carts.service';
import { CartsController } from './carts.controller';

@Module({
  imports: [MongooseModule.forFeature([{ name: 'Carts', schema: CartSchema }])],
  controllers: [CartsController],
  providers: [CartsService],
  exports: [CartsService],
})
export class CartsModule {}
