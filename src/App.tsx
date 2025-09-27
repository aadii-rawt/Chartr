import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import BusPassForm from "./pages/BusPassForm";
import DailyPassForm from "./pages/DailyPassForm";
import MetroTicketForm from "./pages/MetroTicketForm";
import BusQRScanner from "./pages/BusQRScanner";
import MonthlyPass from "./pages/MonthlyPass";
import NearBy from "./pages/NearBy";
import Help from "./pages/Help";
import Profile from "./pages/Profile";
import Booking from "./pages/Booking";
import Ticket from "./pages/Ticket";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import DailyPass from "./pages/DailyPass";
import NewHome from "./pages/NewHome";
import AdminLayout from "./Layout/AdminLayout";
import Dashboard from "./pages/Admin/Dashboard";
import Pass from "./pages/Admin/Pass";
import AdminDailyPass from "./pages/Admin/Dailypass";
import PlansTable from "./pages/Admin/Plan";
import Users from "./pages/Admin/Users";
import AdminProtectiveRoute from "./middleware/adminProtectiveRoute";
import { useUser } from "./context/UserContext";
import Home from "./pages/Home";
import Download from "./pages/Download";

const App = () => {

  const { newHomePage } = useUser()
  const router = createBrowserRouter(([
    {
      path: "",
      element: <Layout />,
      children: [
        {
          path: "/",
          element: newHomePage ? <NewHome /> : <Home />
        },
        {
          path: "/nearby",
          element: <NearBy />
        },
        {
          path: "/help",
          element: <Help />
        },
        {
          path: "/booking",
          element: <Booking />
        }
      ]
    },
    {
      path: "/",
      element: <AdminProtectiveRoute><AdminLayout /></AdminProtectiveRoute>,
      children: [{
        path: "/admin",
        element: <Dashboard />
      },
      {
        path: "/pass",
        element: <Pass />
      },
      {
        path: "/dailypassAdmin",
        element: <AdminDailyPass />
      },
      {
        path: "/plans",
        element: <PlansTable />
      },
      {
        path: "/users",
        element: <Users />
      },
      ]
    },
    {
      path: "/profile",
      element: <Profile />
    },
    {
      path: "/ticket",
      element: <Ticket />
    },
    {
      path: "/passForm",
      element: <BusPassForm />
    },
    {
      path: "/dailyPassForm",
      element: <DailyPassForm />
    },
    {
      path: "/dailyPass",
      element: <DailyPass />
    },
    {
      path: "/metroPassForm",
      element: <MetroTicketForm />
    },
    {
      path: "/busQRScanner",
      element: <BusQRScanner />
    },
    {
      path: "/monthlyPass",
      element: <MonthlyPass />
    },
    {
      path: "/login",
      element: <Login />
    },
    {
      path: "/signup",
      element: <Signup />
    },
    {
      path: "/download",
      element: <Download />
    },
  ]))
  return (
    <RouterProvider router={router} />

  );
};

export default App;
