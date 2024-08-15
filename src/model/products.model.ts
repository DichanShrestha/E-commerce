import mongoose, { ObjectId, Schema } from "mongoose";

export interface Iproduct {
  storeId: ObjectId;
  name: string;
  price: number;
  category: string;
  size: string;
  color: string;
  imageURL: string;
  featured: boolean;
  archived: boolean;
}

const ProductSchema: Schema<Iproduct> = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    name: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    color: {
      type: String,
      required: true,
    },
    size: {
      type: String,
      required: true,
    },
    imageURL: {
      type: String,
      required: true,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    archived: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

const ProductModel =
  (mongoose.models.Product as mongoose.Model<Iproduct>) ||
  mongoose.model<Iproduct>("Product", ProductSchema);

export default ProductModel;
