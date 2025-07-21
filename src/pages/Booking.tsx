import React from 'react'
import { GoArrowLeft } from 'react-icons/go'
import { Link } from 'react-router-dom'
import PassCard from '../components/PassCard'
import TicketCard from '../components/TicketCard'
import MetroCard from '../components/MetroCard'

const Booking = () => {
    return (
        <div>
            <header className='flex p-4 py-3 gap-3 border-b border-gray-300 shadow'>
                <Link to='/'><GoArrowLeft size={20} /> </Link>
                <span className=''>Bookings</span>
            </header>
            <div>
                <PassCard />
                <TicketCard />
                <MetroCard />

            </div>
        </div>
    )
}

export default Booking