"use client";
import Header from "@/components/Header";
import { useUserStore } from "@/store/useUserStore";
import React, { useEffect, useState } from "react";
import { DataTable } from "./data-table";
import axios from "axios";

const Categories = () => {
  const { storeId } = useUserStore();
  const [totalCategories, setTotalCategories] = useState<number>(0)
  useEffect(() => {
    const getTotalCategories = async () => {
      const response = await axios.get(`/api/categories/${storeId}`);
      setTotalCategories(response.data.data.length)      
    }
    getTotalCategories()
  }, [])
  return (
    <div>
      <Header
        name="Categories"
        stocks={totalCategories}
        desc="Manage categories for your store"
        route={`/manage-categories/storeId?${storeId}`}
      />
      <div className="mx-10 my-3">
        <DataTable />
      </div>
    </div>
  );
};

export default Categories;
