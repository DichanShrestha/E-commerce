import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/products.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);

    // Extract specific query parameters
    const storeId = searchParams.get('storeId');
    const limit = Number(searchParams.get('limit')) || 10;
    const page = Number(searchParams.get('page')) || 1;

    if (!storeId) {
      return NextResponse.json(
        { message: "Store not found", success: false },
        { status: 400 }
      );
    }

    const matchStage: any = {
      storeId: new mongoose.Types.ObjectId(storeId),
      archived: false,
      featured: true,
    };

    const products = await ProductModel.aggregate([
      { $match: matchStage },
      { $skip: (page - 1) * limit },
      { $limit: limit }
    ]);

    return NextResponse.json({ data: products });
  } catch (error) {
    console.error("Error getting products for store: ", error);
    return NextResponse.json(
      { message: "Error getting products for store", success: false },
      { status: 500 }
    );
  }
}
