import { FaBus } from "react-icons/fa";
import { IoIosArrowRoundDown } from "react-icons/io";
import { MdInfo, MdLocationPin } from "react-icons/md";
import { Link } from "react-router-dom";

const TicketCard = () => (
    <div className="p-4">
        <div className="flex justify-between items-center mb-4">
            <span className="font-medium">Bus Ticket</span>
            <span className="text-sm">View all tickets</span>
        </div>

        <Link to='/ticket'>
            <div className="rounded-xl p-3 py-1.5 bg-white relative border border-gray-300 relative">

                <div className="flex justify-between items-center mb-0">
                    <div className="flex items-center gap-2 text-[#445eab]">
                        <FaBus /> <span className="bg-blue-100 text-[#445eab] text-sm px-2 font-medium py-1 rounded">Route 534</span>
                    </div>
                    <div className="text-xl font-semibold flex  items-center gap-2">₹4.62 <MdInfo className="text-gray-400" /></div>
                </div>
                <div className="flex text-sm items-center gap-2">
                    <div className="w-4 h-4 rounded-full bg-green-600"></div> Nehru Place
                </div>
                <div className="text-smflex items-center gap-2">
                    <IoIosArrowRoundDown size={20} />
                </div>
                <div className="text-sm mb-2 flex items-center gap-2">
                    <MdLocationPin size={18} className="text-red-600" /> Sheikh Sarai Phase II
                </div>
                <div className="text-center">
                    <button className="bg-green-primary text-white w-full py-2 rounded">View Ticket</button>
                </div>
                <img src="./invalid.png" alt="" className="w-[80%] absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                {/* <div className="absolute top-10 left-10 transform rotate-[-15deg] bg-white border-4 border-red-600 text-red-600 font-bold text-xl px-4 py-1">INVALID</div> */}
            </div>
        </Link>
    </div>
);
export default TicketCard;
