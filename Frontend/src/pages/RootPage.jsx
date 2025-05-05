import { Outlet } from "react-router-dom";
import store from "../store";
import { userActions } from "../store/user-slice";
import Header from "../components/UI/Header";

export default function RootPage() {
  return (
    <>
      <Header />
      <div className="mt-[10dvh] w-screen bg-gray-100 pt-5">
        <Outlet />
      </div>
    </>
  );
}

export async function loader() {
  if (store.getState().user.user) return;
  const userToken = localStorage.getItem("userToken") || null;
  if (!userToken) return;
  const response = await fetch("http:localhost:5000/users/" + userToken, {
    method: "POST",
    body: userToken,
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    return;
  }

  const responseData = await response.json();

  store.dispatch(userActions.addUser(responseData));
}
