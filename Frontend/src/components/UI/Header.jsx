import { useNavigate } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useState, useRef } from "react";
import { logoutUser } from "../../store/userSlice";
import defaultChannelPic from '../../../public/icon-7797704_640.png';

export default function Header() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const userData = useSelector((state) => state.user.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!userData) navigate("/auth?mode=login");
  }, [userData, navigate]);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    dispatch(logoutUser());
    navigate("/auth?mode=login");
  };

  const handleViewChannel = () => {
    navigate(`/channel/${userData._id}`);
  };

  return (
    <header className="flex items-center w-screen bg-white fixed top-0 left-0 px-10 h-[10dvh] justify-between py-4 shadow-lg shadow-black/20 z-10">
      <h1 className="text-2xl tracking-widest font-semibold">Stream Sphere</h1>

      {/* Search Bar */}
      <input
        type="text"
        className="outline-none border border-black/50 px-3 text-lg bg-white focus:border-black rounded-md py-1 w-[25%]"
        placeholder="Search"
      />

      {/* Profile Image + Dropdown */}
      <div className="relative" ref={dropdownRef}>
        <img
          src={userData.channelImageURL || defaultChannelPic}
          alt="profile"
          className="w-10 h-10 rounded-full object-cover border-2 border-sky-500 cursor-pointer"
          onClick={() => setDropdownOpen(!dropdownOpen)}
        />

        {dropdownOpen && (
          <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-20">
            <button
              onClick={handleViewChannel}
              className="block w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 text-left"
            >
              View Channel
            </button>
            <button
              onClick={handleLogout}
              className="block w-full px-4 py-2 text-sm text-red-600 hover:bg-red-100 text-left"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
