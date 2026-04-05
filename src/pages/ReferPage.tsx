import React from "react";
import { useUser } from "../context/UserContext";


const APP_URL = "https://chartr-apk.netlify.app/signup&refer";

const ReferPage: React.FC = () => {
    const {user} = useUser()
    const REFER_CODE = user?.phone;
  const referralLink = `${APP_URL}?ref=${REFER_CODE}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(referralLink);
    alert("Referral link copied!");
  };

  const handleWhatsAppShare = () => {
    const message = `🚍 Join Chartr & get Monthly Bus Pass for just ₹150!\nUse my referral link:\n${referralLink}`;
    window.open(`https://wa.me/?text=${encodeURIComponent(message)}`, "_blank");
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Chartr Referral",
          text: "Get Monthly Bus Pass for ₹150!",
          url: referralLink,
        });
      } catch (err) {
        console.log(err);
      }
    } else {
      handleCopy();
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex justify-center">
      <div className="w-full max-w-md mx-auto p-4">

        {/* Header */}
        <div className="text-center mt-6">
          <h1 className="text-2xl font-bold text-gray-800">
            Refer & Earn 🎉
          </h1>
        
        </div>

        {/* Card */}
        <div className="bg-white rounded-2xl shadow-md p-5 mt-6">

          {/* Referral Code */}
          <div className="text-center">
            <p className="text-gray-600 text-sm">Your Referral Code</p>
            <div className="mt-2 text-xl font-bold tracking-widest text-blue-600">
              {REFER_CODE}
            </div>
          </div>

          {/* Referral Link */}
          <div className="mt-4 bg-gray-100 p-3 rounded-lg text-xs break-all text-gray-700">
            {referralLink}
          </div>

          {/* Buttons */}
          <div className="flex gap-2 mt-4">
            <button
              onClick={handleCopy}
              className="flex-1 bg-gray-200 py-2 rounded-lg text-sm font-medium"
            >
              Copy
            </button>

            <button
              onClick={handleWhatsAppShare}
              className="flex-1 bg-green-500 text-white py-2 rounded-lg text-sm font-medium"
            >
              WhatsApp
            </button>
          </div>

          <button
            onClick={handleNativeShare}
            className="w-full mt-3 bg-blue-600 text-white py-2 rounded-lg text-sm font-semibold"
          >
            Share Referral
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-6 text-sm text-gray-600 space-y-2">
          <p>✅ Friend signs up using your code</p>
          <p>✅ They get special offer</p>
          <p>🎁 You get Monthly Pass for ₹150</p>
        </div>

     
      </div>
    </div>
  );
};

export default ReferPage;