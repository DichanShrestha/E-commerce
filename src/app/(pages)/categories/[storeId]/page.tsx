import Header from '@/components/Header'
import { useUserStore } from '@/store/useUserStore'
import React from 'react'

const ManageCategories = () => {
    const {storeId} = useUserStore()
  return (
    <div>
      <Header
        name="Billboards"
        stocks={3}
        desc="Manage billboards for your store"
        route={`/manage-billboards/storeId?${storeId}`}
      />
    </div>
  )
}

export default ManageCategories
