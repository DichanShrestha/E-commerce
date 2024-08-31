import dbConnect from "@/lib/dbConnect";
import ordersModel from "@/model/orders.model";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();
  try {
    const order = await ordersModel.aggregate([
      {
        $group: {
          _id: null,
          totalPrice: {
            $sum: "$amount",
          },
          count: {
            $sum: 1,
          },
        },
      },
    ]);

    if (!order) {
      return NextResponse.json(
        { message: "DB Error while getting sales details", success: false },
        { status: 500 }
      );
    }
    return NextResponse.json(
      { message: "Success getting sales history", success: true, data: order },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting sales history: ", error);
    return NextResponse.json(
      { message: "Error getting sales history", success: false },
      { status: 500 }
    );
  }
}
