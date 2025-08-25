import React from 'react'
import { HiOutlineCurrencyRupee } from 'react-icons/hi'
import { Link } from 'react-router-dom'

const PassCard = () => {
    return (

        <div className='p-4'>

            <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Bus Pass</span>
                <span className="text-sm">View all passes</span>
            </div>
            <Link to='/dailyPass'>
                <div className="rounded-xl mb-3  overflow-hidden bg-green-100 border border-gray-300 relative">
                    <div className='bg-white p-3 py-1.5 rounded-b-xl'>
                        <div className='flex gap-3 text-sm'>
                            <div className='flex items-center  gap-2 bg-green-200 px-2 py-1 rounded text-green-800'><HiOutlineCurrencyRupee size={20} /> Success</div>
                            <div className='flex items-center  gap-2 bg-green-primary px-2 py-1 rounded text-white'>Success</div>
                        </div>
                        <div className='text-center text-[15px]  py-1 bg-[#E9F0FF] rounded-md border border-gray-300 mt-2 mb-4'>
                            <p>Daily ALL ROUTE AC PASS</p>
                        </div>
                    </div>
                    <div className='text-center text-sm p-2 text-gray-500 '>
                        <p>Click on pass to view</p>
                    </div>
                </div>
            </Link>
            <Link to='/monthlyPass'>
                <div className="rounded-xl  overflow-hidden bg-green-100 border border-gray-300 relative">
                    <div className='bg-white p-3 py-1.5 rounded-b-xl'>
                        <div className='flex gap-3 text-sm'>
                            <div className='flex items-center  gap-2 bg-green-200 px-2 py-1 rounded text-green-800'><HiOutlineCurrencyRupee size={20} /> Success</div>
                            <div className='flex items-center  gap-2 bg-green-primary px-2 py-1 rounded text-white'>Success</div>
                        </div>
                        <div className='text-center text-[15px]  py-1 bg-[#E9F0FF] rounded-md border border-gray-300 mt-2 mb-4'>
                            <p>MONTHLY GENERAL ALL ROUTE AC PASS</p>
                        </div>
                    </div>
                    <div className='text-center text-sm p-2 text-gray-500 '>
                        <p>Click on pass to view</p>
                    </div>
                </div>
            </Link>
        </div>
    )
}

export default PassCard