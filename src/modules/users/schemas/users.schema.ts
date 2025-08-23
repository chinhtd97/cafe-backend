import { Schema, Document, Types, HydratedDocument } from 'mongoose';

export class User extends Document {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role_id: Types.ObjectId;
  created_at?: Date;
  updated_at?: Date;
}
export type UserDocument = HydratedDocument<User>;
export const UserSchema = new Schema<User>(
  {
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    phone: { type: String },
    role_id: { type: Schema.Types.ObjectId, ref: 'Role', required: true },
  },
  { timestamps: true },
);
