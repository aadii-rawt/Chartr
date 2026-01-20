import React, { useState } from 'react'
import { FaUserCircle } from 'react-icons/fa'
import { Link } from 'react-router-dom'
import LocationSearch from '../components/LocationSearch'
import TransportHomeCards from '../components/TransportHomeCards'
import { IoMdBus } from 'react-icons/io'
import { useUser } from '../context/UserContext'
import RenewModal from '../components/RenewModal'

const NewHome = () => {
    const [showRenew,setRenew] = useState(true)
    return (
        <div className='min-h-screen relative pb-20'>
            <div className='bg-[url("/header-bg.png")] absolute top-0 left-0 -z-10 opacity-70 h-30 w-full bg-bottom bg-cover '>

            </div>
            {/*------------- header ---------------- */}
            <div className='flex justify-between items-center px-4 py-4'>
                <div>
                    <img src="https://framerusercontent.com/images/yEa4ce8bqOfVAhNkZNCbXV3cgd4.png" alt="" className='w-28' />
                    {/* <h1>Chartr</h1> */}
                </div>
                <div className='flex  gap-5 items-center'>
                    <div className='bg-white text-sm font-medium px-2 py-0.5 rounded-tl-2xl rounded-r-2xl'>
                        ₹0.0
                    </div>
                    <Link to='/profile'><FaUserCircle size={28} /></Link>
                </div>
            </div>

            {/*------------- search ---------------- */}

            <div className='mt-16'>
                <LocationSearch />
            </div>

            {/*------------- tickets cards ---------------- */}

            <div className='mt-5 px-4'>
                <p className='text-sm py-3 text-gray-500'>YOUR TRAVEL KIT</p>
                <TransportHomeCards />
            </div>

            {/*------------- current location ---------------- */}

            <div className='mt-2 '>
                <p className='text-sm py-3 text-gray-500 px-4'>AROUND YOU</p>
                <img src="/new-map.png" alt="" />
                <div className='px-4'>
                    <div className='flex items-center justify-between gap-3 border-b border-gray-300 py-2'>
                        <div className='w-7 h-7 bg-green-700 rounded-full flex items-center justify-center text-white'> <IoMdBus size={18} /></div>
                        <div className='flex-1'>
                            <p className='text-sm '>Maharani Bagh</p>
                            <p className='text-xs text-gray-500'>Towards Terminal</p>
                        </div>
                        <div className='text-xs text-blue-700'>
                            367 <br />m away
                        </div>
                    </div>
                    <div className='flex items-center justify-between gap-3 border-b border-gray-300 py-1.5'>
                        <div className='w-7 h-7 bg-green-700 rounded-full flex items-center justify-center text-white'> <IoMdBus size={18} /></div>
                        <div className='flex-1'>
                            <p className='text-sm '>Central School</p>
                            <p className='text-xs text-gray-500'>Towards Terminal</p>
                        </div>
                        <div className='text-xs text-blue-700'>
                            783 <br />m away
                        </div>
                    </div>
                    <div className='flex items-center justify-between gap-3 border-b border-gray-300 py-1.5'>
                        <div className='w-7 h-7 bg-green-700 rounded-full flex items-center justify-center text-white'> <IoMdBus size={18} /></div>
                        <div className='flex-1'>
                            <p className='text-sm '>Jal Vihar (T)</p>
                            <p className='text-xs text-gray-500'>Towards Terminal</p>
                        </div>
                        <div className='text-xs text-blue-700'>
                            367 <br />m away
                        </div>
                    </div>
                </div>

                <div className='px-4 mt-3'>
                    <Link to='/nearby' className='bg-[#3056A3] w-full text-sm text-center py-2.5 rounded-lg flex items-center justify-center text-white'>Show all nearby stops</Link>
                </div>
            </div>

            {/*------------- featured card ---------------- */}

            <div className='mt-4'>
                <p className='text-sm py-3 text-gray-500 px-4'>FEATURED FOR YOU</p>

                <img src="/download.jpg" alt="" className='w-' />
                <div className='py-30 px-4'>
                    <h1 className='text-gray-300 text-3xl font-semibold'>Har Safar</h1>
                    <h1 className='text-gray-300 text-3xl font-semibold'>Ka Saathi</h1>
                    <p className='py-5 text-gray-500 text-sm'>Creafted with 💓 in Dilli</p>
                </div>

            </div>

            {showRenew && <RenewModal  setRenew={setRenew}/>}

        </div>
    )
}

export default NewHome