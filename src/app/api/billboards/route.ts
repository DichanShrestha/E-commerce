import dbConnect from "@/lib/dbConnect";
import BillboardModel from "@/model/billboards.model";
import StoreModel from "@/model/stores.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { imageURL, label, publicId, store } = await request.json();
    
    if (!imageURL || !label || !publicId || !store) {
      return NextResponse.json(
        { message: "All credentials are required" },
        { status: 400 }
      );
    }

    const storeDetail = await StoreModel.findOne({ name: store }).exec();
    if (!storeDetail) {
      return NextResponse.json(
        { message: "Store not found" },
        { status: 404 }
      );
    }

    const billboard = new BillboardModel({
      imageURL,
      label,
      publicId,
      storeId: storeDetail._id,
    });

    await billboard.save();

    return NextResponse.json(
      { message: "Billboard added successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating billboard: ", error);
    return NextResponse.json(
      { message: "Error creating billboard", success: false },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  
}