import React, { useState } from 'react';
import { FaUserCircle } from 'react-icons/fa';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { IoMdBus } from 'react-icons/io';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../context/UserContext';
import { db } from '../../firebase';
import { uploadToCloudinary } from "../../cloudinary";
import { addDoc, arrayUnion, collection, doc, getDoc, serverTimestamp, setDoc, Timestamp, updateDoc } from 'firebase/firestore';
const BusPassForm: React.FC = () => {
  const [name, setName] = useState('Aditya Rawat');
  const [phone, setPhone] = useState('9342397329');
  const [dob, setDob] = useState('2025-07-18');
  const [idType, setIdType] = useState('Aadhar Card');
  const [idDigits, setIdDigits] = useState('');
  const [image, setImage] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { user } = useUser()
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handlePay = async () => {
    if (!user?.uid) return alert('User not logged in');

    let imageUrl = '';
    if (image) {
      try {
        imageUrl = await uploadToCloudinary(image);
      } catch (err) {
        console.error('Cloudinary upload error:', err);
        return alert('Image upload failed.');
      }
    }

    const passData = {
      userImage: imageUrl,
      name,
      phone,
      dob,
      idType,
      last4Digits: idDigits,
      fare: 1000,
      validUntil: '2025-08-17T23:59:00',
      createdAt: Timestamp.now(),
    };

    try {
      setLoading(true)
      const userPassDocRef = doc(db, 'passes', user.uid);
      const docSnap = await getDoc(userPassDocRef);

      if (docSnap.exists()) {
        await updateDoc(userPassDocRef, {
          passes: arrayUnion(passData),
        });
      } else {
        await setDoc(userPassDocRef, {
          passes: [passData],
        });
      }
      navigate("/monthlyPass")
      setLoading(false)
    } catch (error) {
      console.error('Error saving pass:', error);
      alert('Failed to save pass.');
      setLoading(false)
    } finally {
      setLoading(false)
    }
  };

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
          {previewUrl ? <div>
            <img src={previewUrl} alt="preview" className='w-24 h-24 rounded' />
          </div> :
            <div className="w-20 h-20 bg-black text-yellow-400 rounded-full flex items-center justify-center">
              <FaUserCircle size={100} />
            </div>}
          <input
            type="file"
            accept="image/*"
            capture="environment"
            id="cameraInput"
            style={{ display: 'none' }}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) {
                setImage(file);
                setPreviewUrl(URL.createObjectURL(file));
              }
            }}
          />
          <button
            className="bg-cyan-500 w-fit text-white px-4 py-2 rounded-md"
            onClick={() => document.getElementById('cameraInput')?.click()}
          >
            Capture
          </button>

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
        <button disabled={loading} onClick={handlePay} className="w-full  bg-cyan-500 text-white py-3 rounded-md font-bold">
         {loading ? "Loading..." : " Pay ₹1001.0" }
        </button>

      </div>
    </div>
  );
};

export default BusPassForm;

