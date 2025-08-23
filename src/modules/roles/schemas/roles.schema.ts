import { Schema, Document } from 'mongoose';

export class Role extends Document {
  name: string;
  permissions: string[]; // array of permissions
  created_at?: Date;
  updated_at?: Date;
}

export const RoleSchema = new Schema<Role>(
  {
    name: { type: String, required: true },
    permissions: { type: [String], default: [] },
  },
  { timestamps: true },
);
