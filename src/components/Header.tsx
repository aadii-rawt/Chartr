import React from 'react'
import { FaEarthAfrica } from 'react-icons/fa6'
import { ImEarth } from 'react-icons/im'
import { IoLogOutOutline } from 'react-icons/io5'
import { Link, useNavigate } from 'react-router-dom'
import { useUser } from '../context/UserContext'
import { doc, updateDoc } from 'firebase/firestore'
import { db,auth } from "../../firebase";
const Header = () => {
    const { user,setUser } = useUser()
    const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            if (user?.uid) {
                const userDocRef = doc(db, 'users', user.uid);
                if (user.loginDevices) {
                    await updateDoc(userDocRef, { loginDevices: 0 }); 
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
        <div className="h-16 flex  justify-end items-center px-4 border-b border-white/10 text-white">

            <Link to="/" className='w-8 h-8 rounded bg-[#111] flex items-center justify-center'>
                <ImEarth />
            </Link>
            <button className='w-8 h-8 rounded bg-red-500 ml-4 cursor-pointer flex items-center justify-center'><IoLogOutOutline /></button>
        </div>
    )
}

export default Header