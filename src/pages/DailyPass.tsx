import { useState, useEffect, useContext } from 'react';
import { useUser } from '../context/UserContext';
import { RxCross2 } from 'react-icons/rx';
import { CgLock } from 'react-icons/cg';
import { BsQrCode } from 'react-icons/bs';
import { Link } from 'react-router-dom';
import { doc, getDoc, Timestamp } from 'firebase/firestore';
import { db } from '../../firebase';

const formatDate = (date: Date, time: string) => {
    const options: Intl.DateTimeFormatOptions = {
        day: '2-digit',
        month: 'short',
        year: '2-digit',
    };
    const formattedDate = date.toLocaleDateString('en-US', options).replace(',', ',');
    return `${formattedDate} | ${time}`;
};

const DailyPass = () => {

    const { user } = useUser()
    const [passData, setPassData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [showQR, setShowQR] = useState(false);

    useEffect(() => {
        const fetchPassData = async (user) => {

            if (!user) return;
            try {
                const userRef = doc(db, `/dailyPass/${user.uid}`);
                const docSnap = await getDoc(userRef);
                if (docSnap.exists()) {

                    const data = docSnap.data();
                    if (data.pass.length > 0) {
                        console.log("data :", data.pass);
                        setPassData(data.pass[data.pass.length - 1]); // Get latest pass
                    }
                } else {
                    console.log("No pass found!");
                }
            } catch (error) {
                console.error("Error fetching pass:", error);
            }
            setLoading(false);
        };
        fetchPassData(user);

    }, [user]);



    // Fallback hardcoded dates
    const fallbackFromDate = new Date();
    fallbackFromDate.setDate(fallbackFromDate.getDate());
    fallbackFromDate.setHours(7, 30, 0, 0);

    const fallbackTillDate = new Date(fallbackFromDate);
    fallbackTillDate.setDate(fallbackFromDate.getDate());
    fallbackTillDate.setHours(23, 59, 0, 0);

    let validFrom = fallbackFromDate;
    let validTill = fallbackTillDate;

    if (passData?.createdAt?.seconds) {
        validFrom = new Date(passData.createdAt.seconds * 1000);

        validTill = new Date(validFrom);
        validTill.setDate(validFrom.getDate());
        validTill.setHours(23, 59, 0, 0);
    }

    return (
        <div className="min-h-screen max-w-md mx-auto bg-[#d83737] flex items-center justify-center p-4 relative">
            {/* Header Navigation */}
            <div className="absolute top-3 left-4 right-4 flex items-center justify-between">
                <Link
                    to='/'
                    className="text-white hover:text-gray-200 transition-colors"
                >
                    <RxCross2 size={22} />
                </Link>
                <Link to='/booking'
                    className="flex items-center gap-2 text-white hover:text-gray-200 transition-colors"
                >
                    <span className="text-sm">All Passes</span>
                </Link>
            </div>

            {/* Main Content */}
            <div className="w-full max-w-sm">
                {!showQR ? (
                    /* Bus Pass Card */
                    <div className="bg-white text-black p-4 rounded-lg">
                        <h1 className="text-xl font-medium text-center">
                            Transport Dept. of Delhi
                        </h1>

                        <div className="flex items-center justify-between py-4 border-b">
                            <span className="text-lg">DTC Daily Pass</span>
                            <span className="text-lg">
                                {passData?.selectedPass || "AC pass - ₹50.0"}
                            </span>
                        </div>

                        <div className="flex items-center justify-between pt-2">
                            <span className="text-sm">Passenger Name</span>
                            <span className="text-sm">Pass Type</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <span className="">
                                {passData?.name ? passData?.name : user?.username == "demo" ? "Demo User" : 'adi'}
                            </span>
                            <span className="text-lg font-medium">AC</span>
                        </div>

                        <div className="pt-1">
                            <div className="text-sm">Passenger Age</div>
                            <div className="text-lg">
                                {passData?.age || 20}
                            </div>
                        </div>

                        <div className="pt-1">
                            <div className="text-sm">Booking Time</div>
                            <div className="text-lg">
                                {formatDate(validFrom || new Date(), '07:06 AM')}
                            </div>
                        </div>

                        <div className="pt-1">
                            <div className="text-sm">Validity Time</div>
                            <div className="text-lg">
                                {formatDate(validTill || new Date(), '11:59 PM')}
                            </div>
                        </div>

                        <div className="text-gray-400 text-sm text-center py-2">
                            DL{new Date().toLocaleDateString("en-GB").replace(/\//g, '')}ruhfrdae
                        </div>

                        <button
                            onClick={() => setShowQR(!showQR)}
                            className="w-full bg-[#d83737] transition-colors p-2 flex items-center justify-center gap-2 rounded"
                        >
                            <BsQrCode size={28} className="text-white" />
                            <span className="text-white text-sm">Show QR Code</span>
                        </button>

                        <div className="text-center text-sm pt-2">
                            Valid in AC and Non-AC DTC buses.
                        </div>
                        <div className=" text-center text-sm">
                            Non-Transferable Pass
                        </div>

                        <div className="flex items-center justify-center mt-4">
                            <img
                                src="./ondc-logo.png"
                                alt="DTC Logo"
                                className="w-32 mt-2"
                            />
                        </div>
                    </div>
                ) : (
                    /* QR Code Display */
                    <div className="bg-gray-900 p-0 rounded-lg overflow-hidden">
                        <button
                            onClick={() => setShowQR(!showQR)}
                            className="block w-full"
                        >
                            <div className="w-full h-80 bg-white flex items-center justify-center">
                                {/* QR Code Placeholder - Replace with actual QR code */}
                                <div className="w-64 h-64 bg-white flex items-center justify-center">
                                    <img
                                        src="./pass-qr.jpg"
                                        alt="QR Code"
                                        className="w-full max-w-[350px] h-auto mx-auto"
                                    />
                                </div>
                            </div>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DailyPass;