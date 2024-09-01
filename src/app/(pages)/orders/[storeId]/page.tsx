"use client"
import Header from '@/components/Header'
import { useUserStore } from '@/store/useUserStore'
import React from 'react'
import { DataTable } from './data-table'

const Orders = () => {
    const {storeId} = useUserStore()
  return (
    <div>
      <Header
        name="Orders"
        isEnabled={false}
        desc="Check orders for your products"
        stocks={2}
        route={`/manage-colors/storeId?${storeId}`}
      />
      <div className='mx-10'>
        <DataTable />
      </div>
    </div>
  )
}

export default Orders
