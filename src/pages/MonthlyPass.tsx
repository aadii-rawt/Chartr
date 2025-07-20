import React from 'react';
import { BsQrCode } from 'react-icons/bs';
import { GoArrowLeft } from 'react-icons/go';
import { IoMdBus } from 'react-icons/io';
import { MdOutlineContentCopy } from 'react-icons/md';
import { Link } from 'react-router-dom';

const formatDate = (date: Date, time: string) => {
  const options: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: '2-digit',
  };
  const formattedDate = date.toLocaleDateString('en-US', options).replace(',', '');
  return `${formattedDate} | ${time}`;
};

const MonthlyPass: React.FC = () => {

  const today = new Date();
  const validFromDate = new Date(today);
  validFromDate.setDate(today.getDate() - 7);
  validFromDate.setHours(7, 30, 0, 0);

  // Calculate Valid Till Date: 30 days after validFromDate at 11:59 PM
  const validTillDate = new Date(validFromDate);
  validTillDate.setDate(validFromDate.getDate() + 30);
  validTillDate.setHours(23, 59, 0, 0);
  return (
    <div className="bg-[#1250aa] min-h-screen p-4 text-black">
      {/* Header */}
      <div className="flex justify-between items-center text-white mb-4">
        <Link to='/' className="text-2xl"><GoArrowLeft /></Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-yellow-300">⚠️ Issue with pass?</span>
          <a href="#" className="underline">All passes</a>
        </div>
      </div>

      {/* Card 1: Passenger Info */}
      <div className="bg-white rounded-xl p-4 mb-4 mt-10 shadow">
        <div className="flex gap-4">
          <img
            src="https://via.placeholder.com/80x100.png?text=Photo"
            alt="Passenger"
            className="w-20 h-24 rounded-md object-cover"
          />
          <div>
            <p className="text-sm text-gray-500">Passenger Name</p>
            <p className="font-semibold">Aditya Rawat</p>

            <p className="text-sm text-gray-500 mt-2">Verification Document</p>
            <p className="font-semibold">Aadhar Card - 5328</p>

            <p className="text-sm text-gray-500 mt-2">Pass ID</p>
            <div className="flex items-center gap-1">
              <span className="text-xs truncate">MP03042025859c482c14</span>
              <button title="Copy">
                <MdOutlineContentCopy />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Card 2: Pass Info */}
      <div className="bg-white rounded-xl p-4 mb-4 shadow">
        <p className="text-sm text-gray-600">Pass Type</p>
        <p className="font-semibold">MONTHLY GENERAL ALL ROUTE AC PASS</p>

        <p className="text-sm text-gray-600 mt-3">Pass valid in</p>
        <div className="flex flex-wrap text-sm gap-2 mt-1">
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">AC</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Non-AC</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Electric</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">All Routes</span>
        </div>

        {/* Bus icons */}
        <div className="flex gap-2 mt-3">
          <div className="w-6 h-6 bg-green-500 rounded-md flex items-center justify-center text-white " ><IoMdBus /> </div>
          <div className="w-6 h-6 bg-red-500 rounded-md flex items-center justify-center text-white " ><IoMdBus /> </div>
          <div className="w-6 h-6 bg-cyan-500 rounded-md flex items-center justify-center text-white " ><IoMdBus /> </div>
          <div className="w-6 h-6 bg-orange-400 rounded-md flex items-center justify-center text-white " ><IoMdBus /> </div>
          <div className="w-6 h-6 bg-blue-700 rounded-md flex items-center justify-center text-white " ><IoMdBus /> </div>
        </div>

        {/* Validity Info */}
        <div className="mt-4">
          <p className="text-sm text-gray-600">Valid From</p>
          <p className="font-medium">{formatDate(validFromDate, '07:30 AM')}</p>

          <p className="text-sm text-gray-600 mt-2">Valid Till</p>
          <p className="font-medium">{formatDate(validTillDate, '11:59 PM')}</p>
        </div>

        {/* Fare */}
        <p className="mt-4">Pass Fare</p>
        <p className="text-black font-semibold">₹1000</p>

        {/* ONDC Logo */}
        <div className="mt-4 flex items-center justify-center">
          <img
            src="./ondc-logo.png"
            alt="ONDC Logo"
            className="h-5"
          />
        </div>
      </div>

      {/* Show QR Code Button */}
      <div className="bg-white rounded-xl shadow p-0 text-center mt-auto">
        <button className="w-full text-[#1250aa] py-4 font-semibold rounded-md flex items-center justify-center gap-2">
          <BsQrCode size={30} />
          Show QR code
        </button>
      </div>
    </div>
  );
};

export default MonthlyPass;
