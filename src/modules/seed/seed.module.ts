// src/modules/seed/seed.module.ts
import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

// Schemas
import { Role, RoleSchema } from '../roles/schemas/roles.schema';
import { User, UserSchema } from '../users/schemas/users.schema';
import { UserToken, UserTokenSchema } from '../auth/schemas/user-token.schema';
import { Product, ProductSchema } from '../products/schemas/products.schema';
import { Cart, CartSchema } from '../carts/schemas/carts.schema';
import { Order, OrderSchema } from '../orders/schemas/orders.schema';
import { OTP, OTPSchema } from '../otps/schemas/otps.schema';
import {
  AdminUser,
  AdminUserSchema,
} from '../admin/schemas/admin_users.schema';
import { Upload, UploadSchema } from '../uploads/schemas/uploads.schema';

@Module({
  imports: [
    MongooseModule.forRoot(
      process.env.MONGO_URI || 'mongodb://localhost:27017/cafe-shop',
    ), // ✅ Thêm kết nối DB
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
    MongooseModule.forFeature([{ name: User.name, schema: UserSchema }]),
    MongooseModule.forFeature([
      { name: UserToken.name, schema: UserTokenSchema },
    ]),
    MongooseModule.forFeature([{ name: Product.name, schema: ProductSchema }]),
    MongooseModule.forFeature([{ name: Cart.name, schema: CartSchema }]),
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    MongooseModule.forFeature([{ name: OTP.name, schema: OTPSchema }]),
    MongooseModule.forFeature([
      { name: AdminUser.name, schema: AdminUserSchema },
    ]),
    MongooseModule.forFeature([{ name: Upload.name, schema: UploadSchema }]),
  ],
})
export class SeedModule {}
