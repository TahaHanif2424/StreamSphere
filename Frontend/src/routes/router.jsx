import { createBrowserRouter } from "react-router-dom";
import AuthPage, {action as authAction} from "../pages/AuthPage";
import HomePage from "../pages/HomePage";
import RootPage, {loader as userLoader} from "../pages/RootPage";

const router = createBrowserRouter([
  { path: "/auth", element: <AuthPage />, index: true, action: authAction},
  {
    path: "/",
    element: <RootPage />,
    loader: userLoader,
    children: [{ index: true, element: <HomePage /> }],
  },
]);

export default router;
