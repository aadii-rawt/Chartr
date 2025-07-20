import { IoMdArrowForward } from 'react-icons/io';

type Props = { label: string };

const LocationCard = ({ label }: Props) => (
  <div className="flex items-center justify-between  px-4 py-2 bg-gray-100 rounded-full mb-2">
    <span className="text-sm text-gray-800">{label}</span>
    <IoMdArrowForward size={18} />
  </div>
);

export default LocationCard;
