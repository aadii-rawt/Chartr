import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { IoMdBus } from 'react-icons/io';
import { Link } from 'react-router-dom';
import { useUser } from '../context/UserContext';

const DailyPassForm: React.FC = () => {
  const { user } = useUser()
  console.log(user);

  const [name, setName] = useState(user?.username || 'Aditya ');
  const [phone, setPhone] = useState(user?.phone || 9876543214);
  const [age, setAge] = useState(20);
  const [idType, setIdType] = useState('Aadhar Card');
  const [idDigits, setIdDigits] = useState('');

  return (
    <div className="max-w-md  mx-auto min-h-screen bg-gray-200 p-3 pb-4 relative rounded-xl shadow-md space-y-4">
      <Link to="/" className='mt-2' ><FaArrowLeftLong size={20} /></Link>

      <div className='bg-white mt-3 rounded-lg p-3 relative'>
        <h2 className="text-lg font-bold">Pass Details</h2>

        <label className="block text-[15px]">Select Pass Type</label>
        <select className="w-full border border-gray-300 rounded-md p-2 text-sm">
          <option>MONTHLY GENERAL ALL ROUTE AC PASS</option>
        </select>

        <div className="flex flex-wrap gap-2 mt-2">
          <div className="bg-gray-200 text-sm px-3 py-1 rounded-full">AC</div>
          <div className="bg-gray-200 text-sm px-3 py-1 rounded-full">Non-AC</div>
          <div className="bg-gray-200 text-sm px-3 py-1 rounded-full">Electric</div>
          <div className="bg-green-400 text-white text-sm px-3 py-1 rounded-full">All Routes</div>
        </div>

        <div className="flex gap-2 mt-3">
          <span className="w-8 h-8 rounded bg-red-500 flex items-center text-white justify-center"><IoMdBus size={20} /></span>
          <span className="w-8 h-8 rounded bg-cyan-500 flex items-center text-white justify-center"><IoMdBus size={20} /></span>
          <span className="w-8 h-8 rounded bg-orange-400 flex items-center text-white justify-center"><IoMdBus size={20} /></span>
          <span className="w-8 h-8 rounded bg-blue-700 flex items-center text-white justify-center"><IoMdBus size={20} /></span>
        </div>


        <label className="block text-sm mt-4">Valid Till</label>
        <input
          type="text"
          value="23:59, 17/08/2025"
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

        <div className='fixed bottom-10 left-0 right-0 mx-3'>
          <button className="w-full  bg-cyan-500 text-white py-3 rounded-md font-bold">
            Pay ₹1001.0
          </button>

        </div>
      </div>

    </div>
  );
};

export default DailyPassForm;

