import mongoose, { ObjectId, Schema } from "mongoose";

export interface Istore {
  _id: ObjectId
  name: string;
}

const storeSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Store name is required"],
    },
  },
  {
    timestamps: true,
  }
);

const StoreModel =
  (mongoose.models.Store as mongoose.Model<Istore>) ||
  mongoose.model<Istore>("Store", storeSchema);

export default StoreModel;
