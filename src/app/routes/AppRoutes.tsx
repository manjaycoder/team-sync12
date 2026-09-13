import { createBrowserRouter, RouterProvider, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { currentLoggedEmployee } from "../features/auth/state/auth/authAction";
import PublicRoutes from "../layouts/protectedRoutes/PublicRoutes";
import ProtectedRoutes from "../layouts/protectedRoutes/ProtectedRoutes";
import PublicWebsite from "../features/public/ui/PublicWebsite";
import Login from "../features/auth/ui/Login";
import Register from "../features/auth/ui/Register";
import DashboardLayout from "../layouts/DashboardLayout";
import Home from "../features/dashboard/ui/pages/Home";
import EmployeeList from "../features/employee/ui/EmployeeList";
import DepartmentList from "../features/departments/ui/DepartmentList";
import ProjectsWorkspace from "../features/projects/ui/ProjectsWorkspace";
import AICopilotPage from "../features/ai/ui/AICopilotPage";
import Settings from "../features/dashboard/ui/pages/Settings";
import type { AppDispatch } from "./store";

const AppRoutes = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(currentLoggedEmployee());
  }, [dispatch]);

  const router = createBrowserRouter([
    {
      path: "/",
      element: <PublicWebsite />,
    },
    {
      path: "/portal",
      element: <PublicWebsite />,
    },
    {
      path: "/login",
      element: <PublicRoutes />,
      children: [
        {
          index: true,
          element: <Login />,
        },
      ],
    },
    {
      path: "/register",
      element: <PublicRoutes />,
      children: [
        {
          index: true,
          element: <Register />,
        },
      ],
    },
    {
      path: "/home",
      element: <ProtectedRoutes />,
      children: [
        {
          element: <DashboardLayout />,
          children: [
            {
              index: true,
              element: <Home />,
            },
            {
              path: "projects",
              element: <ProjectsWorkspace />,
            },
            {
              path: "employees",
              element: <EmployeeList />,
            },
            {
              path: "departments",
              element: <DepartmentList />,
            },
            {
              path: "ai-copilot",
              element: <AICopilotPage />,
            },
            {
              path: "settings",
              element: <Settings />,
            },
          ],
        },
      ],
    },
    {
      path: "*",
      element: <Navigate to="/" replace />,
    },
  ]);

  return <RouterProvider router={router} />;
};

export default AppRoutes;