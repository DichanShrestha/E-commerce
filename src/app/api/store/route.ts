import dbConnect from "@/lib/dbConnect";
import StoreModel from "@/model/stores.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { name } = await request.json();
    if (!name) {
      return NextResponse.json(
        { message: "Name is required" },
        { status: 400 }
      );
    }

    const storeModel = new StoreModel({
      name,
    });

    if (!storeModel) {
      return NextResponse.json(
        { message: "Server error creating store" },
        { status: 500 }
      );
    }

    await storeModel.save();

    return NextResponse.json(
      { message: "Store added successfully" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error creating store", success: false },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const stores = await StoreModel.find({});
    if (!stores) {
      return NextResponse.json(
        { message: "Server error while getting store", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: stores, message: "store retrieved" },
      { status: 200 }
    );
  } catch (error) {
    return NextResponse.json(
      { message: "Error getting store", success: false },
      { status: 500 }
    );
  }
}
