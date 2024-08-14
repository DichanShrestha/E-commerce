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
import { IoIosArrowDown } from "react-icons/io";

const ManageColors = () => {
  const { storeId } = useUserStore();
  const [name, setName] = useState<string>("");
  const [value, setValue] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
  const [isUpdatePage, setIsUpdatePage] = useState<boolean>(false);
  const [fetchedCategories, setFetchedCategories] = useState<[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [categoryId, setCategoryId] = useState<string>("");
  const { toast } = useToast();
  const searchParams = useSearchParams();

  const updatedName = searchParams.get("name");
  const sizeId = searchParams.get("id");
  const updatedValue = searchParams.get("value");
  const updatedCategory = searchParams.get("category");

  useEffect(() => {
    if (updatedCategory || sizeId || updatedName || updatedValue) {
      setIsUpdatePage(true);
    }
    if (updatedName) {
      setName(updatedName);
    }
    if (updatedValue) {
      setValue(updatedValue);
    }
    if (updatedCategory) {
      setSelectedCategory(updatedCategory);
    }
  }, [updatedCategory, sizeId, updatedName, updatedValue]);

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

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("value", value);
      formData.set("categoryId", categoryId);
      formData.set("category", selectedCategory);

      if (!name) {
        setError("Name is required");
        return;
      }
      if (!value) {
        setError("Value is required");
        return;
      }
      if (!selectedCategory) {
        setError("Category is required");
        return;
      }

      const response = await axios.post(`/api/colors/${storeId}`, formData, {
        headers: {
          "Content-Type": "application/json",
        },
      });
      setName("");
      setValue("");
      setCategoryId("");
      setSelectedCategory("");
      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error: any) {
      console.log("error creating category: ", error);
      toast({
        title: "Error",
        description: error?.message || "Failed to create",
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
        updatedCategory: selectedCategory,
        updatedName: name,
        updatedValue,
        id: sizeId,
      };
      const response = await axios.patch(`/api/colors/${storeId}`, payload, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      toast({
        title: "Success",
        description: response.data.message,
      });
    } catch (error: any) {
      console.log("Error updating size: ", error);
      let errorMessage = "An unknown error occured";
      if (
        error.response &&
        error.response.data &&
        error.response.data.message
      ) {
        errorMessage = error.response.data.message;
      }
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  return (
    <div>
      <Header
        name="Manage colors"
        desc="Manage colors for your products"
        isEnabled={false}
      />

      <form
        onSubmit={isUpdatePage ? handleUpdate : handleCreate}
        className="mx-10"
      >
        <div className="flex flex-col md:flex-row justify-between lg:w-[900px] md:w-[700px]">
          <div className="w-[217px] sm:w-[48%] mb-4 sm:mb-0">
            <Label htmlFor="name" className="block text-sm font-medium">
              Name
            </Label>
            <Input
              value={name}
              onChange={(e) => {
                setName(e.target.value)
                setError("")
              }}
              id="name"
              className="mt-1 w-[217px]"
            />
            {error === "Name is required" ? (
              <span className="text-red-700 text-xs">{error}</span>
            ) : (
              ""
            )}
          </div>
          <div className="w-[217px] sm:w-[48%] mb-4 sm:mb-0">
            <Label htmlFor="Value" className="block text-sm font-medium">
              Value
            </Label>
            <Input
              value={value}
              onChange={(e) => {
                setValue(e.target.value)
                setError("")
              }}
              id="Value"
              className="mt-1 w-[217px]"
            />
            {error === "Value is required" ? (
              <span className="text-red-700 text-xs">{error}</span>
            ) : (
              ""
            )}
          </div>
          <div className="w-[217px]">
            <Label htmlFor="billboard" className="block text-sm font-medium">
              Category
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="w-[217px] sm:w-[217px] h-[45px] border dark:border-gray-700 rounded-md mt-1 flex items-center justify-between px-3 cursor-pointer">
                  <div className="flex justify-between w-full">
                    <span className="text-sm">
                      {selectedCategory ? selectedCategory : "Select Category"}
                    </span>
                    <IoIosArrowDown className="mt-[3px]" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full sm:w-[217px] mt-1">
                {fetchedCategories.map((item: any) => (
                  <div key={item.id}>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedCategory(item.name);
                        setCategoryId(item._id);
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
        </div>
        <div className="mt-3">
          <Button variant="outline" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Loading
              </>
            ) : isUpdatePage ? (
              "Update"
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </form>
    </div>
  );
};

export default ManageColors;
