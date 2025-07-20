import React from 'react'

const MetroCard = () => {
    return (
        <div className="px-4">
            <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Metro Ticket</span>
                <span className="text-sm">View all tickets</span>
            </div>

            <div className="rounded-xl p-3 py-1.5 bg-white relative border border-gray-300 relative">
                <p className='text-center'>Your metro ticket will be available here.</p>
            </div>
        </div>
    )
}

export default MetroCard