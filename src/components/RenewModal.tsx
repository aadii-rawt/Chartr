import React from 'react'
import { RxCross1 } from 'react-icons/rx'

const RenewModal = ({setRenew}) => {
    return (
        <div className='flex max-w-md min-h-screen mx-auto w-full items-center bg-white/90 justify-center absolute top-0 left-0 z-[9999]'>
            <div className="bg-white rounded-lg overflow-hidden shadow-lg transition-transform transform hover:scale-105 w-full px-5"
            >
                <div className="p-1 bg-red-200"></div>
                <div className="p-5">
                    <div className='flex items-start justify-between'>
                        <h2 className="text-3xl font-bold text-gray-800 mb-4">Plan Expired</h2>
                        {/* <button className='cursor-pointer' onClick={() => setRenew(false)}><RxCross1 /></button> */}
                    </div>
                    <p className="text-gray-600 mb-1">Your plan expired.</p>
                    <p className="text-gray-600 mb-6">Please buy new plan.</p>
                    <p className="text-4xl font-bold text-gray-800 mb-6">₹300</p>
                </div>
                <div className="p-4">
                    <button
                        className="w-full bg-red-400 text-white rounded-full px-4 py-2 cursor-pointer"
                    >
                        Buy pass
                    </button>
                </div>
            </div>

        </div>
    )
}

export default RenewModal