import { Schema, Document, Types } from 'mongoose';

export interface AdminUser extends Document {
  name: string;
  email: string;
  password: string;
  role_id: Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
}

export const AdminUserSchema = new Schema<AdminUser>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  },
  { timestamps: true },
);
