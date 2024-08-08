import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/categories.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const {name, billboardLabel, billboardId} = await request.json();
    const url = new URL(request.url);
    const id = url.toString().split("/");
    const storeId = id[id.length - 1];
    
    if (!name || !billboardId || !billboardLabel || !storeId) {
      return NextResponse.json(
        { message: "All credentials required", success: false },
        { status: 400 }
      );
    }

    const category = new CategoryModel({
      storeId,
      billboardId,
      billboardLabel,
      name
    })
    
    if (!category) {
      return NextResponse.json(
        { message: "DB error creating category", success: false },
        { status: 500 }
      );
    }

    await category.save();

    return NextResponse.json(
      { message: "Category created successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating category: ", error);
    return NextResponse.json(
      { message: "Error creating category", success: false },
      { status: 500 }
    );
  }
}
