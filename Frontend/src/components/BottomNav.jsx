import { Home, PlusCircle, User, History, Video } from "lucide-react";
import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import UploadVideoModal from "./UploadVideoModal";

function BottomNav() {
  
  const location = useLocation();
  const [showUploadModal, setShowUploadModal] = useState(false);

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="fixed bottom-0 left-0 right-0 bg-[#0F0F0F] border-t border-gray-700 text-white flex justify-around items-center py-2 z-50 md:hidden">
        <Link
          to="/"
          className={`flex flex-col items-center text-xs ${
            isActive("/") ? "text-blue-500" : ""
          }`}
        >
          <Home size={20} />
          Home
        </Link>

        <Link
          to="/shorts"
          className={`flex flex-col items-center text-xs ${
            isActive("/shorts") ? "text-blue-500" : ""
          }`}
        >
          <Video size={20} />
          Shorts
        </Link>

        <button
          onClick={() => setShowUploadModal(true)}
          className="text-white flex flex-col items-center"
        >
          <PlusCircle size={28} />
        </button>

        <Link
          to="/history"
          className={`flex flex-col items-center text-xs ${
            isActive("/history") ? "text-blue-500" : ""
          }`}
        >
          <History size={20} />
          History
        </Link>

        <Link
          to="/profile"
          className={`flex flex-col items-center text-xs ${
            isActive("/profile") ? "text-blue-500" : ""
          }`}
        >
          <User size={20} />
          Profile
        </Link>
      </nav>

      {showUploadModal && (
        <UploadVideoModal onClose={() => setShowUploadModal(false)} />
      )}
    </>
  );
}

export default BottomNav;
