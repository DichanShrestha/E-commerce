import mongoose, { ObjectId, Schema } from "mongoose";

export interface Icategories {
  storeId: ObjectId;
  billboardId: ObjectId;
  billboardLabel: string;
  name: string;
}

const CategorySchema: Schema<Icategories> = new Schema(
  {
    storeId: {
      type: Schema.Types.ObjectId,
      ref: "Store",
      required: true,
    },
    billboardId: {
      type: Schema.Types.ObjectId,
      ref: "Billboard",
      required: true,
    },
    billboardLabel: {
      type: String,
      required: true,
    },
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  {
    timestamps: true,
  }
);

const CategoryModel =
  (mongoose.models.Category as mongoose.Model<Icategories>) ||
  mongoose.model<Icategories>("Category", CategorySchema);

export default CategoryModel;
