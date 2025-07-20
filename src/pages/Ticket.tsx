import { useEffect, useState, useContext } from 'react';
import { SiMaterialdesignicons } from 'react-icons/si';
import { useNavigate } from 'react-router-dom';

const Ticket: React.FC = () => {
  //   const { user } = useContext(UserContext);
  const [passData, setPassData] = useState<any>(null);
  const [showQR, setShowQR] = useState(false);
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-orange-500 flex items-center justify-center relative">
      {!showQR ? (
        <div className="bg-white text-black p-5 rounded-lg w-[90%] max-w-md">
          <h1 className="text-xl font-medium text-center">Transport Dept. of Delhi</h1>

          <div className="flex justify-between py-4 border-b">
            <p className="text-lg">DL1PC6905</p>
            <p className="text-lg">₹4.62</p>
          </div>

          <div className="flex justify-between pt-2">
            <p className="text-sm">Bus Route</p>
            <p className="text-sm">Fare</p>
          </div>

          <div className="flex justify-between">
            <p className="">534</p>
            <p className=" font-medium">₹5.0</p>
          </div>

          <div className='flex items-center justify-between'>

            <div className="pt-2">
              <p className="text-sm">Booking Time</p>
              <p className="text-base">11 Jul, 15 | 07:35 AM</p>
            </div>
            <div className="pt-2">
              <p className="text-sm">Tickets </p>
              <p className="text-base text-right">1</p>
            </div>
          </div>

          <div className="pt-2">
            <p className="text-sm">Starting stop</p>0
            <p className="text-base">Nehru Place</p>
          </div>

          <div className="pt-2">
            <p className="text-sm">Ending stop</p>
            <p className="text-base">Sheikh Sarai Phase 2</p>
          </div>

          <p className="text-center text-gray-400 text-sm py-2">DL11072025ruhfrdae</p>

          <button
            onClick={() => setShowQR(true)}
            className="bg-green-100 border-2 border-green-800 text-green-800 font-medium flex items-center justify-center gap-2 px-3 py-2 rounded-lg w-full"
          >
            {/* <SiMaterialdesignicons name="qr-code-2" size={28} color="white" /> */}
            <span className="text-sm">Show QR Code</span>
          </button>


          <div className="flex justify-center">
            <img
              src="./ondc-logo.png"
              alt="DTC Logo"
              className="w-32 mt-5"
            />
          </div>
        </div>
      ) : (
        <div className="bg-[#1B1B1B] rounded-lg w-[90%] max-w-md">
          <button onClick={() => setShowQR(false)} className="w-full">
            <img
              src="/assets/images/qrcode.png"
              alt="QR Code"
              className="w-full max-w-[350px] h-auto mx-auto"
            />
          </button>
        </div>
      )}

      <div className="absolute top-4 w-[95%] flex justify-between text-white text-sm px-2">
        <button onClick={() => navigate('/')}>
          {/* <MaterialIcons name="cancel" size={22} color="white" /> */}
        </button>
        <button className="flex items-center gap-1">
          {/* <MaterialIcons name="access-time" size={22} color="white" /> */}
          <span>All Passes</span>
        </button>
      </div>
    </div>
  );
};

export default Ticket;
