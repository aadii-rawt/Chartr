import React, { useEffect, useRef, useState } from 'react';
import { BiSolidTorch } from 'react-icons/bi';
import { GoArrowLeft } from 'react-icons/go';
import { Link } from 'react-router-dom';

const BusQRScanner: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [busDigits, setBusDigits] = useState(['', '', '', '']);

  useEffect(() => {
  const startCamera = async () => {
    try {
      const constraints: MediaStreamConstraints = {
        video: {
          facingMode: { exact: 'environment' }, // forces back camera
        },
        audio: false,
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
        console.log('Back camera activated');
      }
    } catch (err) {
      console.error('Error accessing back camera:', err);

      // Fallback: try any available camera
      try {
        const fallbackStream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = fallbackStream;
          videoRef.current.play();
        }
      } catch (fallbackErr) {
        console.error('Fallback failed:', fallbackErr);
        alert('Camera access is required and not available.');
      }
    }
  };

  startCamera();

  return () => {
    if (videoRef.current?.srcObject) {
      const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
      tracks.forEach((track) => track.stop());
    }
  };
}, []);


  const handleInput = (index: number, value: string) => {
    if (/^\d?$/.test(value)) {
      const updated = [...busDigits];
      updated[index] = value;
      setBusDigits(updated);

      // Auto-focus to next input
      if (value && index < 3) {
        const nextInput = document.getElementById(`bus-digit-${index + 1}`);
        nextInput?.focus();
      }
    }
  };

  return (
    <div className="relative mx-auto max-w-md h-screen bg-black w-full">
      {/* Camera Feed */}
      <video
        ref={videoRef}
        autoPlay
        playsInline
        muted
        className="absolute top-0 left-0 w-full h-full object-cover"
      />

      {/* Top Overlay */}
      <div className="absolute top-0 left-0 right-0 px-4 py-3 flex justify-between items-center bg-gradient-to-b from-black/60 to-transparent text-white z-10">
        <Link to='/' className="text-xl"><GoArrowLeft /></Link>
        <span className='text-sm'>Scan QR present in the bus.</span>
        <div className=" rounded-full">
         <BiSolidTorch />
        </div>
      </div>

      {/* QR Frame Overlay */}
      {/* <div className="absolute inset-0 flex items-center justify-center z-10">
        <div className="w-64 h-40 border-4 border-white rounded-lg opacity-80"></div>
      </div> */}

      {/* Bottom Modal */}
      <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-6 pb-30 shadow-xl z-20">
        <div className="w-12 h-1.5 bg-gray-300 rounded-full mx-auto mb-4"></div>
        <h3 className="text-lg font-semibold text-center">Enter Bus Number (Last 4 digits)</h3>
        <p className="text-sm text-center text-gray-500 mb-4">Like 1234 for DL 1PC 1234</p>

        <div className="flex justify-center gap-4 mb-6">
          {busDigits.map((digit, index) => (
            <input
              key={index}
              id={`bus-digit-${index}`}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleInput(index, e.target.value)}
              className="w-12 h-12 text-center text-lg border border-gray-300 rounded-lg"
            />
          ))}
        </div>

      </div>
    </div>
  );
};

export default BusQRScanner;
