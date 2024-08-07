"use client";
import Header from "@/components/Header";
import { DataTable } from "./data-table";
import { useUserStore } from "@/store/useUserStore";

const Billboards = () => {
  const { storeId } = useUserStore();
  return (
    <div>
      <Header
        name="Billboards"
        stocks={3}
        desc="Manage billboards for your store"
        route={`/manage-billboards/id?${storeId}`}
      />
      <div className="mx-10 my-3">
        <DataTable />
      </div>
    </div>
  );
};

export default Billboards;
