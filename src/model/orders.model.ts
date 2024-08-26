// src/models/order.model.ts
import mongoose, { Schema, Document } from "mongoose";

export interface IOrder extends Document {
  payment_method: string;
  transaction_code?: string;
  amount: number;
  products: {
    product: string;
    quantity: number;
  }[];
  status: "created" | "paid" | "shipping" | "delivered";
  address?: string;
}

const OrderSchema: Schema<IOrder> = new Schema(
  {
    payment_method: {
      type: String,
      required: true,
      default: "esewa",
    },
    transaction_code: String,
    amount: {
      type: Number,
      required: true,
    },
    products: [
      {
        product: {
          type: String,
          required: true,
          default: "Test",
        },
        quantity: {
          type: Number,
          required: true,
          default: 1,
        },
      },
    ],
    status: {
      type: String,
      required: true,
      enum: ["created", "paid", "shipping", "delivered"],
      default: "created",
    },
    address: String,
  },
  {
    timestamps: true,
  }
);

export default mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);
