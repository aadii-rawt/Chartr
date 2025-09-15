import React, { useMemo, useState } from 'react';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { IoMdBus } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { db } from '../../firebase';
import { doc, getDoc, increment, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
import validateRolePurchase from "../middleware/middleware";

const DailyPassForm: React.FC = () => {
  const { user, data } = useUser()

  const [name, setName] = useState(user?.username || 'adi ');
  const [phone, setPhone] = useState(user?.phone || 9638527410);
  const [age, setAge] = useState(20);
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)

  const validUntilDate = useMemo(() => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate());

    // Format as DD/MM/YYYY
    const day = String(futureDate.getDate()).padStart(2, '0');
    const month = String(futureDate.getMonth() + 1).padStart(2, '0');
    const year = futureDate.getFullYear();

    return `23:59, ${day}/${month}/${year}`;
  }, []);

  const validUntilISO = useMemo(() => {
    const today = new Date();
    const futureDate = new Date(today);
    futureDate.setDate(today.getDate());
    futureDate.setHours(23, 59, 0, 0);

    return futureDate.toISOString();
  }, []);

  const handleSubmit = async () => {
    if (!age || !name || !phone) {
      alert("Please fill in all fields.");
      return;
    }

    if (user?.username == "demo") return alert("Demo user can not book pass")

    const passData = {
      name,
      age,
      phone,
      createdAt: Timestamp.now(),
      validTill: validUntilISO,
    };

    try {
      setLoading(true)
      const userRef = doc(db, `/dailyPass/${user.uid}`);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, { pass: [passData] });
      } else {
        const existingData = docSnap.data();
        existingData.pass.push(passData);
        await setDoc(userRef, existingData);
      }


      if (data?.plan == "basic") {
        basicPlan()
      }
      navigate("/dailyPass");
    } catch (error) {
      console.log("Error", "Could not store pass: " + error.message);
    } finally {
      setLoading(false)
    }
  };


  const basicPlan = async () => {
    const userRef = doc(db, 'users', user.uid);
    await updateDoc(userRef, { dailyPurchased: increment(1) });

  }

  return (
    <div className="max-w-md  mx-auto min-h-screen bg-gray-200 p-3 pb-4 relative rounded-xl shadow-md space-y-4">
      <Link to="/" className='mt-2' ><FaArrowLeftLong size={20} /></Link>

      <div className='rounded-t-lg overflow-hidden'>
        <div className='bg-white rounded-t-lg mt-3 p-3 relative'>
          <h2 className="text-lg font-bold">Pass Details</h2>

          <label className="block text-[15px]">Choose Bus color</label>
          <div className='flex gap-2'>
            <button className='flex w-full gap-1 items-center opacity-50 bg-green-500 font-semibold p-1 rounded  text-white'>
              <IoMdBus />
              Green Bus
            </button>
            <button className='flex w-full gap-1 items-center bg-red-500 font-semibold p-1 rounded  text-white'>
              <IoMdBus />
              Red Bus
            </button>
            <button className='flex w-full gap-1 items-center opacity-50 bg-cyan-500 font-semibold p-1 rounded  text-white'>
              <IoMdBus />
              Electric Bus
            </button>
          </div>
          <p className='text-[15px] mt-2'>Pass valid in</p>
          <div className="flex flex-wrap gap-2 mt-2">
            <div className="bg-gray-200 text-sm px-3 py-1 rounded">AC</div>
            <div className="bg-gray-200 text-sm px-3 py-1 rounded">Non-AC</div>
            <div className="bg-gray-200 text-sm px-3 py-1 rounded">Electric</div>
            <span className="w-8 h-8 rounded bg-green-500 flex items-center text-white justify-center"><IoMdBus size={20} /></span>
            <span className="w-8 h-8 rounded bg-red-500 flex items-center text-white justify-center"><IoMdBus size={20} /></span>
            <span className="w-8 h-8 rounded bg-cyan-500 flex items-center text-white justify-center"><IoMdBus size={20} /></span>
          </div>


          <label className="block text-sm mt-4">Valid Till</label>
          <input
            type="text"
            value={validUntilDate}
            readOnly
            className="w-full border text-sm border-gray-300 rounded-md p-2 bg-gray-100"
          />

          <label className="block text-sm mt-2">Pass Fare</label>
          <input
            type="text"
            value="₹50.0"
            readOnly
            className="w-full border font-medium border-gray-300 rounded-md p-2 bg-gray-100"
          />
        </div>
        <div className='p-1 bg-yellow-400 rounded-b-lg'>
          <p className='text-center text-sm'> This pass is valid in DTC buses only.</p>
        </div>
      </div>

      <div className='bg-white mt-5 rounded-lg p-3 relative'>

        <h2 className="text-xl font-bold">Personal Details</h2>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder=' Enter full Name'
          className="w-full border border-gray-300 rounded-md text-sm p-2 mt-2"
        />
        <input
          type="number"
          value={phone}
          placeholder='Enter phone number'
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-md text-sm p-2 mt-2"
        />
        <input
          type="number"
          value={age}
          onChange={(e) => setAge(e.target.value)}
          className="w-full border border-gray-300 rounded-md text-sm p-2 mt-2"
        />
      </div>

      <div className=''>
        <button onClick={handleSubmit} disabled={loading} className="w-full  bg-cyan-500 text-white py-3 rounded-md font-bold">
          {loading ? "Loading..." : "Pay ₹50.0 "}
        </button>
      </div>

    </div>
  );
};

export default DailyPassForm;

