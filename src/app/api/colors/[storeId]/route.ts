import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/categories.model";
import ColorModel from "@/model/colors.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { name, value, categoryId, category } = await request.json();
    const url = new URL(request.url);
    const id = url.toString().split("/");
    const storeId = id[id.length - 1];

    if (!name || !value || !storeId || !categoryId || !category) {
      return NextResponse.json(
        { message: "All credentials required", success: false },
        { status: 400 }
      );
    }

    const sizes = new ColorModel({
      name,
      value,
      categoryId,
      storeId,
      category,
    });

    if (!sizes) {
      return NextResponse.json(
        { message: "DB error creating colors", success: false },
        { status: 500 }
      );
    }

    await sizes.save();

    return NextResponse.json(
      { message: "Colors added successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating colors: ", error);
    return NextResponse.json(
      { message: "Error creating colors", success: false },
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

    const color = await ColorModel.find({ storeId });

    if (!color) {
      return NextResponse.json(
        { message: "DB error while retrieving colors" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: color, message: "Colors retrieved" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting colors: ", error);
    return NextResponse.json(
      { message: "Error getting colors" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  await dbConnect();

  try {
    const { updatedName, updatedValue, id, updatedCategory } =
      await request.json();            

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json(
        { message: "Invalid ID", success: false },
        { status: 400 }
      );
    }
    if (!updatedName && !updatedValue && !updatedCategory) {
      return NextResponse.json(
        {
          message: "At least one of 'name', 'value', or 'category' is required",
          success: false,
        },
        { status: 400 }
      );
    }

    const existingSize = await ColorModel.findById(id);
    
    if (!existingSize) {
      return NextResponse.json(
        { message: "Color not found", success: false },
        { status: 404 }
      );
    }

    let category = null;
    if (updatedCategory) {
      category = await CategoryModel.findOne({ name: updatedCategory });
      if (!category) {
        return NextResponse.json(
          { message: "Category not found", success: false },
          { status: 404 }
        );
      }
    }
   
    const isUpdateNeeded =
      (updatedName && existingSize.name !== updatedName) ||
      (updatedValue && existingSize.value !== updatedValue) ||
      (category && existingSize.categoryId.toString() !== category._id.toString());
        
    if (!isUpdateNeeded) {
      return NextResponse.json(
        { message: "Enter something different to update", success: false },
        { status: 400 }
      );
    }

    const updateData: Partial<{
      name: string;
      value: string;
      categoryId: mongoose.Types.ObjectId;
      category: string;
    }> = {};

    if (updatedName) updateData.name = updatedName;
    if (updatedValue) updateData.value = updatedValue;
    if (updatedCategory) {
      updateData.categoryId = category?._id;
      updateData.category = updatedCategory
    }

    const updatedSize = await ColorModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSize) {
      return NextResponse.json(
        { message: "Failed to update color", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Color updated successfully",
        success: true,
        data: updatedSize,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating color:", error);
    return NextResponse.json(
      { message: "Error updating color", success: false },
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

    const deletedSize = await ColorModel.findByIdAndDelete(id);

    if (!deletedSize) {
      return NextResponse.json(
        { message: "Color not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Color deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting color: ", error);
    return NextResponse.json(
      { message: "Error deleting color", success: false },
      { status: 500 }
    );
  }
}