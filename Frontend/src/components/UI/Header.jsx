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
    <header className="flex items-center w-screen fixed top-0 left-0 px-10 h-[10dvh] justify-between py-4 shadow-lg shadow-black/20">
      <h1 className="text-2xl tracking-widest">Stream Sphere</h1>
      <input type="text" className="outline-none border border-black/50 px-2 text-lg bg-white focus:border-black rounded-md -ml-15 py-0.5 w-[25%]" placeholder="Search" />
      <h4>{userData}</h4>
    </header>
  );
}
