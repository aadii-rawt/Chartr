import React, { useState } from 'react';
import { GoArrowLeft } from 'react-icons/go';
import { Link } from 'react-router-dom';

const MetroTicketForm: React.FC = () => {
  const [startStation, setStartStation] = useState('');
  const [endStation, setEndStation] = useState('');
  const [tickets, setTickets] = useState(1);
  const [fare, setFare] = useState(0);

  const handlePay = () => {
    alert(`Paying for ${tickets} ticket(s) from ${startStation} to ${endStation}`);
  };

  return (
    <div className="min-h-screen mx-auto max-w-md bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-[#0862b7] text-white px-4 py-4 ">
        <Link to="/" className="text-2xl">
          <GoArrowLeft />
        </Link>

        <div className='flex items-center justify-center'>

          <img src="/delhimetro.png" alt="" className='w-46' />
        </div>
      </div>

      {/* Form Card */}
      <div className="bg-white rounded-xl shadow-md p-4 mx-4 mt-[-40px] z-10 relative">
        {/* From Station */}
        <div className="mb-4">
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
            <span className="w-3 h-3 bg-black rounded-full"></span>
            <input
              className="w-full border-none outline-none"
              placeholder="Starting stop"
              value={startStation}
              onChange={(e) => setEndStation(e.target.value)}
            />
          </div>
        </div>

        {/* To Station */}
        <div className="mb-4">
          <div className="flex items-center gap-2 border border-gray-300 rounded-md px-3 py-2">
            <svg
              className="w-5 h-5 text-gray-500"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path d="M10 2a6 6 0 00-6 6c0 4 6 10 6 10s6-6 6-10a6 6 0 00-6-6zM8 8a2 2 0 114 0 2 2 0 01-4 0z" />
            </svg>
            <input
              className="w-full border-none outline-none"
              placeholder="Ending stop"
              value={endStation}
              onChange={(e) => setEndStation(e.target.value)}
            />
          </div>
        </div>

        {/* Ticket Count */}
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Number of tickets</label>
          <select
            value={tickets}
            onChange={(e) => setTickets(parseInt(e.target.value))}
            className="w-full mt-1 border border-gray-300 rounded-md p-2"
          >
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Final Fare */}
      <div className="bg-white mx-4 mt-4 p-4 rounded-md text-lg font-semibold shadow">
        Final Fare
      </div>

      {/* Floating Mic Button */}
      <div className="fixed bottom-24 right-4 z-20">
        <button className="bg-green-500 p-3 rounded-full shadow-md">
          <svg
            className="w-5 h-5 text-white"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 2a2 2 0 00-2 2v6a2 2 0 104 0V4a2 2 0 00-2-2zm5 8a5 5 0 01-10 0H4a6 6 0 0012 0h-1z" />
          </svg>
        </button>
      </div>

      {/* Pay Button */}
      <div className="fixed bottom-0 left-0 right-0 mx-4 mb-4 rounded-xl overflow-hidden">
        <button
          className="w-full bg-cyan-500 text-white text-lg py-3 font-bold"
          onClick={handlePay}
        >
          Pay
        </button>
      </div>
    </div>
  );
};

export default MetroTicketForm;
