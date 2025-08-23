import { Schema, Document } from 'mongoose';

export interface Admin extends Document {
  name: string;
}

export const AdminSchema = new Schema<Admin>(
  {
    name: { type: String, required: true },
  },
  { timestamps: true },
);
