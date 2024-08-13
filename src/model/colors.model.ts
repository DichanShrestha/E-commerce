import mongoose, { ObjectId, Schema } from "mongoose";

export interface Icolors {
  storeId: ObjectId;
  categoryId: ObjectId;
  name: string;
  value: string;
  category: string;
}

const ColorSchema: Schema<Icolors> = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
    value: {
      type: String,
      required: true,
      unique: true,
    },
    category: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const ColorModel =
  (mongoose.models.Color as mongoose.Model<Icolors>) ||
  mongoose.model<Icolors>("Color", ColorSchema);

export default ColorModel;
