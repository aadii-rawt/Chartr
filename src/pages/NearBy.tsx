import React from 'react'

const NearBy = () => {
    return (
        <div className='w-full min-h-screen bg-cover' style={{ backgroundImage: 'url(/map.jpg)' }}>

            <div className='p-3 pt-5'>
                <input type="text" placeholder='Enter route' className='bg-white w-full px-5 outline-none border-none py-2 rounded-3xl' />
            </div>
        </div>
    )
}

export default NearBy