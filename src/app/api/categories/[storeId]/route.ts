import dbConnect from "@/lib/dbConnect";
import BillboardModel from "@/model/billboards.model";
import CategoryModel from "@/model/categories.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { name, billboardLabel, billboardId } = await request.json();
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
      name,
    });

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

export async function GET(request: NextRequest) {
  await dbConnect();
  try {
    const url = new URL(request.url);
    const id = url.toString().split("/");
    const storeId = id[id.length - 1];

    const categories = await CategoryModel.find({ storeId });

    if (!categories) {
      return NextResponse.json(
        { message: "DB error while retrieving categories" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: categories, message: "Categories retrieved" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting categories: ", error);
    return NextResponse.json(
      { message: "Error getting categories" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  await dbConnect();

  try {
    const { updatedName, updatedBillboardLabel, id } = await request.json();
    console.log(updatedBillboardLabel, updatedName);
    
    if (!id) {
      return NextResponse.json(
        { message: "Category ID is required", success: false },
        { status: 400 }
      );
    }

    if (!updatedName) {
      return NextResponse.json(
        {
          message: "Name is required",
          success: false,
        },
        { status: 400 }
      );
    }

    const existingCategory = await CategoryModel.findById(id);
    if (!existingCategory) {
      return NextResponse.json(
        { message: "Category not found", success: false },
        { status: 404 }
      );
    }

    const existingBillboard = updatedBillboardLabel
      ? await BillboardModel.findOne({ label: updatedBillboardLabel })
      : null;

    const isUpdateNeeded =
      (updatedName && existingCategory.name !== updatedName) ||
      (updatedBillboardLabel &&
        existingCategory.billboardLabel !== updatedBillboardLabel) ||
      (existingBillboard &&
        existingCategory.billboardId?.toString() !==
          existingBillboard._id.toString());

    if (!isUpdateNeeded) {
      return NextResponse.json(
        { message: "Enter something different to update", success: false },
        { status: 400 }
      );
    }

    const updateData: Partial<{
      name: string;
      billboardLabel: string;
      billboardId: mongoose.Types.ObjectId;
    }> = {};

    if (updatedName) updateData.name = updatedName;
    if (updatedBillboardLabel && existingBillboard) {
      updateData.billboardLabel = updatedBillboardLabel;
      updateData.billboardId = existingBillboard._id;
    }

    const updatedCategory = await CategoryModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedCategory) {
      return NextResponse.json(
        { message: "Failed to update category", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Category updated successfully",
        success: true,
        data: updatedCategory,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating category:", error);
    return NextResponse.json(
      { message: "Error updating category", success: false },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  await dbConnect();
  try {
    const { id } = await request.json();

    if (!id) {
      return NextResponse.json({ message: "ID is required" }, { status: 400 });
    }

    const deletedBillboard = await CategoryModel.findByIdAndDelete(id);

    if (!deletedBillboard) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Category deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting category: ", error);
    return NextResponse.json(
      { message: "Error deleting category", success: false },
      { status: 500 }
    );
  }
}
