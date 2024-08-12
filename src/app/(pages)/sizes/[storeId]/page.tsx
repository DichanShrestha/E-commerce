"use client";
import Header from "@/components/Header";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import axios from "axios";

const Sizes = () => {
  const { storeId } = useUserStore();
  const [totalSizes, setTotalSizes] = useState<number>(0)
  useEffect(() => {
    const getTotalCategories = async () => {
      const response = await axios.get(`/api/sizes/${storeId}`);
      setTotalSizes(response.data.data.length)      
    }
    getTotalCategories()
  }, [])
  return (
    <div>
      <Header
        name="Sizes"
        desc="Manage sizes for your products"
        isEnabled={true}
        stocks={totalSizes}
        route={`/manage-sizes/storeId?${storeId}`}
      />
      <div className="mx-10 my-3">
        <DataTable />
      </div>
    </div>
  );
};

export default Sizes;
