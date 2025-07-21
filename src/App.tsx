import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import Home from "./pages/Home";
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

const App = () => {
  const router = createBrowserRouter(([
    {
      path : "",
      element : <Layout />,
      children : [
        {
          path : "/",
          element : <Home />
        },
        {
          path : "/nearby",
          element : <NearBy />
        },
        {
          path : "/help",
          element : <Help />
        },
        {
          path : "/booking",
          element : <Booking />
        }
      ]
    },
    {
      path : "/profile",
      element : <Profile />
    },
    {
      path : "/ticket",
      element : <Ticket />
    },
    {
      path : "/passForm",
      element : <BusPassForm />
    },
    {
      path : "/dailyPassForm",
      element : <DailyPassForm />
    },
    {
      path : "/metroPassForm",
      element : <MetroTicketForm />
    },
    {
      path : "/busQRScanner",
      element : <BusQRScanner />
    },
    {
      path : "/monthlyPass",
      element : <MonthlyPass />
    },
    {
      path : "/login",
      element : <Login />
    },
  ]))
  return (
    <RouterProvider router={router} />
  
  );
};

export default App;
