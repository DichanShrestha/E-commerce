import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/stores.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { name } = await request.json(); // Destructure to get the name from the request body
    const store = await StoreModel.findOne({ name }); // Use findOne to get a single document

    if (!store) {
      return NextResponse.json(
        { message: "Store not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Store id retrieved successfully", data: store._id },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error getting store ID:", error);
    return NextResponse.json(
      { message: "Error getting store ID", error: error.message },
      { status: 500 }
    );
  }
}
