import { Link } from "react-router-dom";

type Props = {
    icon: React.ReactNode;
    label: string;
    newBadge?: boolean;
    wallet?: boolean;
};

const FeatureButton = ({ icon, label, newBadge, wallet, route }: Props) => {
    return (
        <Link to={route} className={`flex flex-col items-center justify-center ${wallet ? 'col-span-2' : ''}`}>
            <div className={`relative min-w-[65px] min-h-[65px] flex items-center justify-center bg-blue-100 p-3 rounded-lg ${wallet ? 'w-full text-left !bg-[#445eab]' : ''}`}>
                {icon}
                {newBadge && (
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] px-1 rounded-full">New</span>
                )}
            </div>
            <span className="mt-1 text-xs text-gray-700">{label}</span>
        </Link>
    );
};

export default FeatureButton;
