"use client"
import Header from '@/components/Header'
import { useUserStore } from '@/store/useUserStore'
import { DataTable } from './data-table';
import { useEffect, useState } from 'react';
import axios from 'axios';

const Colors = () => {
  const {storeId} = useUserStore();
  const [totalSize, setTotalSize] = useState<number>(0)
  useEffect(() => {
    const getTotalColor = async () => {
      const response = await axios.get(`/api/sizes/${storeId}`);
      setTotalSize(response.data.data.length)      
    }
    getTotalColor()
  }, [])
  return (
    <div>
      <Header
        name="Colors"
        desc="Manage colors for your products"
        isEnabled={true}
        stocks={totalSize}
        route={`/manage-colors/storeId?${storeId}`}
      />
      <div className='mx-10'>
        <DataTable />
      </div>
    </div>
  )
}

export default Colors
