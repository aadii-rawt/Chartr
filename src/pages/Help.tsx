import React from 'react'
import { GoArrowLeft } from 'react-icons/go'
import { Link } from 'react-router-dom'

const Help = () => {
  return (
    <div >
      <header className=' border-b p-4 py-3 border-gray-200 shadow flex gap-3 items-center text-sm'>
      <Link to='/' > <GoArrowLeft size={20} /> </Link><span>Support </span>
      </header>

      <div className='p-4'>
        <h1 className='font-medium'>Personal Details</h1>

        <input type="text" className=' border text-[15px] border-gray-300 mt-2 outline-none px-2 py-1.5 rounded-md w-full' placeholder='Enter your name' />
        <input type="text" className=' border text-[15px] border-gray-300 mt-2 outline-none px-2 py-1.5 rounded-md w-full' placeholder='Enter phone number' />
        <input type="text" className=' border text-[15px] border-gray-300 mt-2 outline-none px-2 py-1.5 rounded-md w-full' placeholder='Enter your email' />
      </div>
      <div className='p-3 py-2'>
        <h1 className='font-medium'>Issue Details</h1>

        <textarea rows={5} className=' border text-[15px] outline-none resize-none border-gray-300 mt-2 px-2 py-1.5 rounded-md w-full' placeholder='Please enter the descriptoin details here in 500 character and attact a file/photo for faster resolution.' />
      </div>
      <div className='p-3 py-1'>
        <h1 className=' text-[15px]'>Attach file (optional)</h1>
        <p className='text-sm text-gray-500'> (image/pdf/doc file allowed) max 5 MB</p>

        <div className='w-full  h-20 border-2 mt-3 flex items-center justify-center border-dashed border-gray-500 rounded  text-gray-500 text-sm'>Add a file</div>
      </div>
    </div>
  )
}

export default Help