import { HiOutlineExclamationTriangle } from "react-icons/hi2";
import { Link } from "react-router-dom";

const ExpiredUI = ({ expired }) => {
  return (
    <div className="fixed top-40 left-1/2 -translate-x-1/2 w-full  max-w-md overflow-hidden rounded-lg bg-white text-left shadow-xl">
      <div className="bg-white px-4 pt-5 pb-4">
        <div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100">
          <HiOutlineExclamationTriangle className="h-6 w-6 text-red-600" aria-hidden="true" />
        </div>

        <div className="mt-3 text-center">
          <span className="text-base font-semibold leading-6 text-gray-900">
            Plan Expired
          </span>
          <p className="mt-2 text-sm leading-5 text-gray-500">
           {expired?.message || "Your current plan has expired. Please renew to continue using our services."}
          </p>
        </div>
      </div>

      <div className="m-3 bg-gray-50">
        <Link to='/signup'
          className="inline-flex w-full cursor-pointer justify-center rounded-md border border-transparent bg-blue-600 px-4 py-2 text-base font-medium leading-6 text-white shadow-sm"
        >
          Renew Plan
        </Link>
      </div>
    </div>
  )
}

export default ExpiredUI;
