import { Schema, Document } from 'mongoose';

export interface Product extends Document {
  name: string;
  category: string;
  price: number;
  description?: string;
  image_url?: string;
  stock: number;
  created_at?: Date;
  updated_at?: Date;
}

export const ProductSchema = new Schema<Product>(
  {
    name: { type: String, required: true },
    category: { type: String, required: true },
    price: { type: Number, required: true },
    description: { type: String },
    image_url: { type: String },
    stock: { type: Number, default: 0 },
  },
  { timestamps: true },
);
