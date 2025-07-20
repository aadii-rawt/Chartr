import React from 'react'
import { PiTicket } from 'react-icons/pi'

const Profile = () => {
    return (
        <div>
            <header className='px-4 py-3 border-b border-gray-300 shadow text-[15px]'> My Profile</header>

            <div className='flex gap-3 items-center p-4 py-3'>
                <div className='w-14 h-14 rounded-full bg-blue-200'></div>
                <div className='text-sm'>
                    <h1 className='font-medium text-[15px]'>Aditya Rawat</h1>
                    <p>9928423479</p>
                </div>
            </div>
            <div className='mt-4 border-t border-gray-200 p-4 text-[15px] space-y-5'>
                <div className='flex items-center gap-4'> <PiTicket size={24}  /><span>My Tickets</span></div>
                <div className='flex items-center gap-4'> <PiTicket size={24}  /><span>My Passes</span></div>
                <div className='flex items-center gap-4'> <PiTicket size={24}  /><span>Share app</span></div>
                <div className='flex items-center gap-4'> <PiTicket size={24}  /><span>Rate us</span></div>
                <div className='flex items-center gap-4'> <PiTicket size={24}  /><span>Contact us</span></div>
            </div>
        </div>
    )
}

export default Profile