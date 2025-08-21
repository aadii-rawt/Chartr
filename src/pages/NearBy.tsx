import React from 'react'

const NearBy = () => {
    return (
        <div className='w-full min-h-screen bg-cover relative'>
            <img src="/map.jpg" alt="" />
            <div className='p-3 pt-5 absolute top-0 left-0 z-50 w-full'>
                <input type="text" placeholder='Enter route' className='bg-white w-full px-5 outline-none border-none py-2 rounded-3xl' />
            </div>
        </div>
    )
}

export default NearBy