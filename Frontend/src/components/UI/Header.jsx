import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useEffect } from "react";

export default function Header() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.user);

  useEffect(() => {
    if (!userData) navigate("/auth?mode=login");
  }, [userData]);

  return (
    <header className="flex items-center w-screen bg-white fixed top-0 left-0 px-10 h-[10dvh] justify-between py-4 shadow-lg shadow-black/20 z-10">
      <h1 className="text-2xl tracking-widest">Stream Sphere</h1>
      <input type="text" className="outline-none border border-black/50 px-2 text-lg bg-white focus:border-black rounded-md -ml-15 py-0.5 w-[25%]" placeholder="Search" />
      <button className="bg-sky-500 text-white text-semibold rounded-md py-1 px-4 cursor-pointer hover:bg-sky-700 transition-all duration-300">{userData.channelName}</button>
    </header>
  );
}
