"use client";
import Header from "@/components/Header";
import { useUserStore } from "@/store/useUserStore";
import React from "react";
import { DataTable } from "./data-table";

const Categories = () => {
  const { storeId } = useUserStore();
  return (
    <div>
      <Header
        name="Categories"
        stocks={3}
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
