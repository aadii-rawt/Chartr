import React, { useEffect } from 'react'
import { Outlet, useNavigate } from 'react-router-dom'
import FooterNav from '../components/FooterNav'
import { useUser } from '../context/UserContext'
import ExpiredUI from '../components/ExpiredUI'

const Layout = () => {
  const { user,data, isExpired} = useUser()
  const navigate = useNavigate()

  useEffect(() => {
    if (!user) {
      navigate("/login")
      return
    }
  }, [])

  return (
    <div className='max-w-md mx-auto relative'>
     {!isExpired && <Outlet /> }


      <FooterNav />



      {isExpired && <ExpiredUI expired={isExpired} data={data} />}
    </div>
  )
}

export default Layout