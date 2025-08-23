// src/modules/auth/schemas/user-token.schema.ts
import { Schema, Document, Types } from 'mongoose';

export class UserToken extends Document {
  userId: Types.ObjectId;
  refreshTokenHash: string; // hash refresh token
  device?: string; // optional: device info
  expiresAt: Date; // expiration for refresh token
  createdAt?: Date;
}

export const UserTokenSchema = new Schema<UserToken>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    refreshTokenHash: { type: String, required: true },
  },
  { timestamps: true },
);
