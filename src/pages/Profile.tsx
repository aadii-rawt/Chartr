import React from 'react'
import { FaTicketAlt, FaUser } from 'react-icons/fa'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { IoMdShare } from 'react-icons/io'
import { IoTicketSharp } from 'react-icons/io5'
import { PiTicket } from 'react-icons/pi'
import { useUser } from '../context/UserContext'

const Profile = () => {
    const {user} = useUser();
    return (
    <div className='max-w-md mx-auto'>
            <header className='px-4 py-3 border-b border-gray-300 shadow'> My Profile</header>

            <div className='flex gap-3 items-center p-4 py-3'>
                <div className='w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center'> <FaUser size={28} /></div>
                <div className='text-sm'>
                    <h1 className='font-medium text-[15px]'>{user?.username || "Adi" }</h1>
                    <p>{user?.phone || "9928423479"}</p>
                </div>
            </div>
            <div className='mt-4 border-t border-gray-200 p-4 text-[15px] space-y-5'>
                <div className='flex items-center gap-4'> <FaTicketAlt  size={24} className='text-green-500' /><span>My Tickets</span></div>
                <div className='flex items-center gap-4'> <IoTicketSharp className='text-yellow-400'  size={24}  /><span>My Passes</span></div>
                <div className='flex items-center gap-4'> <IoMdShare   size={24}  /><span>Share app</span></div>
                <div className='flex items-center gap-4'> <HiOutlineDotsHorizontal  size={24}  /><span>Rate us</span></div>
                <div className='flex items-center gap-4'> <img src="./chartr-logo.png" className='w-8' alt="" /><span>Contact us</span></div>
            </div>
        </div>
    )
}

export default Profile