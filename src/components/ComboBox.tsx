"use client";

import { useEffect, useState } from "react";
import { ChevronsUpDown } from "lucide-react";
import { Command, CommandGroup, CommandInput } from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { TbHomeDollar } from "react-icons/tb";
import { HiOutlinePlusCircle } from "react-icons/hi";
import axios from "axios";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "./ui/use-toast";
import { useUserStore } from "@/store/useUserStore";

type Framework = {
  _id: string;
  name: string;
};

export default function ComboBox() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState<string>("");
  const [stores, setStores] = useState<Framework[]>([]);
  const [filteredStores, setFilteredStores] = useState<Framework[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [displayedStoreName, setDisplayedStoreName] = useState<string>("");
  const { toast } = useToast();
  const { setStore } = useUserStore();

  const handleCreate = async () => {
    try {
      const response = await axios.post("/api/store", { name }, {
        headers: { "Content-Type": "application/json" },
      });
      toast({
        title: "Success",
        description: response.data.message,
      });
      // Refresh the stores list after creating a new store
      fetchStores();
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  // Fetch all stores
  const fetchStores = async () => {
    try {
      const response = await axios.get("/api/store");
      setStores(response.data.data);
      setFilteredStores(response.data.data);
    } catch (error) {
      console.log("Error fetching stores: ", error);
    }
  };

  useEffect(() => {
    fetchStores();

    // Load store name from localStorage on component mount
    const savedStoreName = localStorage.getItem("storeName");
    if (savedStoreName) {
      setDisplayedStoreName(savedStoreName);
      setStore(savedStoreName);
    }
  }, []);

  useEffect(() => {
    const lowercasedQuery = searchQuery.toLowerCase();
    const filtered = stores.filter((item) =>
      item.name.toLowerCase().includes(lowercasedQuery)
    );
    setFilteredStores(filtered);
  }, [searchQuery, stores]);

  useEffect(() => {
    if (displayedStoreName) {
      localStorage.setItem("storeName", displayedStoreName);
    }
  }, [displayedStoreName]);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[180px] justify-between"
        >
          <TbHomeDollar className="font-bold" />
          <span className="font-bold text-md">
            {displayedStoreName ? displayedStoreName : "Select Store"}
          </span>
          <ChevronsUpDown className="ml-4 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-[180px] p-0">
        <Command>
          <Input
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search Store"
            className="border-none"
          />
          <hr />
          <CommandGroup>
            {filteredStores.map((framework) => (
              <div
                key={framework._id}
                className="flex gap-2 align-middle ml-3 my-1 cursor-pointer"
                onClick={() => {
                  setDisplayedStoreName(framework.name);
                  setStore(framework.name);
                }}
              >
                <TbHomeDollar className="mt-[2px]" />
                <span className="text-sm">{framework.name}</span>
              </div>
            ))}
          </CommandGroup>
        </Command>
        <hr />

        <Dialog>
          <DialogTrigger asChild>
            <div className="flex items-center ml-4 gap-2 cursor-pointer my-1">
              <HiOutlinePlusCircle className="h-4 w-4" />
              <span className="text-sm">Create</span>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>Add store</DialogTitle>
              <DialogDescription>
                Create a new store to add your products
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  id="name"
                  className="col-span-3"
                />
              </div>
            </div>
            <DialogFooter>
              <Button onClick={handleCreate} variant="outline" type="submit">
                Add
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </PopoverContent>
    </Popover>
  );
}
