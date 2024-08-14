import dbConnect from "@/lib/dbConnect";
import CategoryModel from "@/model/categories.model";
import SizeModel from "@/model/sizes.model";
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

    const sizes = new SizeModel({
      name,
      value,
      categoryId,
      storeId,
      category,
    });

    if (!sizes) {
      return NextResponse.json(
        { message: "DB error creating sizes", success: false },
        { status: 500 }
      );
    }

    await sizes.save();

    return NextResponse.json(
      { message: "Sizes created successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating sizes: ", error);
    return NextResponse.json(
      { message: "Error creating sizes", success: false },
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

    const size = await SizeModel.find({ storeId });

    if (!size) {
      return NextResponse.json(
        { message: "DB error while retrieving sizes" },
        { status: 500 }
      );
    }


    return NextResponse.json(
      { data: size, message: "Sizes retrieved" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting sizes: ", error);
    return NextResponse.json(
      { message: "Error getting sizes" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  await dbConnect();

  try {
    const { updatedName, updatedValue, id, updatedCategory } = await request.json();  

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

    const existingSize = await SizeModel.findById(id);
    
    if (!existingSize) {
      return NextResponse.json(
        { message: "Size not found", success: false },
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
    if (category) {
      updateData.categoryId = category._id;
      updateData.category = updatedCategory;
    }

    const updatedSize = await SizeModel.findByIdAndUpdate(id, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedSize) {
      return NextResponse.json(
        { message: "Failed to update size", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Size updated successfully",
        success: true,
        data: updatedSize,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating size:", error);
    return NextResponse.json(
      { message: "Error updating size", success: false },
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

    const deletedSize = await SizeModel.findByIdAndDelete(id);

    if (!deletedSize) {
      return NextResponse.json(
        { message: "Size not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Size deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting size: ", error);
    return NextResponse.json(
      { message: "Error deleting size", success: false },
      { status: 500 }
    );
  }
}