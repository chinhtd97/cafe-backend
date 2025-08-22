import { Schema, Document, Types } from 'mongoose';

export interface OTP extends Document {
  user_id: Types.ObjectId;
  code: string;
  expires_at: Date;
  type: string; // login, reset_password
  created_at?: Date;
}

export const OTPSchema = new Schema<OTP>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    code: { type: String, required: true },
    expires_at: { type: Date, required: true },
    type: { type: String, required: true },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
