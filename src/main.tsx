import type { RouteObject } from "react-router-dom";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { createBrowserRouter, RouterProvider, } from "react-router-dom";
import routes from "./routes";
import App from "./App";
import { AuthProvider } from "./context/AuthContext";


const router = createBrowserRouter([
  {
  path: '/',
  element: (
    <AuthProvider>
    <App />,
    </AuthProvider>
  ),
  children: routes as RouteObject[] 
  } 
]);

// Rendera appen
createRoot(document.querySelector("#root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
