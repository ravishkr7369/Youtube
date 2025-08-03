import axios from "axios";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { MoreHorizontal } from "lucide-react";
import { formatTimeAgo } from "../utils/timeFormat";

function PlaylistsPage() {
  const apiURL = import.meta.env.VITE_URL;
  const [playlists, setPlaylists] = useState([]);
  const [menuOpenId, setMenuOpenId] = useState(null);
  const [modalData, setModalData] = useState(null);
  const [modalType, setModalType] = useState("");
  const [newName, setNewName] = useState("");

  const user = useSelector((state) => state.auth.user);

  useEffect(() => {
    async function fetchPlaylists() {
      const res = await axios.get(
        `${apiURL}/playlists/user/${user?._id}`
      );
      setPlaylists(res?.data.data);
      //console.log("Playlists fetched:", res.data.data); 
    }
    if (user?._id) fetchPlaylists();
  }, [user]);

  const handleMenuToggle = (playlistId) => {
    setMenuOpenId((prev) => (prev === playlistId ? null : playlistId));
  };

  const handleOpenModal = (type, playlist) => {
    setModalType(type);
    setModalData(playlist);
    if (type === "update") setNewName(playlist.name);
    setMenuOpenId(null);
  };

  const handleCloseModal = () => {
    setModalData(null);
    setModalType("");
    setNewName("");
  };

  const handleDelete = async () => {
    try {
      await axios.delete(
        `${apiURL}/playlists/${modalData._id}`
      );
      setPlaylists((prev) => prev.filter((p) => p._id !== modalData._id));
      handleCloseModal();
    } catch (err) {
      console.error("Delete failed", err);
    }
  };

  const handleUpdate = async () => {
    try {
      const res = await axios.patch(
        `${apiURL}/playlists/${modalData._id}`,
        { name: newName }
      );
      setPlaylists((prev) =>
        prev.map((p) =>
          p._id === modalData._id ? { ...p, name: res.data.data.name } : p
        )
      );
      handleCloseModal();
    } catch (err) {
      console.error("Update failed", err);
    }
  };

  return (
    <div className="relative">
      <div className="m-20">
        <h2 className="text-2xl font-bold mb-6">Your Playlists</h2>
        {playlists.length === 0 && (
          <p className="text-gray-400 text-sm">
            No playlists created yet.
          </p>
        )}
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {playlists?.map((pl) => {
            if (!pl.videos || pl.videos.length === 0) return null;

            const firstVideo = pl.videos[0];

            return (
              <div
                key={pl._id}
                className="relative bg-[#1c1c1c] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition flex flex-col justify-between"
              >
                <Link to={`/playlist/${pl._id}`}>
                  {firstVideo?.thumbnail ? (
                    <img
                      src={firstVideo.thumbnail}
                      alt={pl.name}
                      className="w-full h-40 object-cover"
                    />
                  ) : (
                    <div className="w-full h-40 bg-gray-700 flex items-center justify-center text-gray-400 text-sm">
                      No Thumbnail
                    </div>
                  )}
                  <div className="flex flex-col gap-1 p-3">
                    <h4 className="text-lg font-semibold line-clamp-2 truncate">
                      {pl.name}
                    </h4>
                    <div className="flex gap-3">
                      <p className="text-xs text-gray-400">
                        {pl.videos.length} videos
                      </p>
                      <p className="text-xs text-gray-400 truncate">
                       {formatTimeAgo(pl.createdAt)}
                      </p>
                    </div>
                  </div>
                </Link>

                {/* Bottom right menu */}
                <div className="absolute bottom-7 right-2 z-10">
                  <button
                    onClick={() => handleMenuToggle(pl._id)}
                    className="p-1 hover:bg-gray-700 rounded"
                  >
                    <MoreHorizontal size={20} color="white" />
                  </button>

                  {menuOpenId === pl._id && (
                    <div className="absolute right-0 bottom-8 bg-[#2a2a2a] border border-gray-600 rounded shadow z-20">
                      <button
                        onClick={() => handleOpenModal("update", pl)}
                        className="block px-4 py-2 text-sm text-white hover:bg-gray-700 w-full text-left cursor-pointer"
                      >
                        Update
                      </button>
                      <button
                        onClick={() => handleOpenModal("delete", pl)}
                        className="block px-4 py-2 text-sm text-red-500 hover:bg-gray-700 w-full text-left cursor-pointer"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Floating Popup Modal */}
      {modalData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center pointer-events-none">
          <div className="bg-[#1c1c1c] p-6 rounded-lg shadow-lg text-white w-full max-w-sm pointer-events-auto z-50 border border-gray-700">
            {modalType === "delete" ? (
              <>
                <h3 className="text-lg font-semibold mb-4 text-red-400 ">
                  Delete Playlist
                </h3>
                <p className="mb-6 text-sm">
                  Are you sure you want to delete "
                  <strong>{modalData.name}</strong>"?
                </p>
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded bg-gray-600 cursor-pointer hover:bg-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleDelete}
                    className="px-4 py-2 rounded bg-red-600 cursor-pointer hover:bg-red-700 text-sm"
                  >
                    Delete
                  </button>
                </div>
              </>
            ) : (
              <>
                <h3 className="text-lg font-semibold mb-4 text-blue-400">
                  Update Playlist
                </h3>
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full p-2 rounded bg-[#2a2a2a] text-white mb-4 border border-gray-600 focus:outline-none"
                  placeholder="Playlist name"
                />
                <div className="flex justify-end space-x-3">
                  <button
                    onClick={handleCloseModal}
                    className="px-4 py-2 rounded bg-gray-600 cursor-pointer hover:bg-gray-700 text-sm"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleUpdate}
                    className="px-4 py-2 rounded bg-blue-600 cursor-pointer hover:bg-blue-700 text-sm"
                  >
                    Change
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default PlaylistsPage;
