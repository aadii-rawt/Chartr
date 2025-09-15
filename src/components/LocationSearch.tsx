import { BiLocationPlus, BiSearch } from "react-icons/bi";
import { BsArrowRight } from "react-icons/bs";
import { CiLocationOn } from "react-icons/ci";
import { IoLocationSharp } from "react-icons/io5";
import { MdKeyboardArrowRight } from "react-icons/md";

export default function LocationSearch() {


  return (
    <div className="w-full max-w-md mx-auto px-4">
        <div className="bg-white p-3 rounded-2xl shadow">
        <div className="px-5 -mt-10">
            <div className="bg-white flex shadow justify-between px-2.5 py-2 rounded-3xl items-center gap-5">
                <IoLocationSharp  size={24} className="text-cyan-500" />
                <input type="text" placeholder="Where are you going?" className="flex-1 py-1 border-none outline-none" />
                <BiSearch size={20} />
            </div>
        </div>

            <div className="flex items-center justify-between gap-4 py-1.5 border-b border-gray-300">
                <div className="bg-gray-200 p-2 rounded-full">
                <IoLocationSharp />
                </div>
                <p className="flex-1">Rozaana</p>
                <MdKeyboardArrowRight  />
            </div>
            <div className="flex items-center justify-between gap-4 py-1.5">
                <div className="bg-gray-200 p-2 rounded-full">
                <IoLocationSharp />
                </div>
                <p className="flex-1">Andrews Ganj</p>
                <MdKeyboardArrowRight  />
            </div>
        </div>
    </div>
  );
}
