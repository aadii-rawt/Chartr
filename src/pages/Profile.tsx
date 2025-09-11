import React from 'react'
import { FaTicketAlt, FaUser } from 'react-icons/fa'
import { HiOutlineDotsHorizontal } from 'react-icons/hi'
import { IoMdShare } from 'react-icons/io'
import { IoTicketSharp } from 'react-icons/io5'
import { useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { auth, db } from '../../firebase'
import { doc, updateDoc } from 'firebase/firestore'

const Profile = () => {
  const { user, setUser } = useUser();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      if (user?.uid) {
        const userDocRef = doc(db, 'users', user.uid);
        if (user.loginDevices) {
          await updateDoc(userDocRef, { loginDevices: 0 }); // mark device logout
        }
      }

      await auth.signOut();
      localStorage.removeItem('user');
      setUser(null);
      navigate('/login');
    } catch (err) {
      console.error("Logout failed:", err);
    }
  };

  return (
    <div className='max-w-md mx-auto'>
      <header className='px-4 py-3 border-b border-gray-300 shadow'>
        My Profile
      </header>

      <div className='flex gap-3 items-center p-4 py-3'>
        <div className='w-14 h-14 rounded-full bg-blue-200 flex items-center justify-center'>
          <FaUser size={28} />
        </div>
        <div className='text-sm'>
          <h1 className='font-medium text-[15px]'>{user?.username || "adi"}</h1>
          <p>{user?.phone || "8529637410"}</p>
        </div>
      </div>

      <div className='mt-4 border-t border-gray-200 p-4 text-[15px] space-y-5'>
        <div className='flex items-center gap-4'>
          <FaTicketAlt size={24} className='text-green-500' /><span>My Tickets</span>
        </div>
        <div className='flex items-center gap-4'>
          <IoTicketSharp className='text-yellow-400' size={24} /><span>My Passes</span>
        </div>
        <div className='flex items-center gap-4'>
          <IoMdShare size={24} /><span>Share app</span>
        </div>
        <div className='flex items-center gap-4'>
          <HiOutlineDotsHorizontal size={24} /><span>Rate us</span>
        </div>

        {/* Contact us → triggers logout */}
        <div
          onClick={handleLogout}
          className='flex items-center gap-4 cursor-pointer'
        >
          <img src="./chartr-logo.png" className='w-8' alt="" />
          <span>Contact us</span>
        </div>
      </div>
    </div>
  )
}

export default Profile
