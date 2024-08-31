import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/products.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const chartDetails = await ProductModel.aggregate([
        {
          $group: {
            _id: {
              month: { $month: "$createdAt" },
              year: { $year: "$createdAt" },
            },
            count: { $sum: 1 }
          }
        },
        {
          $sort: { "_id.year": 1, "_id.month": 1 }
        }
      ])

      return NextResponse.json({data: chartDetails, message: "chart details attrived successfully"})
      
  } catch (error) {
    console.error("Error getting chart details: ", error);
    return NextResponse.json(
      { message: "Error getting chart details", success: false },
      { status: 500 }
    );
  }
}
