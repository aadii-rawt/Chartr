import React, { useState, useEffect } from 'react';
import { BsQrCode } from 'react-icons/bs';
import { GoArrowLeft } from 'react-icons/go';
import { IoMdBus } from 'react-icons/io';
import { MdOutlineContentCopy } from 'react-icons/md';
import { Link } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import { useUser } from '../context/UserContext';

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
  const { user } = useUser();
  const [showQRModal, setShowQRModal] = useState(false);

  const [latestPass, setLatestPass] = useState<any>(null);

  // Fallback hardcoded dates
  const fallbackFromDate = new Date();
  fallbackFromDate.setDate(fallbackFromDate.getDate() - 7);
  fallbackFromDate.setHours(7, 30, 0, 0);

  const fallbackTillDate = new Date(fallbackFromDate);
  fallbackTillDate.setDate(fallbackFromDate.getDate() + 30);
  fallbackTillDate.setHours(23, 59, 0, 0);

  useEffect(() => {
    if (!user?.uid) return;

    const fetchLatest = async () => {
      const ref = doc(db, 'passes', user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const data = snap.data();
      const passes: any[] = data.passes || [];
      if (passes.length === 0) return;

      const sorted = passes
        .filter((p) => p.createdAt?.seconds)
        .sort((a, b) => b.createdAt.seconds - a.createdAt.seconds);

      setLatestPass(sorted[0]);
    };

    fetchLatest();
  }, [user]);

  // Handle Valid From and Valid Till based on createdAt
  let validFrom = fallbackFromDate;
  let validTill = fallbackTillDate;

  if (latestPass?.createdAt?.seconds) {
    validFrom = new Date(latestPass.createdAt.seconds * 1000);

    validTill = new Date(validFrom);
    validTill.setDate(validFrom.getDate() + 30);
    validTill.setHours(23, 59, 0, 0);
  }

  // UI values
  const passengerImage = latestPass?.userImage || 'https://via.placeholder.com/80x100.png?text=Photo';
  const passengerName = latestPass?.name || 'Aditya';
  const verificationDoc = latestPass
    ? `${latestPass.idType} - ${latestPass.last4Digits}`
    : 'Aadhar Card - 5328';
  const passId = latestPass?.passId || 'MP03042025859c482c14';
  const fare = latestPass?.fare ?? 1000;

  return (
    <div className="bg-cyan-500 min-h-screen max-h-screen p-4 text-black max-w-md mx-auto">
      {/* Header */}
      <div className="flex justify-between items-center text-white mb-4">
        <Link to="/" className="text-2xl">
          <GoArrowLeft />
        </Link>
        <div className="flex items-center gap-4 text-sm">
          <span className="text-yellow-300">⚠️ Issue with pass?</span>
          <a href="#" className="underline">
            All passes
          </a>
        </div>
      </div>

      {/* Card 1: Passenger Info */}
      <div className="bg-white rounded-xl p-4 mb-4 mt-10 shadow">
        <div className="flex gap-4">
          <img
            src={passengerImage}
            alt="Passenger"
            className="w-22 h-24 rounded-md object-cover"
          />
          <div>
            <p className="text-sm text-gray-500">Passenger Name</p>
            <p className="font-semibold">{passengerName}</p>

            <p className="text-sm text-gray-500 mt-2">Verification Document</p>
            <p className="font-semibold">{verificationDoc}</p>

            <p className="text-sm text-gray-500 mt-2">Pass ID</p>
            <div className="flex items-center gap-1">
              <span className="text-xs truncate">{passId}</span>
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
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">AC</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Non-AC</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Electric</span>
          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded">All Routes</span>
        </div>

        <div className="flex gap-2 mt-3">
          {['green', 'red', 'cyan', 'orange', 'blue'].map((color) => (
            <div
              key={color}
              className={`w-6 h-6 bg-${color}-500 rounded-md flex items-center justify-center text-white`}
            >
              <IoMdBus />
            </div>
          ))}
        </div>

        {/* Validity Info */}
        <div className="mt-4">
          <p className="text-sm text-gray-600">Valid From</p>
          <p className="font-medium">{formatDate(validFrom, '07:30 AM')}</p>

          <p className="text-sm text-gray-600 mt-2">Valid Till</p>
          <p className="font-medium">{formatDate(validTill, '11:59 PM')}</p>
        </div>

        {/* Fare */}
        <p className="mt-4">Pass Fare</p>
        <p className="text-black font-semibold">₹{fare}</p>

        {/* ONDC Logo */}
        <div className="mt-4 flex items-center justify-center">
          <img src="./ondc-logo.png" alt="ONDC Logo" className="h-5" />
        </div>
      </div>

      {/* Show QR Code Button */}
      <div className="bg-white rounded-xl shadow text-center mt-auto">
        <button  onClick={() => setShowQRModal(true)} className="w-full text-[#1250aa] py-4 font-semibold rounded-md flex items-center justify-center gap-2">
          <BsQrCode size={30} />
          Show QR code
        </button>
      </div>

      {showQRModal && (
        <div
          className="fixed inset-0 bg-black/40 bg-opacity-90 flex items-center justify-center z-50"
          onClick={() => setShowQRModal(false)}
        >
          <div onClick={(e) => e.stopPropagation()} className=' p-5 rounded-xl flex items-center justify-center w-full'>
            <img
              src='pass-qr.jpg'
              alt="QR Code"
              className="rounded-xl w-2/3 bg-white p-3"
            />
          </div>
        </div>
      )}

    </div>
  );
};

export default MonthlyPass;
