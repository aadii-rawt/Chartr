import { BiHomeAlt2 } from 'react-icons/bi';
import { FaHome, FaMapMarkerAlt, FaCompass, FaQuestionCircle } from 'react-icons/fa';
import { HiOutlineLocationMarker } from 'react-icons/hi';
import { IoMdHelpCircleOutline } from 'react-icons/io';
import { PiTicket } from 'react-icons/pi';
import { Link } from 'react-router-dom';

const FooterNav = () => {
  return (
    <div className="fixed bottom-0 text-xl left-0 right-0 bg-white border-t border-gray-200 p-2 flex justify-around max-w-md mx-auto">
      <NavItem icon={<BiHomeAlt2 size={28}   />} label="Home" route="/" />
      <NavItem icon={<HiOutlineLocationMarker size={28}  />} label="Nearby" route="/nearby" />
      <NavItem icon={<PiTicket size={28}  />} label="Ticket & Pass" route='/booking' />
      <NavItem icon={<HiOutlineLocationMarker size={28}  />} label="Around me" route='/nearby'/>
      <NavItem icon={<IoMdHelpCircleOutline size={28}  />} label="Help" route='/help' />
    </div>
  );
};

const NavItem = ({ icon, label, route }: { icon: React.ReactNode; label: string }) => (
  <Link to={route} className="flex flex-col items-center text-gray-700">
    {icon}
    <span className="text-[10px] mt-1">{label}</span>
  </Link>
);

export default FooterNav;
