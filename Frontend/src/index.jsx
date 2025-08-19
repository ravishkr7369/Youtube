import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCurrentUser } from "./features/auth/authSlice";

import NavigationBar from "./components/NavigationBar";
import Sidebar from "./components/Sidebar";
import LoginPage from "./pages/Login";
import SignupPage from "./pages/signup";
import UserProfile from "./pages/UserProfile";
import App from "./App";
import VideoPlayer from "./components/VideoPlayer";
import Playlist from "./pages/Playlist";
import PlaylistsPage from "./pages/PlaylistsPage";
import LikedVideosPage from "./pages/LikedVideosPage";
import HistoryPage from "./pages/HistoryPage";
import YourVideos from "./pages/YourVideos";
import SearchResults from "./pages/SearchResults";
import BottomNav from "./components/BottomNav";
import Shorts from "./pages/Shorts";

// ✅ Hook to detect screen size
function useIsLaptop() {
  const [isLaptop, setIsLaptop] = useState(() => window.innerWidth >= 768);

  useEffect(() => {
    const handleResize = () => setIsLaptop(window.innerWidth >= 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return isLaptop;
}

function Index() {
  const dispatch = useDispatch();
  const location = useLocation();
  const navigate = useNavigate();

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [checkedAuth, setCheckedAuth] = useState(false);
  const isLaptop = useIsLaptop();

  const { isAuthenticated } = useSelector((state) => state.auth);

  const isAuthPage =
    location.pathname === "/login" || location.pathname === "/signup";

  // ✅ Step 1: Fetch current user once
  useEffect(() => {
    if (!checkedAuth) {
      dispatch(fetchCurrentUser())
        .unwrap()
        .catch(() => {})
        .finally(() => setCheckedAuth(true));
    }
  }, [dispatch, checkedAuth]);

  // ✅ Step 2: Handle auth-based navigation
  useEffect(() => {
    if (!checkedAuth) return;

    if (!isAuthenticated && !isAuthPage) {
      navigate("/login");
    } else if (isAuthenticated && isAuthPage) {
      navigate("/");
    }
  }, [checkedAuth, isAuthenticated, isAuthPage, navigate]);

  const hideLayout = isAuthPage;

  return (
    <div className="flex flex-col h-screen bg-[#0F0F0F]">
      {/* NavigationBar */}
      {!hideLayout && (
        <div className="fixed top-0 left-0 right-0 z-20 bg-[#0F0F0F]">
          <NavigationBar
            sidebarOpen={sidebarOpen}
            setSidebarOpen={setSidebarOpen}
          />
        </div>
      )}

      {/* Sidebar only for laptops/desktops */}
      {!hideLayout && isLaptop && (
        <div
          className={`fixed top-16 bottom-0 left-0 w-64 bg-[#0F0F0F] z-10 shadow-lg
          transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}`}
        >
          <Sidebar />
        </div>
      )}

      {/* Main content */}
      <main
        className={`flex-1 overflow-y-auto min-h-screen bg-[#0F0F0F] transition-all duration-300 ease-in-out
          ${location.pathname === "/" ? "pt-20" : "pt-0"}
          ${!hideLayout ? "px-2 md:px-4 pb-16" : ""}
          ${sidebarOpen && isLaptop && !hideLayout ? "md:ml-64" : "md:ml-14"}`}
      >
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/" element={<App />} />
          <Route path="/video/:id" element={<VideoPlayer />} />
          <Route path="/search" element={<SearchResults />} />
          <Route path="/profile" element={<UserProfile />} />
          <Route path="/playlists" element={<PlaylistsPage />} />
          <Route path="/playlist/:id" element={<Playlist />} />

          <Route path="/liked" element={<LikedVideosPage />} />
          <Route path="/:id/videos" element={<YourVideos />} />
          <Route path="/shorts" element={<Shorts />} />
          <Route path="/shorts/:id" element={<VideoPlayer isShorts />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
      {/* ✅ Bottom nav for mobile */}
      {!hideLayout && <BottomNav />}
    </div>
  );
}

export default Index;
