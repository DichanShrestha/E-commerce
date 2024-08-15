"use client"
import Header from '@/components/Header'
import { useUserStore } from '@/store/useUserStore'
import { DataTable } from './data-table'
import { useEffect, useState } from 'react'
import axios from 'axios'

const Products = () => {
    const {storeId} = useUserStore()
    const [totalSize, setTotalSize] = useState<number>(0)
    useEffect(() => {
      const getTotalProduct = async () => {
        const response = await axios.get(`/api/products/${storeId}`);
        setTotalSize(response.data.data.length)      
      }
      getTotalProduct()
    }, [])
  return (
    <div>
      <Header
        name="Products"
        desc="Manage products for your store"
        isEnabled={true}
        stocks={totalSize}
        route={`/manage-products/storeId?${storeId}`}
      />
      <div className='mx-10'>
        <DataTable />
      </div>
    </div>
  )
}

export default Products
