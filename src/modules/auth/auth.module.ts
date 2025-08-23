import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';
import { UsersModule } from '../users/users.module';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { JwtAccessStrategy } from './strategies/jwt-access.strategy';
import { JwtRefreshStrategy } from './strategies/jwt-refresh.strategy';
import { AuthTokenService } from './auth-token.service';
import { MongooseModule } from '@nestjs/mongoose';
import { UserTokenSchema } from './schemas/user-token.schema';
import { RolesModule } from '../roles/roles.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: 'UserToken', schema: UserTokenSchema }]),
    UsersModule,
    RolesModule,
    // ✅ config JwtModule chuẩn
    JwtModule.register({
      global: true, // để không cần import lại ở các module khác
      secret: process.env.JWT_ACCESS_SECRET || 'default_secret',
    }),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    JwtAccessStrategy,
    JwtRefreshStrategy,
    AuthTokenService,
  ],
  exports: [AuthService, AuthTokenService, MongooseModule],
})
export class AuthModule {}
