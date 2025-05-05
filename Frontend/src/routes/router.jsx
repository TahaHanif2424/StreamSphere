import { createBrowserRouter } from "react-router-dom";
import AuthPage from "../pages/AuthPage";
import HomePage, { loader as HomeLoader } from "../pages/HomePage";
import RootPage, { loader as userLoader } from "../pages/RootPage";
import { authAction } from "../actions";
import ChannelPage, { loader as channelLoader } from "../pages/ChannelPage";
import VideoForm from "../pages/VideoFormPage";

const router = createBrowserRouter([
  { path: "/auth", element: <AuthPage />, index: true, action: authAction },
  {
    path: "/",
    element: <RootPage />,
    loader: userLoader,
    children: [
      { index: true, element: <HomePage />, loader: HomeLoader },
      {
        path: "channels/:channelName",
        element: <ChannelPage />,
        loader: channelLoader,
      },
      {path: 'videos/:videoId/edit', element: <VideoForm />}
    ],
  },
]);

export default router;
