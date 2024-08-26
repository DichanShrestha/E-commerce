import { NextApiRequest } from "next";
import crypto from "crypto";
import Order from "@/model/orders.model";
import dbConnect from "@/lib/dbConnect";
import { NextResponse } from "next/server";

export async function POST(req: NextApiRequest) {
  await dbConnect();

    try {
      const orderData = req.body;
      const newOrder = await Order.create(orderData);

      const signature = createSignature(
        `total_amount=${newOrder.amount},transaction_uuid=${newOrder._id},product_code=EPAYTEST`
      );

      const formData = {
        amount: newOrder.amount,
        failure_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/esewa/failure`,
        product_delivery_charge: "0",
        product_service_charge: "0",
        product_code: "EPAYTEST",
        signature: signature,
        signed_field_names: "total_amount,transaction_uuid,product_code",
        success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/api/esewa/success`,
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
  const secret = process.env.NEXT_ESEWA_MERCHANT_CODE!;
  const hmac = crypto.createHmac("sha256", secret);
  hmac.update(message);
  return hmac.digest("base64");
};
