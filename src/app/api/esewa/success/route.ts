import Order from "@/model/orders.model";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { transaction_uuid } = await req.json();
    const order = await Order.findOne({
      transaction_uuid,
    });

    if (order) {
      order.status = "paid";
      order.transaction_uuid = transaction_uuid;
      await order.save();

      return NextResponse.json(
        { message: "success updating status" },
        { status: 200 }
      );
    } else {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to process payment" },
      { status: 500 }
    );
  }
}
