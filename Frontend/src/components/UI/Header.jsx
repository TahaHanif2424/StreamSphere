import { useNavigate } from "react-router";
import { useSelector } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { Menu } from "lucide-react"; // hamburger icon
import defaultChannelPic from "../../../public/icon-7797704_640.png";

export default function Header() {
  const navigate = useNavigate();
  const userData = useSelector((state) => state.user.user);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    if (!userData) navigate("/auth?mode=login");
  }, [userData, navigate]);

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
    navigate("/auth?mode=login");
  };

  const handleViewChannel = () => {
    navigate(`/channels/${userData._id}?tab=videos`);
  };

  const toggleSidebar = () => {
    setSidebarOpen((prev) => !prev);
  };

  const goTo = (path) => {
    navigate(path);
    setSidebarOpen(false);
  };

  return (
    <>
      {/* HEADER */}
      <header className="flex items-center w-screen bg-white fixed top-0 left-0 px-4 sm:px-10 h-[10dvh] justify-between py-4 shadow-lg shadow-black/20 z-20">
        <div className="flex items-center gap-4">
          {/* Hamburger */}
          <button onClick={toggleSidebar}>
            <Menu className="w-6 h-6 text-black" />
          </button>
          <h1 className="text-2xl tracking-widest font-semibold">Stream Sphere</h1>
        </div>

        {/* Search */}
        <input
          type="text"
          className="outline-none border border-black/50 px-3 text-lg bg-white focus:border-black rounded-md py-1 w-[25%]"
          placeholder="Search"
        />

        {/* Avatar + Dropdown */}
        <div className="relative" ref={dropdownRef}>
          <img
            src={userData.channelImageURL || defaultChannelPic}
            alt="profile"
            className="w-10 h-10 rounded-full object-cover border-2 border-sky-500 cursor-pointer"
            onClick={() => setDropdownOpen(!dropdownOpen)}
          />

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-40 bg-white border border-gray-200 rounded-md shadow-lg z-30">
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

      {/* SIDEBAR + BACKDROP */}
      {sidebarOpen && (
        <>
          <div
            onClick={toggleSidebar}
            className="fixed inset-0 bg-black opacity-50 z-10"
          />

          <aside className="fixed top-0 left-0 h-full w-64 bg-white shadow-lg z-20 transform translate-x-0 transition-transform duration-300 ease-in-out">
            {/* Sidebar Header */}
            <div className="flex items-center gap-4 px-4 py-4 border-b shadow-sm">
              <button onClick={toggleSidebar}>
                <Menu className="w-6 h-6 text-black" />
              </button>
              <h2 className="text-xl font-semibold">Stream Sphere</h2>
            </div>

            {/* Sidebar Links */}
            <nav className="flex flex-col px-4 pt-4 space-y-2 text-lg text-gray-700">
              <button onClick={() => goTo(`/channels/${userData._id}?tab=history`)} className="hover:bg-gray-100 py-2 text-left px-2 rounded">
                📺 Watch History
              </button>
              <button onClick={() => goTo(`/channels/${userData._id}?tab=playlists`)} className="hover:bg-gray-100 py-2 text-left px-2 rounded">
                🎞️ Playlists
              </button>
              <button onClick={() => goTo(`/channels/${userData._id}?tab=videos`)} className="hover:bg-gray-100 py-2 text-left px-2 rounded">
                📺 Channel Details
              </button>
            </nav>
          </aside>
        </>
      )}
    </>
  );
}
