import Order from "@/model/orders.model";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const { transaction_uuid, transaction_code } = await req.json();
    const order = await Order.findById(transaction_uuid);

    if (order) {
      order.status = "paid";
      order.transaction_code = transaction_code;
      await order.save();
      return NextResponse.redirect(new URL("/order-success", req.url));
    } else {
      return NextResponse.json({ message: "Order not found" }, { status: 404 });
    }
  } catch (error) {
    return NextResponse.json({ error: "Failed to process payment" }, { status: 500 });
  }
}
