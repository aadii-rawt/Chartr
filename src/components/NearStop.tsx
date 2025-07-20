import React from 'react'
import { FaBus } from 'react-icons/fa'
import { MdInfo } from 'react-icons/md'
import { RiDirectionFill } from 'react-icons/ri'

const NearStop = () => {
    return (
        <div className="px-4">
            <div className="flex justify-between items-center mb-4">
                <span className="font-medium">Nearest Stop</span>
                <span className="text-sm">Show all</span>
            </div>

            <div className="rounded-xl p-3 py-1.5 bg-gray-300 border border-gray-300 relative">

                <div className="flex justify-between items-center bg-gray-300 mb-0">
                    <div className="flex items-center gap-2">
                        <FaBus /> <span className=" text-sm px-2 py-1 rounded">Fetching...</span>
                    </div>
                    <div className="font-semibold flzex  items-center gap-2"><RiDirectionFill  className="text-red-600" /></div>
                </div>
            </div>
        </div>
    )
}

export default NearStop