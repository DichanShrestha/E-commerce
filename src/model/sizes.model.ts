import mongoose, { ObjectId, Schema } from "mongoose";

export interface Isizes {
  storeId: ObjectId;
  categoryId: ObjectId;
  name: string;
  value: string;
  category: string;
}

const SizeSchema: Schema<Isizes> = new Schema(
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

const SizeModel =
  (mongoose.models.Size as mongoose.Model<Isizes>) ||
  mongoose.model<Isizes>("Size", SizeSchema);

export default SizeModel;
