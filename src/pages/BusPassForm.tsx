import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { IoMdBus } from 'react-icons/io';
import { Link } from 'react-router-dom';

const BusPassForm: React.FC = () => {
  const [name, setName] = useState('Aditya Rawat');
  const [phone, setPhone] = useState('9599518124');
  const [dob, setDob] = useState('2025-07-18');
  const [idType, setIdType] = useState('Aadhar Card');
  const [idDigits, setIdDigits] = useState('');

  return (
    <div className="max-w-md mx-auto bg-gray-200 p-3 pb-4 rounded-xl shadow-md space-y-4">
      <Link to="/" className='mt-2' ><FaArrowLeftLong size={20} /></Link>

      <div className='bg-white mt-3 rounded-lg p-3'>
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
          value="₹1000"
          readOnly
          className="w-full border text-sm border-gray-300 rounded-md p-2 bg-gray-100"
        />

      </div>

      <div className='bg-white mt-5 rounded-lg p-3'>

        <h2 className="text-xl font-bold">Personal Details</h2>

        <div className="flex items-center gap-4 mt-2">
          <div className="w-20 h-20 bg-black text-yellow-400 rounded-full flex items-center justify-center">
            <FaUserCircle size={100} />
          </div>

          <button className="bg-cyan-500 w-fit text-white px-4 py-2 rounded-md">Capture</button>
        </div>

        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder=' Enter full Name'
          className="w-full border border-gray-300 rounded-md text-sm p-2 mt-2"
        />
        <input
          type="text"
          value={phone}
          placeholder='Enter phone number'
          onChange={(e) => setPhone(e.target.value)}
          className="w-full border border-gray-300 rounded-md text-sm p-2 mt-2"
        />
        <input
          type="date"
          value={dob}
          onChange={(e) => setDob(e.target.value)}
          className="w-full border border-gray-300 rounded-md text-sm p-2 mt-2"
        />

        <div className="flex gap-2 mt-2">
          <select
            value={idType}
            onChange={(e) => setIdType(e.target.value)}
            className="flex-1 border border-gray-300 rounded-md text-sm p-2"
          >
            <option>Aadhar Card</option>
            <option>Pan Card</option>
          </select>
          <input
            type="text"
            placeholder="Last 4 digit"
            value={idDigits}
            onChange={(e) => setIdDigits(e.target.value)}
            className="w-1/2 border border-gray-300 rounded-md text-sm p-2"
          />
        </div>
      </div>

      <div className=''>
        <button className="w-full  bg-cyan-500 text-white py-3 rounded-md font-bold">
          Pay ₹1001.0
        </button>

      </div>
    </div>
  );
};

export default BusPassForm;

