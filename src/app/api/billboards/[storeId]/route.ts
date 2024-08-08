import dbConnect from "@/lib/dbConnect";
import BillboardModel from "@/model/billboards.model";
import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  await dbConnect();
  try {
    const { imageURL, label, publicId, store } = await request.json();
    const url = new URL(request.url);
    const id = url.toString().split("/");
    const storeId = id[id.length - 1];

    if (!imageURL || !label || !publicId || !store) {
      return NextResponse.json(
        { message: "All credentials are required" },
        { status: 400 }
      );
    }

    const billboard = new BillboardModel({
      imageURL,
      label,
      publicId,
      storeId,
    });

    await billboard.save();

    return NextResponse.json(
      { message: "Billboard added successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error creating billboard: ", error);
    return NextResponse.json(
      { message: "Error creating billboard", success: false },
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

    const billboards = await BillboardModel.find({ storeId });

    if (!billboards) {
      return NextResponse.json(
        { message: "DB error while retrieving billboards" },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { data: billboards, message: "Billboards retrieved" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error getting billboards: ", error);
    return NextResponse.json(
      { message: "Error getting billboards" },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  await dbConnect();

  try {
    const { updatedLabel, updatedImageURL, id } = await request.json();

    if (!id) {
      return NextResponse.json(
        { message: "Billboard ID is required", success: false },
        { status: 400 }
      );
    }

    if (!updatedLabel && !updatedImageURL) {
      return NextResponse.json(
        {
          message: "At least one of 'label' or 'imageURL' is required",
          success: false,
        },
        { status: 400 }
      );
    }

    type UpdateDataType = {
      label?: string;
      imageURL?: string;
    };

    const updateData: UpdateDataType = {};
    if (updatedLabel) updateData.label = updatedLabel;
    if (updatedImageURL) updateData.imageURL = updatedImageURL;
    console.log(updateData);

    const updatedBillboard = await BillboardModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    console.log(updatedBillboard);

    if (!updatedBillboard) {
      return NextResponse.json(
        { message: "Failed to update billboard", success: false },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        message: "Billboard updated successfully",
        success: true,
        data: updatedBillboard,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error updating billboard:", error);
    return NextResponse.json(
      { message: "Error updating billboard", success: false },
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

    const deletedBillboard = await BillboardModel.findByIdAndDelete(id);

    if (!deletedBillboard) {
      return NextResponse.json(
        { message: "Billboard not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Billboard deleted successfully", success: true },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error deleting billboard: ", error);
    return NextResponse.json(
      { message: "Error deleting billboard", success: false },
      { status: 500 }
    );
  }
}
