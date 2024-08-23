import dbConnect from "@/lib/dbConnect";
import ColorModel from "@/model/colors.model";
import { Types } from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const { searchParams } = new URL(request.url);
    const storeId = searchParams.get('storeId');
    const categoryName = searchParams.get('categoryName');

    if (!storeId || !categoryName) {
      return NextResponse.json(
        { message: "storeId and categoryName are required", success: false },
        { status: 400 }
      );
    }

    const colors = await ColorModel.aggregate([
        {
            $match: {
                storeId: new Types.ObjectId(storeId), 
                category: categoryName
            }
        }
    ])

    return NextResponse.json({ data: colors, success: true }, { status: 200 });

  } catch (error) {
    console.error("Error getting colors through category: ", error);
    return NextResponse.json(
      { message: "Error getting colors through category", success: false },
      { status: 500 }
    );
  }
}
