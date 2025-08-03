import { useEffect, useState } from "react";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { fetchCurrentUser } from "../features/auth/authSlice";
import { getVideos } from "../features/auth/videoSlice";
import { formatTimeAgo } from "../utils/timeFormat";
import { renderVideoCard } from "../components/renderVideoCard";
import { Pencil } from "lucide-react";
import { toast } from "react-toastify";

function UserProfile() {
const apiUrl = import.meta.env.VITE_URL;
 const user = useSelector((state) => state?.auth?.user);

let videos = useSelector((state) => state.video.videos || []);
 //console.log("videos:", videos);
  // Filter videos to only show those uploaded by the current user

 videos = videos.filter((v) => v.owner?.[0]?._id === user?._id);


  const [profileData, setProfileData] = useState(null);
  const [playlists, setPlaylists] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [activeTab, setActiveTab] = useState("Home");
  const [likedVideos, setLikedVideos] = useState([]);
  const dispatch = useDispatch();
  const [editing, setEditing] = useState(false);
  const [newAvatar, setNewAvatar] = useState(null);
  
  const [form, setForm] = useState({
    username: user?.username || "",
    fullName: user?.fullName || "",
  });

  {
    /* update*/
  }
  useEffect(() => {
    setForm({
      username: user?.username || "",
      fullName: user?.fullName || "",
    });
  }, [user]);

  useEffect(() => {
    dispatch(fetchCurrentUser());
  }, [dispatch]);

  // getVideos is used to fetch videos of the user
  useEffect(() => {
    if (!user) return;
    dispatch(getVideos());
  }, [user, dispatch]);

  useEffect(() => {
    setProfileData(user);

    {
      /* fetch Playlists */
    }

    const fetchPlaylists = async () => {
      try {
        const res = await axios.get(`${apiUrl}/playlists/user/${user?._id}`);

        //  console.log(res.data.data)
        setPlaylists(res.data?.data || []);
      } catch (err) {
        toast.info("please logged in");
        console.error("Failed to fetch playlists", err);
      }
    };

    {
      /* fetch Liked Videos */
    }
    const fetchLiked = async () => {
      try {
        const res = await axios.get(`${apiUrl}/likes/videos`);
        const liked = res?.data?.data?.likedVideos || [];
        //console.log(liked);
        setLikedVideos(liked.map((l) => l.video));
       // console.log("Liked Videos:", likedVideos);
      } catch (err) {
        console.error("Failed to fetch liked videos", err.message);
      }
    };

    fetchPlaylists();
    fetchLiked();
  }, [user]);

  if (!profileData) return <div className="text-white p-6">Loading...</div>;

  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const previewUrl = URL.createObjectURL(file);
    // console.log("Preview URL:", previewUrl);
    setProfileData((prev) => ({ ...prev, avatar: previewUrl }));

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res = await axios.patch(`${apiUrl}/users/avatar`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true, // if you're using cookies
      });

      setProfileData(res.data.data); // assuming `res.data.data` is the updated user
      toast.success("Avatar updated successfully!");
    } catch (err) {
      console.error("Avatar update failed:", err.message);
      toast.error("Failed to update avatar");
    }
  };

  const handleCoverImageChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("coverImage", file);

    try {
      const res = await axios.patch(`${apiUrl}/users/cover-image`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });

      toast.success("Cover image updated successfully!");
      setProfileData(res.data.data); // update UI with new cover
    } catch (err) {
      toast.error("Failed to update cover image");
      console.error("Cover image update failed:", err.message);
    }
  };

  const handleUpdateProfile = async () => {
    //console.log("Updating profile with form:", form);
    try {
      const res = await axios.patch(
        `${apiUrl}/users/update-account`,
        {
          username: form.username,
          fullName: form.fullName,
        },
        {
          withCredentials: true,
        }
      );
      console.log(res);
     
      setProfileData(res.data.data);
      
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error("Update failed:", err.response?.data || err.message);
      toast.error(`Update failed: ${err.response?.data?.message || err.message}`);
    }
  };

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Cover + Avatar Section */}
        <div className="relative w-full h-48 md:h-64 bg-gray-800 rounded-b-lg mb-20">
          {/* Cover image or default fallback */}
          <img
            src={profileData.coverImage || "/default-cover.jpg"}
            alt="Cover"
            className="w-full h-full object-cover"
          />

          {/* Edit Cover Image Button */}
          <label
            htmlFor="coverImageInput"
            className="absolute top-3 right-3 bg-auto bg-opacity-60 text-white text-xs px-3 py-1 rounded-full cursor-pointer hover:bg-opacity-80 transition"
            title="Change cover image"
          >
            <Pencil className="w-4 h-4 text-white" />
          </label>
          <input
            type="file"
            id="coverImageInput"
            accept="image/*"
            className="hidden"
            onChange={handleCoverImageChange}
          />

          {/* Avatar overlaid at bottom center */}
          <div className="absolute -bottom-16 left-1/2 transform -translate-x-1/2">
            <div className="relative w-32 h-32">
              <img
                src={profileData.avatar || "/default-avatar.png"}
                alt={profileData.username}
                className="w-full h-full rounded-full border-4 border-[#0F0F0F] object-cover"
              />
              {/* Edit icon on avatar */}
              <label
                htmlFor="avatarInput"
                className="absolute bottom-1 right-1 bg-blue-600 p-1.5 rounded-full border-white border-2 cursor-pointer hover:bg-blue-700 transition"
                title="Change profile picture"
              >
                <Pencil className="w-4 h-4 text-white" />
              </label>
              <input
                type="file"
                id="avatarInput"
                accept="image/*"
                className="hidden"
                onChange={handleAvatarChange}
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col md:flex-row md:items-center gap-6 mb-8">
          {/* Profile Info */}
          <div>
            {!editing ? (
              <>
                <h2 className="text-2xl font-bold">
                  {profileData.fullName.charAt(0).toUpperCase() +
                    profileData.fullName.slice(1)}
                </h2>
                <p className="text-gray-400 text-sm">@{profileData.username}</p>
                <p className="text-sm text-gray-400 mt-1">
                  {videos.length} Videos • {subscribers.length} Subscribers
                </p>
              </>
            ) : (
              <>
                <input
                  type="text"
                  value={form.username}
                  onChange={(e) =>
                    setForm({ ...form, username: e.target.value })
                  }
                  className="text-2xl bg-[#1c1c1c] text-white rounded p-2 w-full mb-1"
                  placeholder="Username"
                />

                <input
                  type="text"
                  value={form.fullName}
                  onChange={(e) =>
                    setForm({ ...form, fullName: e.target.value })
                  }
                  className="text-md bg-[#1c1c1c] text-white rounded p-2 w-full mb-1"
                  placeholder="Full Name"
                />
              </>
            )}

            <div className="mt-4 flex gap-3">
              {!editing ? (
                <>
                  <button
                    className="bg-gray-700 hover:bg-gray-600 px-5 py-1.5 rounded text-sm font-medium cursor-pointer"
                    onClick={() => setEditing(true)}
                  >
                    Customize channel
                  </button>
                  {/* <button className="bg-gray-700 hover:bg-gray-600 px-5 py-1.5 rounded text-sm font-medium">
                    Manage videos
                  </button> */}
                </>
              ) : (
                <>
                  <button
                    className="bg-blue-600 hover:bg-blue-500 px-5 py-1.5 rounded text-sm font-medium"
                    onClick={handleUpdateProfile}
                  >
                    Save Changes
                  </button>
                  <button
                    className="bg-gray-600 hover:bg-gray-500 px-5 py-1.5 rounded text-sm font-medium"
                    onClick={() => setEditing(false)}
                  >
                    Cancel
                  </button>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex space-x-6 border-b border-gray-700 text-sm mb-8">
          {["Home", "Liked", "Playlists", "Videos", "Shorts"].map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`pb-2 text-[16px] cursor-pointer ${
                activeTab === tab
                  ? "text-white border-b-2 border-white"
                  : "text-gray-400 hover:text-white hover:border-white border-b-2 border-transparent"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === "Home" && (
          <>
            {videos.length > 0 && (
              <div className="mb-6">
                <h3 className="text-xl font-semibold mb-4">Videos</h3>
                <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {videos.map((v) => (
                    <Link
                      to={`/video/${v._id}`}
                      key={v._id}
                      className="rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition w-full sm:w-auto"
                    >
                      <img
                        src={v.thumbnail}
                        alt={v.title}
                        className="w-full h-40 sm:h-28 object-cover" // h-40 on mobile, sm:h-28 for tablets+
                      />
                      <div className="p-4 sm:p-3">
                        {" "}
                        {/* more padding on mobile */}
                        <h4 className="text-base sm:text-lg font-semibold line-clamp-2">
                          {v.title}
                        </h4>
                        <p className="text-sm sm:text-xs text-gray-400 mt-1">
                          {v.views} views • {formatTimeAgo(v.createdAt)}
                        </p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* Subscribers */}
            {/* <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4">Subscribers</h3>
              <div className="flex flex-wrap gap-4">
                {subscribers.length === 0 ? (
                  <p className="text-gray-400 text-sm">No subscribers yet.</p>
                ) : (
                  subscribers.map((s) => (
                    <div
                      key={s._id}
                      className="bg-[#1c1c1c] p-3 rounded-lg flex items-center gap-3 w-64"
                    >
                      <img
                        src={s.avatar || "/default-avatar.png"}
                        alt={s.username}
                        className="w-10 h-10 rounded-full object-cover"
                      />
                      <span className="text-sm">{s.username}</span>
                    </div>
                  ))
                )}
              </div>
            </div> */}

            {/* Playlists */}
            <div className="mb-10">
              <h3 className="text-xl font-semibold mb-4">Created Playlists</h3>
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {playlists.length === 0 && (
                  <p className="text-gray-400 text-sm">
                    {" "}
                    No playlists created yet
                  </p>
                )}
                {playlists.map((pl) => {
                  if (!pl.videos || pl.videos.length === 0) return null;

                  return (
                    <Link
                      to={`/playlist/${pl._id}`}
                      key={pl._id}
                      className="rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition w-full sm:w-auto"
                    >
                      {/* Thumbnail or placeholder */}
                      {pl.videos[0]?.thumbnail ? (
                        <img
                          src={pl.videos[0].thumbnail}
                          alt={pl.name}
                          className="w-full h-40 sm:h-28 object-cover" // mobile: h-40, sm+: h-28
                        />
                      ) : (
                        <div className="w-full h-48 sm:h-40 bg-gray-700 flex items-center justify-center rounded mb-3 text-gray-400 text-sm">
                          No Thumbnail
                        </div>
                      )}

                      <div className="p-4 sm:p-3">
                        {" "}
                        {/* mobile: p-4, sm+: p-3 */}
                        <h4 className="text-base sm:text-lg font-semibold line-clamp-2">
                          {pl.name}
                        </h4>
                        <p className="text-xs text-gray-400 mt-1">
                          {pl.videos.length} videos
                        </p>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </>
        )}

        {/* Liked Videos */}
        {activeTab === "Liked" && (
          <div className="min-h-[calc(100vh-56px)] mb-10">
            <h3 className="text-xl font-semibold mb-4">Liked Videos</h3>
            {likedVideos?.filter(Boolean).length === 0 ? (
              <p className="text-gray-400 text-sm">
                You haven't liked any videos yet.
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                {likedVideos?.filter(Boolean).map(renderVideoCard)}
              </div>
            )}
          </div>
        )}

        {/* Playlists*/}
        {activeTab === "Playlists" && (
          <div className="mb-10">
            <h3 className="text-xl font-semibold mb-4">Created Playlists</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {playlists.map((pl) => {
                if (!pl.videos || pl.videos.length === 0) return null;

                return (
                  <Link
                    to={`/playlist/${pl._id}`}
                    key={pl._id}
                    className="rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition"
                  >
                    {/* Show first video's thumbnail if available */}
                    {pl.videos[0]?.thumbnail ? (
                      <img
                        src={pl.videos[0].thumbnail}
                        alt={pl.name}
                        className="w-full h-40 sm:h-28 object-cover"
                      />
                    ) : (
                      <div className="w-full h-40 sm:h-28 bg-gray-700 flex items-center justify-center rounded mb-3 text-gray-400 text-sm">
                        No Thumbnail
                      </div>
                    )}

                    <div className="p-3">
                      <h4 className="text-lg font-semibold line-clamp-2">
                        {pl.name}
                      </h4>
                      <p className="text-xs text-gray-400 mt-1">
                        {pl.videos.length} videos
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        )}

        {/* Videos */}
        {activeTab === "Videos" && (
          <div>
            <h3 className="text-xl font-semibold mb-4">Your Videos</h3>
            <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
              {videos.map((v) => (
                <Link
                  to={`/video/${v._id}`}
                  key={v._id}
                  className="rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition"
                >
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-full h-40 sm:h-28 object-cover"
                  />
                  <div className="p-3">
                    <h4 className="text-base sm:text-lg font-semibold line-clamp-2">
                      {v.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">
                      {v.views} views • {formatTimeAgo(v.createdAt)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Shorts and Posts Placeholder */}
        {["Shorts", "Posts"].includes(activeTab) && (
          <div className="text-gray-400 text-sm mt-10">
            {activeTab} feature is coming soon.
          </div>
        )}
      </div>
    </div>
  );
}

export default UserProfile;
