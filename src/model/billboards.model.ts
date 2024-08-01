import mongoose, {ObjectId, Schema} from "mongoose";

export interface Ibillboards {
    storeId: ObjectId;
    imageURL: string;
    label: string;
    publicId: string;
}

const BillboardSchema: Schema<Ibillboards> = new Schema(
    {
        storeId: {
            type: Schema.Types.ObjectId,
            ref: "Store",
            required: true
        },
        imageURL: {
            type: String,
            required: [true, "Image URL is required"],
        },
        label: {
            type: String,
            required: [true, "Label is required"],
            unique: true
        },
        publicId: {
            type: String,
            required: true,
            description: 'The public ID of the image in Cloudinary',
        },
    },
    {
        timestamps: true
    }
)

const BillboardModel = mongoose.models.Billboard as mongoose.Model<Ibillboards> || mongoose.model<Ibillboards>("Billboard", BillboardSchema)

export default BillboardModel;