import { FaSubway, FaCalendarAlt, FaUserCircle } from 'react-icons/fa';
import FeatureButton from '../components/FeatureButton';
import { IoSearchOutline } from 'react-icons/io5';
import { BsStack } from 'react-icons/bs';
import { PiTicket } from 'react-icons/pi';
import { FaClipboardUser } from 'react-icons/fa6';
import { BiWalletAlt } from 'react-icons/bi';
import { MdAltRoute } from 'react-icons/md';
import TicketCard from '../components/TicketCard';
import MetroCard from '../components/MetroCard';
import PassCard from '../components/PassCard';
import NearStop from '../components/NearStop';
import { Link } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { checkPlan } from "../middleware/middleware";
import { doc, getDoc } from 'firebase/firestore';
import { useUser } from '../context/UserContext';
import { db } from '../../firebase';


const Home = () => {

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
    if (!data) return;
    const res = checkPlan(data?.plan, data)
    if (!res.ok) {
      setIsExpired(res)
    }

  }, [data])

  return (
    <div className="min-h-screen bg-white  pb-20 font-sans max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center mb-4 p-4 border-b border-black/10 ">
        <img src="https://framerusercontent.com/images/yEa4ce8bqOfVAhNkZNCbXV3cgd4.png" alt="" className='w-[30%]' />
        <Link to='/profile'><FaUserCircle size={28} /></Link>
      </div>

      <div className='p-4 '>
        {/* Search Bar */}
        <div className='bg-gray-200 flex items-center justify-start rounded-full px-4 shadow-sm'>
          <IoSearchOutline size={24} />
          <input
            type="text"
            placeholder="Where do you want to go?"
            className="w-full bg-gray-200 rounded-full px-4 py-2.5 text-lg  focus:outline-none"
          />
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-4 gap-3 text-center text-xs mt-8 ">
          <FeatureButton icon={<PiTicket size={24} />} label="Bus Ticket" route='/busQRScanner' />
          <FeatureButton icon={<FaSubway size={24} />} label="Metro Ticket" newBadge route='/metroPassForm' />
          <FeatureButton icon={<FaClipboardUser size={24} />} label="Daily Pass" route='/dailyPassForm' />
          <FeatureButton icon={<FaCalendarAlt size={24} />} label="Monthly Pass" newBadge route="/passform" />
          <FeatureButton icon={<div className='flex items-center justify-center gap-3 font-medium text-white'><BiWalletAlt size={24} /> <span className='text-xl'>₹0.0</span></div>} label="Chartr Wallet" wallet />
          <FeatureButton icon={<MdAltRoute size={24} />} label="Route Info" />
          <FeatureButton icon={<BsStack size={24} />} label="See All" />
        </div>

      </div>



      {/* Banner */}
      <div className="rounded-lg overflow-hidden">
        <img
          src="download.jpg" // Place your image in public/assets
          alt="Metro Promo"
          className="w-full h-full object-fit rounded-lg"
        />
      </div>

      <TicketCard />
      <MetroCard />
      <PassCard />
      {/* {      {data.role !== "basic" || data.role !== "starter" && <PassCard />}
<PassCard />} */}

      <NearStop />

      <img src="./nearby.png" alt="" className='mt-5' />

    </div>
  );
};

export default Home;
