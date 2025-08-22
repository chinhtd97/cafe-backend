import { Schema, Document, Types } from 'mongoose';

export interface CartItem {
  product_id: Types.ObjectId;
  quantity: number;
}

export interface Cart extends Document {
  user_id: Types.ObjectId;
  items: CartItem[];
  total_price: number;
  created_at?: Date;
  updated_at?: Date;
}

export const CartSchema = new Schema<Cart>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, default: 1 },
      },
    ],
    total_price: { type: Number, default: 0 },
  },
  { timestamps: true },
);
