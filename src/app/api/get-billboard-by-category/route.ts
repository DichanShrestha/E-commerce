import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/categories.model";
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

    // Correct query syntax: Combine conditions into a single object
    const billboard = await CategoryModel.aggregate([
        {
          '$match': {
            'storeId': new Types.ObjectId(storeId), 
            'name': categoryName
          }
        }, {
          '$lookup': {
            'from': 'billboards', 
            'localField': 'billboardId', 
            'foreignField': '_id', 
            'as': 'billboard'
          }
        }, {
          '$unwind': '$billboard'
        }, {
          '$project': {
            'storeId': 0, 
            'billboardId': 0, 
            'billboardLabel': 0
          }
        }
      ]);

    // Check if the result array is empty
    if (billboard.length === 0) {
      return NextResponse.json(
        { message: "No billboard found for the specified category", success: false },
        { status: 404 }
      );
    }

    return NextResponse.json({ data: billboard[0], success: true }, { status: 200 });
  } catch (error) {
    console.error("Error getting billboard through category: ", error);
    return NextResponse.json(
      { message: "Error getting billboard through category", success: false },
      { status: 500 }
    );
  }
}
