import dbConnect from "@/lib/dbConnect";
import ProductModel from "@/model/products.model";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { name, size, category, color, imageURL, price, featured, archived } =
      await request.json();
    const url = new URL(request.url);
    const id = url.toString().split("/");
    const storeId = id[id.length - 1];

    if (!name || !size || !category || !color || !imageURL || !price) {
      return NextResponse.json(
        { message: "All credentials required", success: false },
        { status: 400 }
      );
    }

    const product = new ProductModel({
      storeId,
      name,
      size,
      category,
      price,
      color,
      imageURL,
      featured,
      archived,
    });

    if (!product) {
      return NextResponse.json(
        { message: "DB error in creating product", success: false },
        { status: 500 }
      );
    }

    await product.save();
    return NextResponse.json(
      { message: "Product added successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.log("Error adding products: ", error);
    return NextResponse.json(
      { message: "Error adding products", success: false },
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

    const product = await ProductModel.find({ storeId });

    if (!product) {
      return NextResponse.json(
        { message: "DB error while retrieving products" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: product, message: "Products retrieved" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting products: ", error);
    return NextResponse.json(
      { message: "Error getting products" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  await dbConnect();

  try {
    const { updatedName, updatedColor, productId, updatedCategory, updatedSize, updatedPrice, updatedFeatured, updatedArchived, updatedImageURL } =
      await request.json();

    if (!mongoose.Types.ObjectId.isValid(productId)) {
      return NextResponse.json(
        { message: "Invalid ID", success: false },
        { status: 400 }
      );
    }

    const existingProduct = await ProductModel.findById(productId);

    if (!existingProduct) {
      return NextResponse.json(
        { message: "Product not found", success: false },
        { status: 404 }
      );
    }

    const isUpdateNeeded =
      (updatedName && existingProduct.name !== updatedName) ||
      (updatedColor && existingProduct.color !== updatedColor) ||
      (updatedPrice && existingProduct.price !== updatedPrice) ||
      (updatedCategory && existingProduct.category !== updatedCategory) ||
      (updatedSize && existingProduct.size !== updatedSize) ||
      (typeof updatedFeatured === 'boolean' && existingProduct.featured !== updatedFeatured) ||
      (typeof updatedArchived === 'boolean' && existingProduct.archived !== updatedArchived) ||
      (updatedImageURL && existingProduct.imageURL !== updatedImageURL);

    if (!isUpdateNeeded) {
      return NextResponse.json(
        { message: "Enter something different to update", success: false },
        { status: 400 }
      );
    }

    const updateData: Partial<{
      name: string;
      color: string;
      category: string;
      size: string;
      price: number;
      featured: boolean;
      archived: boolean;
      imageURL: string;
    }> = {};

    if (updatedName) updateData.name = updatedName;
    if (updatedColor) updateData.color = updatedColor;
    if (updatedCategory) updateData.category = updatedCategory;
    if (updatedSize) updateData.size = updatedSize;
    if (updatedPrice) updateData.price = updatedPrice;
    if (typeof updatedFeatured === 'boolean') updateData.featured = updatedFeatured;
    if (typeof updatedArchived === 'boolean') updateData.archived = updatedArchived;
    if (updatedImageURL) updateData.imageURL = updatedImageURL;

    const updatedProduct = await ProductModel.findByIdAndUpdate(productId, updateData, {
      new: true,
      runValidators: true,
    });

    if (!updatedProduct) {
      return NextResponse.json(
        { message: "Failed to update product", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Product updated successfully",
        success: true,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating product:", error);
    return NextResponse.json(
      { message: "Error updating product", success: false },
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

    const deletedSize = await ProductModel.findByIdAndDelete(id);

    if (!deletedSize) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Product deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting product: ", error);
    return NextResponse.json(
      { message: "Error deleting product", success: false },
      { status: 500 }
    );
  }
}