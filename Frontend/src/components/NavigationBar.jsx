import { useState, useRef, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { logoutUser, fetchCurrentUser } from "../features/auth/authSlice";
import UploadVideoModal from "./UploadVideoModal";
import { searchVideos } from "../features/auth/videoSlice";
import { toast } from "react-toastify";

const SearchIcon = ({ size = 20, color = "white" }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    fill={color}
    viewBox="0 0 24 24"
    width={size}
    height={size}
  >
    <path d="M16.296 16.996a8 8 0 11.707-.708l3.909 3.91-.707.707-3.909-3.909zM18 11a7 7 0 00-14 0 7 7 0 1014 0z" />
  </svg>
);

function NavigationBar({ sidebarOpen, setSidebarOpen }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isUploadModalOpen, setIsUploadModalOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const [Search, setSearch] = useState("");

  const menuRef = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleInput = (e) => setSearch(e.target.value);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (Search.trim().length === 0) return;
    dispatch(searchVideos(Search));
    if (location.pathname !== "/search") navigate("/search");
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      toast.success("Logout successful!");
      navigate("/login");
      //window.location.reload();
      
    } catch (error) {
      console.error("Logout failed:", error);
      toast.error(`Logout failed: ${error.message || "An error occurred"}`);
    }
  };

  return (
    <div className="text-gray-50 flex items-center justify-between p-2 md:px-4 shadow-md border-b border-gray-700 fixed top-0 left-0 w-full z-50 bg-[#0F0F0F]">
      {/* Left: Sidebar Toggle (Laptop Only) + Logo */}
      <div className="flex items-center gap-2">
        {/* Sidebar Toggle */}
        <button
          className="hidden md:block p-2 rounded-full hover:bg-[#333333] transition cursor-pointer"
          onClick={() => setSidebarOpen(!sidebarOpen)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            fill="white"
          >
            <path d="M21 6H3V5h18v1zm0 5H3v1h18v-1zm0 6H3v1h18v-1z" />
          </svg>
        </button>

        {/* Logo */}
        <a href="/" className="flex items-center mx-2">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 29 20"
            className="w-[28px] h-[20px] block overflow-hidden"
            preserveAspectRatio="xMinYMin meet"
          >
            <g>
              <path
                d="M14.4848 20C14.4848 20 23.5695 20 25.8229 19.4C27.0917 19.06 28.0459 18.08 28.3808 16.87C29 14.65 29 9.98 29 9.98C29 9.98 29 5.34 28.3808 3.14C28.0459 1.9 27.0917 0.94 25.8229 0.61C23.5695 0 14.4848 0 14.4848 0C14.4848 0 5.42037 0 3.17711 0.61C1.9286 0.94 0.954148 1.9 0.59888 3.14C0 5.34 0 9.98 0 9.98C0 9.98 0 14.65 0.59888 16.87C0.954148 18.08 1.9286 19.06 3.17711 19.4C5.42037 20 14.4848 20 14.4848 20Z"
                fill="#FF0033"
              />
              <path d="M19 10L11.5 5.75V14.25L19 10Z" fill="white" />
            </g>
          </svg>
          <span className="ml-[4px] text-white text-[16px] font-semibold leading-none ">
            YouTube
          </span>
        </a>
      </div>

      {/* Center: Search Bar (desktop only) */}
      <form onSubmit={handleSubmit} className="hidden md:flex w-[50%] mx-auto">
        <div className="flex w-full rounded-full border border-gray-700 overflow-hidden">
          <input
            type="text"
            placeholder="Search"
            className="w-full px-4 py-[6px] bg-[#121212] text-white placeholder-gray-400 focus:outline-none"
            onChange={handleInput}
          />
          <button
            type="submit"
            className="px-4 bg-[#222222] text-white cursor-pointer"
          >
            <SearchIcon />
          </button>
        </div>
      </form>

      {/* Right: Actions */}
      <div className="flex items-center gap-3 ml-auto relative">
        {/* Upload Button (desktop only) */}
        <button
          onClick={() => setIsUploadModalOpen(true)}
          className="hidden md:flex px-4 py-2 rounded-full bg-[#222222] text-white hover:bg-[#333333] items-center gap-2"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            fill="currentColor"
          >
            <path d="M20 12h-8v8h-1v-8H3v-1h8V3h1v8h8v1z" />
          </svg>
          <span className="cursor-pointer">Create</span>
        </button>

        {/* Notification Icon (desktop only) */}
        <button aria-label="Notifications" className="hidden md:block relative">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="24"
            width="24"
            fill="currentColor"
          >
            <path d="M13.5 4.9l.05.8.69.4C15.6 6.88 16.5 8.33 16.5 10v2.89c0 .99.27 1.97.78 2.83L18.35 17.5H5.65l1.07-1.78c.51-.85.78-1.83.78-2.83V10c0-1.67.9-3.12 2.26-3.9l.69-.4.05-.8c.05-.78.7-1.4 1.5-1.4s1.45.62 1.5 1.4z" />
          </svg>
          <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full px-1.5 py-0.5">
            9+
          </span>
        </button>

        {/* Mobile search icon (uses same icon) */}
        <button
          className="md:hidden p-2 rounded-full hover:bg-[#222]"
          onClick={() => setMobileSearchOpen(true)}
        >
          <SearchIcon />
        </button>

        {/* Profile Dropdown */}
        <div className="relative" ref={menuRef}>
          <button
            onClick={() => setMenuOpen((prev) => !prev)}
            className="w-9 h-9 rounded-full overflow-hidden border-2 border-gray-700 hover:border-white cursor-pointer"
          >
            <img
              src={
                user?.avatar ||
                "https://www.citypng.com/public/uploads/preview/black-user-member-guest-icon-701751695037011q8iwf4mjbn.png"
              }
              alt="User"
              className="w-full h-full object-cover"
            />
          </button>
          {menuOpen && (
            <div className="absolute right-0 mt-2 w-48 bg-[#222] border border-gray-700 rounded-lg shadow-lg z-50">
              {user && (
                <div className="text-white p-3 border-b border-gray-600">
                  <p className="font-medium">
                    {user.fullName.charAt(0).toUpperCase() +
                      user.fullName.slice(1)
                    || "Your Name"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {user.email || "you@example.com"}
                  </p>
                </div>
              )}
              {user ? (
                <>
                  <Link
                    to="/profile"
                    className="block px-4 py-2 text-white hover:bg-[#333]"
                    onClick={() => setMenuOpen(false)}
                  >
                    <span className="text-blue-500">View your channel</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-white hover:bg-[#333] cursor-pointer"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/login"
                    className="block px-4 py-2 text-white hover:bg-[#333]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="block px-4 py-2 text-white hover:bg-[#333]"
                    onClick={() => setMenuOpen(false)}
                  >
                    Signup
                  </Link>
                </>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Upload Modal */}
      {isUploadModalOpen && (
        <UploadVideoModal onClose={() => setIsUploadModalOpen(false)} />
      )}

      {/* Mobile Search Modal */}
      {mobileSearchOpen && (
        <div className="fixed inset-0 z-50 bg-[#0F0F0F] flex flex-col p-2">
          <div className="flex items-center gap-2 border-b border-gray-700 pb-2">
            <button
              onClick={() => setMobileSearchOpen(false)}
              className="p-2 rounded-full hover:bg-[#222]"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                fill="white"
                viewBox="0 0 24 24"
              >
                <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
              </svg>
            </button>
            <form
              onSubmit={(e) => {
                handleSubmit(e);
                setMobileSearchOpen(false);
              }}
              className="flex items-center flex-1"
            >
              <input
                type="text"
                autoFocus
                placeholder="Search"
                value={Search}
                onChange={handleInput}
                className="w-full px-4 py-[6px] text-sm rounded-full bg-[#1F1F1F] text-white placeholder-gray-400 focus:outline-none"
              />
              <button type="submit" className="ml-2">
                <SearchIcon size={22} />
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default NavigationBar;
