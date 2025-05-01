import { createBrowserRouter } from "react-router-dom";
import AuthPage from "../pages/AuthPage";

const router = createBrowserRouter([
  { path: "/auth", element: <AuthPage />, index: true },
  { path: "/", element: <HomePage />, index: true, children: [
    
  ] },
]);

export default router;
