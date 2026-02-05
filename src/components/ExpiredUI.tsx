import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { useNavigate } from "react-router-dom";

const ExpiredUI = ({ expired, data }) => {
  const navigate = useNavigate();

  return (
    <div className="fixed top-40 left-1/2 -translate-x-1/2 w-full h-full max-w-md overflow-hidden rounded-lg bg-white text-left shadow-xl">
      <div className="bg-white px-4 pt-5 pb-4">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <HiOutlineExclamationTriangle
            className="h-6 w-6 text-red-600"
            aria-hidden="true"
          />
        </div>

        <div className="mt-3 text-center">
          <span className="text-base font-semibold text-gray-900">
            Plan Expired
          </span>

          <p className="mt-2 text-sm text-gray-500">
            {expired?.message ||
              "Your current plan has expired. Please renew to continue using our services."}
          </p>
        </div>
      </div>

      <div className="m-3 bg-gray-50">
        <button
          onClick={() => navigate("/renew")}
          className="inline-flex w-full justify-center rounded-md bg-blue-600 px-4 py-2 text-base font-medium text-white shadow-sm"
        >
          Renew Plan
        </button>
      </div>
    </div>
  );
};

export default ExpiredUI;
