import React from 'react'
import { RxCross1 } from 'react-icons/rx'
import { useUser } from '../context/UserContext'
import { useNavigate } from 'react-router-dom'

const Refer = () => {
  const {setShowRefer} = useUser()
  const navigate = useNavigate()
  return (
    <div className='fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-h-screen h-full flex items-center justify-center bg-black/30'>
     
     <div className='relative'>
       <RxCross1 className="absolute text-xl right-8 top-3 bg-white w-5 cursor-pointer" onClick={() => setTimeout(() => {
         setShowRefer(false)
       }, 5000)}/>
        <div onClick={() => navigate("/refer")}>

        <img src="./banner.png" alt="" className='w-full px-5 lg:w-1/2' />
        </div>
      </div> 
    </div>
  )
}

export default Refer