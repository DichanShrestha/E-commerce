"use client";
import Header from "@/components/Header";
import { DataTable } from "./data-table";
import { useUserStore } from "@/store/useUserStore";
import { useEffect, useState } from "react";
import axios from "axios";

const Billboards = () => {
  const { storeId } = useUserStore();
  const [totalBillboards, setTotalBillboards] = useState<number>(0);

  useEffect(() => {
    const getTotalCategories = async () => {
      const response = await axios.get(`/api/billboards/${storeId}`);
      setTotalBillboards(response.data.data.length)      
    }
    getTotalCategories()
  }, [])
  return (
    <div>
      <Header
        name="Billboards"
        stocks={totalBillboards}
        desc="Manage billboards for your store"
        route={`/manage-billboards/storeId?${storeId}`}
      />
      <div className="mx-10 my-3">
        <DataTable />
      </div>
    </div>
  );
};

export default Billboards;
