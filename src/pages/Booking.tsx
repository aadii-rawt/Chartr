import React, { useEffect } from 'react'
import { GoArrowLeft } from 'react-icons/go'
import { Link } from 'react-router-dom'
import PassCard from '../components/PassCard'
import TicketCard from '../components/TicketCard'
import MetroCard from '../components/MetroCard'
import { useUser } from '../context/UserContext'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase';
import { checkPlan } from "../middleware/middleware";
const Booking = () => {
      const { user, data, setData, isExpired, setIsExpired } = useUser()
    
      useEffect(() => {
        const fetchData = async () => {
          if (!user?.uid) return;
    
          try {
            const docRef = doc(db, 'users', user.uid);
            const snap = await getDoc(docRef);
    
            if (snap.exists()) {
              setData({ id: snap.id, ...snap.data() });
            }
          } catch (e) {
            console.error("Error fetching user data:", e);
          }
        };
    
        fetchData();
      }, [user]);
    
      useEffect(() => {
        console.log(data);
        
        if (!data) return;
        const res = checkPlan(data?.plan, data)
        if (!res.ok) {
          setIsExpired(res)
        }
    
      }, [data])
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