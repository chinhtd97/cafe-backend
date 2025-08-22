import { Schema, Document, Types } from 'mongoose';

export interface OrderItem {
  product_id: Types.ObjectId;
  quantity: number;
  price: number;
}

export interface Order extends Document {
  user_id: Types.ObjectId;
  items: OrderItem[];
  total_price: number;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address?: string;
  created_at?: Date;
  updated_at?: Date;
}

export const OrderSchema = new Schema<Order>(
  {
    user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    items: [
      {
        product_id: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: true,
        },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
      },
    ],
    total_price: { type: Number, required: true },
    status: { type: String, default: 'pending' },
    payment_status: { type: String, default: 'unpaid' },
    payment_method: { type: String },
    shipping_address: { type: String },
  },
  { timestamps: true },
);
