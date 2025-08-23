import { Schema, Document, Types } from 'mongoose';

export class Upload extends Document {
  file_name: string;
  url: string;
  type: string;
  size: number;
  uploaded_by: Types.ObjectId;
  created_at?: Date;
}

export const UploadSchema = new Schema<Upload>(
  {
    file_name: { type: String, required: true },
    url: { type: String, required: true },
    type: { type: String },
    size: { type: Number },
    uploaded_by: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  { timestamps: { createdAt: true, updatedAt: false } },
);
