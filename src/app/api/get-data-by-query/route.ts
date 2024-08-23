import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/products.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);

    // Extract specific query parameters
    const storeId = searchParams.get("storeId");
    const categoryName = searchParams.get("categoryName");
    const color = searchParams.get("color") || "";
    const size = searchParams.get("size") || "";
    const limit = Number(searchParams.get("limit")) || 10;
    const page = Number(searchParams.get("page")) || 1;
    console.log(size);

    if (!storeId) {
      return NextResponse.json(
        { message: "Store not found", success: false },
        { status: 400 }
      );
    }

    if (!categoryName) {
      return NextResponse.json(
        { message: "Category not found", success: false },
        { status: 400 }
      );
    }

    const matchStage: any = {
      storeId: new mongoose.Types.ObjectId(storeId),
      category: categoryName,
      archived: false,
    };

    // Conditionally add the filter if it exists

    if (size) {
      matchStage.size = size;
    }

    if (color) {
      matchStage.color = color;
    }

    const products = await ProductModel.aggregate([
      { $match: matchStage },
      { $limit: limit },
    ]);

    if (products.length === 0) {
      return NextResponse.json(
        { data: [], message: "No product found"},
        { status: 500 }
      );
    }

    return NextResponse.json({ data: products });
  } catch (error) {
    console.error("Error getting products: ", error);
    return NextResponse.json(
      { message: "Error getting products", success: false },
      { status: 500 }
    );
  }
}
