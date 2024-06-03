import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import Home from "./pages/home.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./pages/sign-in.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/sign-in",
    element: <SignIn />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
