import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { formatTimeAgo } from "../utils/timeFormat";

function Playlist() {
  const apiURL = import.meta.env.VITE_URL;
  const { id } = useParams();
  const [playlist, setPlaylist] = useState(null);

  useEffect(() => {
    const fetchPlaylist = async () => {
      try {
        const res = await axios.get(
          `${apiURL}/playlists/${id}`
        );
        setPlaylist(res.data?.data);
      } catch (err) {
        console.error("Failed to fetch playlist", err);
      }
    };

    fetchPlaylist();
  }, [id]);

  if (!playlist) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pt-20 px-4">
      {playlist.videos.length === 0 && (
        <div className="text-gray-400 text-center py-10">
          <h2 className="text-2xl font-semibold mb-4">
            No videos in this playlist
          </h2>
        </div>
      )}
      <div className="max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold mb-2">{playlist.name}</h2>
        <p className="text-gray-400 mb-6">{playlist.videos.length} Videos</p>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {playlist.videos.map((video) => (
            <Link
              key={video._id}
              to={`/video/${video._id}`}
              className="bg-[#1c1c1c] rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition"
            >
              <img
                src={video.thumbnail}
                alt={video.title}
                className="w-full h-40 sm:h-28 object-cover"
              />
              <div className="p-3">
                <h4 className="text-lg font-semibold line-clamp-2">
                  {video.title}
                </h4>
                <p className="text-xs text-gray-400 mt-1">
                  {video.views} views • {formatTimeAgo(video.createdAt)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Playlist;
