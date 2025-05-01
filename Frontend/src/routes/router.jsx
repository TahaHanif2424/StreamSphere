import { createBrowserRouter } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import HomePage from "../pages/HomePage";
import RootPage, {loader as userLoader} from "../pages/RootPage";
import { authAction } from "../actions";

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
