import crypto from "crypto";
import Order from "@/model/orders.model";
import dbConnect from "@/lib/dbConnect";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  await dbConnect();

  try {
    const {payment_method, amount, products, address} = await req.json();
    const newOrder = new Order({
      payment_method,
      amount,
      address,
      products,
      status: "paid",
    })
    
    await newOrder.save();
    
    const signature = createSignature(
      `total_amount=${newOrder.amount},transaction_uuid=${newOrder._id},product_code=EPAYTEST`
    );

    const formData = {
      amount: newOrder.amount,
      failure_url: `http://localhost:3000/checkout`,
      product_delivery_charge: "0",
      product_service_charge: "0",
      product_code: "EPAYTEST",
      signature: signature,
      signed_field_names: "total_amount,transaction_uuid,product_code",
      success_url: `http://localhost:3000/checkout`,
      tax_amount: "0",
      total_amount: newOrder.amount,
      transaction_uuid: newOrder._id,
    };

    return NextResponse.json({
      message: "Order Created Successfully",
      order: newOrder,
      formData,
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to initiate payment" });
  }
}

const createSignature = (message: any) => {
  const secret = process.env.NEXT_ESEWA_MERCHANT_CODE! || "8gBm/:&EnhH.1/q";
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  return hmac.digest("base64");
};
