import React from 'react'
import Sidebar from '../components/Sidebar'
import { Outlet } from 'react-router-dom'
import Header from '../components/Header'

const AdminLayout = () => {
  return (
    <div className='flex bg-black'>
      <Sidebar />
      <div className='flex-1'>
        <div>
          <Header />
          <div className='p-6'>
            <Outlet />

          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminLayout