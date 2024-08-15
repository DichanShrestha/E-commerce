"use client";
import Header from "@/components/Header";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import { useUserStore } from "@/store/useUserStore";
import axios from "axios";
import { Loader2 } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useState } from "react";
import { FaLess } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";

const ManageProducts = () => {
  // UI states
  const { storeId } = useUserStore();
  const { toast } = useToast();
  const [fetchedCategories, setFetchedCategories] = useState<[]>([]);
  const [fetchedSizes, setFetchedSizes] = useState<[]>([]);
  const [fetchedColors, setFetchedColors] = useState<[]>([]);
  const [error, setError] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // form states
  const [imageURL, setImageURL] = useState<File | string>("");
  const [publicId, setPublicId] = useState<string>("");
  const [featured, setFeatured] = useState<boolean>(false);
  const [archived, setArchived] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const [price, setPrice] = useState<number | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [selectedColor, setSelectedColor] = useState<string>("");
  // update states
  const searchParams = useSearchParams();
  const productId = searchParams.get("id");
  const updateName = searchParams.get("name");
  const updateFeatured = searchParams.get("featured");
  const updateArchived = searchParams.get("archived");
  const updatePrice = searchParams.get("Price");
  const updateSize = searchParams.get("Size");
  const updateColor = searchParams.get("color");
  const updateCategory = searchParams.get("category");
  const [isFeaturedChecked, setIsFeaturedChecked] = useState<boolean>(false);
  const [isArchivedChecked, setIsArchivedChecked] = useState<boolean>(false);
  const [isUpdatePage, setIsUpdatePage] = useState<boolean>(false);

  // set values to be updated
  useEffect(() => {
    if (updateName) {
      setName(updateName);
      setIsUpdatePage(true);
    }
    if (updateArchived) {
      setArchived(updateArchived === "true" ? true : false);
      setIsArchivedChecked(updateArchived === "true" ? true : false);
    }
    if (updateFeatured) {
      setFeatured(updateFeatured === "true" ? true : false);
      setIsFeaturedChecked(updateFeatured === "true" ? true : false);
    }
    if (updatePrice) {
      setPrice(Number(updatePrice));
    }
    if (updateSize) {
      setSelectedSize(updateSize);
    }
    if (updateColor) {
      setSelectedColor(updateColor);
    }
    if (updateCategory) {
      setSelectedCategory(updateCategory);
    }
  }, []);

  // fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`/api/categories/${storeId}`);
        setFetchedCategories(response.data.data);
      } catch (error: any) {
        console.error("Error fetching categories: ", error.message);
      }
    };
    fetchCategories();
  }, []);

  // fetch sizes
  useEffect(() => {
    const fetchSize = async () => {
      try {
        const response = await axios.get(`/api/sizes/${storeId}`);
        setFetchedSizes(response.data.data);
      } catch (error: any) {
        console.error("Error fetching sizes: ", error.message);
      }
    };
    fetchSize();
  }, []);

  // fetch colors
  useEffect(() => {
    const fetchColors = async () => {
      try {
        const response = await axios.get(`/api/colors/${storeId}`);
        setFetchedColors(response.data.data);
      } catch (error: any) {
        console.error("Error fetching colors: ", error.message);
      }
    };
    fetchColors();
  }, []);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (imageURL) {
      handleImageDelete();
    }
    if (e.target.files && e.target.files.length > 0) {
      setImageURL(e.target.files[0]);
      setError("");
      const formData = new FormData();
      formData.append("file", e.target.files[0]);
      try {
        const response = await axios.post("/api/cloudinary", formData);
        setPublicId(response.data.data.public_id);
        setImageURL(response.data.data.url);
      } catch (error) {
        console.log("error while uploading image: ", error);
      }
    }
  };

  const handleImageDelete = async () => {
    try {
      await axios.delete("/api/cloudinary", {
        data: { public_id: publicId },
        headers: {
          "Content-Type": "application/json",
        },
      });
      setPublicId("");
      setImageURL("");
    } catch (error: any) {
      console.log(error.response.data.error || "An error occurred");
    }
  };

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      if (!imageURL) {
        setError("Image is required");
        return;
      }
      if (!name) {
        setError("Name is required");
        return;
      }
      if (!price) {
        setError("Price is required");
        return;
      }
      if (!selectedCategory) {
        setError("Category is required");
        return;
      }
      if (!selectedSize) {
        setError("Size is required");
        return;
      }
      if (!selectedColor) {
        setError("Color is required");
        return;
      }

      const payload = {
        name,
        price,
        imageURL,
        category: selectedCategory,
        size: selectedSize,
        color: selectedColor,
        featured,
        archived,
      };
      const response = await axios.post(`/api/products/${storeId}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setName("");
      setPrice(null);
      setSelectedCategory("");
      setSelectedColor("");
      setSelectedSize("");
      setImageURL("");
      setFeatured(false);
      setArchived(false);
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error: any) {
      console.log("Error submitting products: ", error);
      toast({
        title: "Failed",
        description: error.response.data.error,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdate = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const payload = {
        productId,
        updatedName: updateName === name ? null : name,
        updatedPrice: updatePrice == price ? null : price,
        updatedColor: updateColor === selectedColor ? null : selectedColor,
        updatedCategory: updateCategory === selectedCategory ? null : selectedCategory,
        updatedSize: updateSize === selectedSize ? null : selectedSize,
        updatedFeatured:
          updateFeatured?.toString() === featured.toString()
            ? null
            : featured,
        updatedArchived:
          updateArchived?.toString() === archived.toString()
            ? null
            : archived,
        updatedImageURL: imageURL,
      };
      
      const response = await axios.patch(`/api/products/${storeId}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error: any) {
      toast({
        title: "Failed",
        description: error.response.data.message,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      <Header
        name="Products"
        desc="Manage products for your store"
        isEnabled={false}
      />
      <form
        className="mx-10"
        onSubmit={isUpdatePage ? handleUpdate : handleCreate}
      >
        <div className="max-w-64">
          <Label htmlFor="image" className="text-sm mb-2">
            Images
          </Label>
          <Input
            onChange={(e) => {
              handleImageChange(e);
              setError("");
            }}
            id="image"
            type="file"
          />
          {error === "Image is required" ? (
            <span className="text-red-700 text-xs">{error}</span>
          ) : (
            ""
          )}
        </div>
        <div className="flex flex-wrap gap-7 mt-4">
          <div className="w-[209px]">
            <Label htmlFor="name" className="text-sm mb-2">
              Name
            </Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                setError("");
              }}
              id="name"
              type="text"
            />
            {error === "Name is required" ? (
              <span className="text-red-700 text-xs">{error}</span>
            ) : (
              ""
            )}
          </div>
          <div className="w-[209px]">
            <Label htmlFor="price" className="text-sm mb-2">
              Price
            </Label>
            <Input
              value={price?.toString()}
              onChange={(e) => {
                setPrice(Number(e.target.value));
                setError("");
              }}
              id="price"
              type="text"
            />
            {error === "Price is required" ? (
              <span className="text-red-700 text-xs">{error}</span>
            ) : (
              ""
            )}
          </div>
          <div className="w-[209px]">
            <Label htmlFor="category" className="text-sm mb-2">
              Category
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="w-[209px] sm:w-[209px] h-[43px] border dark:border-gray-700 rounded-md flex items-center justify-between px-3 cursor-pointer">
                  <div className="flex justify-between w-full">
                    <span className="text-sm">
                      {selectedCategory ? selectedCategory : "Select Category"}
                    </span>
                    <IoIosArrowDown className="mt-[3px]" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full sm:w-[209px] mt-1">
                {fetchedCategories.map((item: any) => (
                  <div key={item.id}>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedCategory(item.name);
                      }}
                    >
                      {item.name}
                    </DropdownMenuItem>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {error === "Category is required" ? (
              <span className="text-red-700 text-xs">{error}</span>
            ) : (
              ""
            )}
          </div>
          <div className="w-[209px]">
            <Label htmlFor="size" className="text-sm mb-2">
              Size
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="w-[209px] sm:w-[209px] h-[43px] border dark:border-gray-700 rounded-md flex items-center justify-between px-3 cursor-pointer">
                  <div className="flex justify-between w-full">
                    <span className="text-sm">
                      {selectedSize ? selectedSize : "Select Size"}
                    </span>
                    <IoIosArrowDown className="mt-[3px]" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full sm:w-[209px] mt-1">
                {fetchedSizes.map((item: any) => (
                  <div key={item.id}>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedSize(item.name);
                      }}
                    >
                      {item.name}
                    </DropdownMenuItem>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {error === "Size is required" ? (
              <span className="text-red-700 text-xs">{error}</span>
            ) : (
              ""
            )}
          </div>
          <div className="w-[209px]">
            <Label htmlFor="color" className="text-sm mb-2">
              Color
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="w-[209px] sm:w-[209px] h-[43px] border dark:border-gray-700 rounded-md flex items-center justify-between px-3 cursor-pointer">
                  <div className="flex justify-between w-full">
                    <span className="text-sm">
                      {selectedColor ? selectedColor : "Select Color"}
                    </span>
                    <IoIosArrowDown className="mt-[3px]" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full sm:w-[209px] mt-1">
                {fetchedColors.map((item: any) => (
                  <div key={item.id}>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedColor(item.name);
                      }}
                    >
                      {item.name}
                    </DropdownMenuItem>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
            {error === "Color is required" ? (
              <span className="text-red-700 text-xs">{error}</span>
            ) : (
              ""
            )}
          </div>
          <div className="flex gap-3 border-gray-600 dark:border-gray-400 border-[1px] p-2 rounded-lg w-[209px]">
            <div>
              <Input
                className="cursor-pointer"
                checked={isFeaturedChecked}
                type="checkbox"
                onChange={(e) => {
                  setFeatured(e.target.checked);
                  setIsFeaturedChecked(!isFeaturedChecked);
                }}
              />
            </div>
            <div className="flex flex-col flex-wrap">
              <span className="text-sm font-bold">Featured</span>
              <span className="text-xs dark:text-gray-400 text-gray-600">
                This product will appear on the home page
              </span>
            </div>
          </div>
          <div className="flex gap-3 border-gray-600 dark:border-gray-400 border-[1px] p-2 rounded-lg w-[209px]">
            <div>
              <Input
                className="cursor-pointer"
                checked={isArchivedChecked}
                type="checkbox"
                onChange={(e) => {
                  setArchived(e.target.checked);
                  setIsArchivedChecked(!isArchivedChecked);
                }}
              />
            </div>
            <div className="flex flex-col flex-wrap">
              <span className="text-sm font-bold">Archived</span>
              <span className="text-xs dark:text-gray-400 text-gray-600">
                This product will not appear anywhere on the store
              </span>
            </div>
          </div>
        </div>
        <Button
          disabled={isLoading}
          className="mt-5"
          type="submit"
          variant="outline"
        >
          {isLoading ? (
            <div className="flex gap-2">
              <Loader2 className="animate-spin h-4 w-4" /> Please Wait
            </div>
          ) : isUpdatePage ? (
            "Update"
          ) : (
            "Create"
          )}
        </Button>
      </form>
    </div>
  );
};

export default ManageProducts;
