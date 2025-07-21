import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import FooterNav from '../components/FooterNav'
import { useUser } from '../context/UserContext'

const Layout = () => {
  const { user } = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
  }, [])

  return (
    <div className='max-w-md mx-auto'>
      <Outlet />
      <FooterNav />
    </div>
  )
}

export default Layout