import DashboardApp from "../pages/Dashboard.jsx";
import Home from "../pages/LandingPage.jsx";

export const appRoutes = [
  {
    index: true,
    element: <Home/>,
  },
  {
    path: "dashboard",
    element: <DashboardApp/>,
  },
];
