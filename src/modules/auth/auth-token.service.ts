// src/modules/auth/auth-token.service.ts
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { Model, Document } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import * as bcrypt from 'bcryptjs';

import { UserToken } from './schemas/user-token.schema';

export interface UserTokenDocument extends UserToken, Document {}

@Injectable()
export class AuthTokenService {
  constructor(
    @InjectModel('UserToken')
    private tokenModel: Model<UserTokenDocument>,
  ) {}

  /**
   * Lưu refresh token mới (hash)
   */
  async saveTokens(
    userId: string,
    refreshToken: string,
  ): Promise<UserTokenDocument> {
    const refreshTokenHash: string = await bcrypt.hash(refreshToken, 10);

    return this.tokenModel.create({
      userId,
      refreshTokenHash,
    });
  }

  /**
   * Kiểm tra refresh token hợp lệ
   */
  async validateRefreshToken(
    userId: string,
    token: string,
  ): Promise<UserTokenDocument> {
    const tokenDoc = await this.tokenModel.findOne({ userId }).exec();
    if (!tokenDoc) throw new UnauthorizedException('No token found');

    const match: boolean = await bcrypt.compare(
      token,
      tokenDoc.refreshTokenHash,
    );
    if (!match) throw new UnauthorizedException('Invalid refresh token');

    return tokenDoc;
  }

  /**
   * Revoke token (logout)
   */
  async revokeToken(userId: string): Promise<void> {
    await this.tokenModel.deleteOne({ userId }).exec();
  }
}
