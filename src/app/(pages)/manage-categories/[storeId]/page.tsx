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
import { useToast } from "@/components/ui/use-toast";
import { Loader2 } from "lucide-react";

const ManageCategories = () => {
  const [billboard, setBillboard] = useState<[]>([]);
  const [billboardId, setBillboardId] = useState<string>("");
  const { storeId } = useUserStore();
  const [selectedBillboard, setSelectedBillboard] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [name, setName] = useState<string>("");
  const { toast } = useToast();

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

  const handleCreate = async () => {
    setIsLoading(true);
    try {
      const formData = new FormData();
      formData.set("name", name);
      formData.set("storeId", storeId);
      formData.set("billboardId", billboardId);
      formData.set("billboardLabel", selectedBillboard);

      const response = await axios.post(
        `/api/categories/${storeId}`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      setName("");
      setSelectedBillboard("");
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
            <Input
              value={name}
              onChange={(e) => setName(e.target.value)}
              id="name"
              className="mt-1 w-[217px]"
            />
          </div>
          <div className="w-[217px]">
            <Label htmlFor="billboard" className="block text-sm font-medium">
              Billboard
            </Label>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <div className="w-[217px] sm:w-[217px] h-[45px] border dark:border-gray-700 rounded-md mt-1 flex items-center justify-between px-3 cursor-pointer">
                  <div className="flex justify-between w-full">
                    <span className="text-sm">
                      {selectedBillboard
                        ? selectedBillboard
                        : "Select Billboard"}
                    </span>
                    <IoIosArrowDown className="mt-[3px]" />
                  </div>
                </div>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full sm:w-[217px] mt-1">
                {billboard.map((item: any) => (
                  <div key={item.id}>
                    <DropdownMenuItem
                      onClick={() => {
                        setSelectedBillboard(item.label);
                        setBillboardId(item.id);
                      }}
                    >
                      {item.label}
                    </DropdownMenuItem>
                  </div>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="mt-3">
          <Button onClick={handleCreate} variant="outline" disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="animate-spin h-4 w-4 mr-2" />
                Loading
              </>
            ) : (
              "Create"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ManageCategories;
