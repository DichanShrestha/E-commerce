"use client";
import Header from "@/components/Header";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { IoIosArrowDown } from "react-icons/io";
import { useEffect, useState } from "react";
import axios from "axios";
import { useUserStore } from "@/store/useUserStore";
import { Button } from "@/components/ui/button";

const ManageCategories = () => {
  const [billboard, setBillboard] = useState<[]>([]);
  const { storeId } = useUserStore();
  const [selectedBillboard, setSelectedBillboard] = useState<string>("");

  useEffect(() => {
    const fetchBillboard = async () => {
      try {
        const response = await axios.get(`/api/billboards/${storeId}`);
        const transformedData = response.data.data.map((item: any) => ({
          id: item._id,
          label: item.label,
        }));
        setBillboard(transformedData);
      } catch (error) {
        console.error("Error fetching billboards:", error);
      }
    };

    fetchBillboard();
  }, []);

  return (
    <div>
      <Header
        name="Manage Categories"
        desc="Manage categories for your store"
        isEnabled={false}
      />
      <div className="mx-10">
        <div className="flex flex-col sm:flex-row justify-between lg:w-[900px] md:w-[700px]">
          <div className="w-[217px] sm:w-[48%] mb-4 sm:mb-0">
            <Label htmlFor="name" className="block text-sm font-medium">
              Name
            </Label>
            <Input id="name" className="mt-1 w-[217px]" />
          </div>
          <div className="w-[217px]">
            <Label htmlFor="billboard" className="block text-sm font-medium">
              Billboard
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="w-[217px] sm:w-[217px] h-[45px] border dark:border-gray-700 rounded-md mt-1 flex items-center justify-between px-3 cursor-pointer">
                  <div className="flex justify-between w-full">
                    <span className="text-sm">Select Billboard</span>
                    <IoIosArrowDown className="mt-[3px]" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full sm:w-[217px] mt-1">
                {billboard.map((item: any) => (
                  <div key={item.id}>
                    <DropdownMenuItem onClick={() => setSelectedBillboard(item.label)}>{item.label}</DropdownMenuItem>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-3">
          <Button variant="outline">Create</Button>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
