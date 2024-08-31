import Order from "@/model/orders.model";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(req: NextRequest) {
  await dbConnect();

  try {
    const { transaction_code, transaction_uuid } = await req.json();
    const order = await Order.findOne({
      transaction_code,
      transaction_uuid
    })
    console.log(order);
    

    if (order) {
      order.status = "paid";
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
