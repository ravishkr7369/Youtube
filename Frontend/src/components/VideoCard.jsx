// components/VideoCard.jsx
import React from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { formatTimeAgo } from "../utils/timeFormat";

export default function VideoCard({ video }) {
  const apiUrl = import.meta.env.VITE_URL;
  const owner = video.owner?.[0];
  const videoId = video._id;
  //console.log("VideoCard", videoId, video);

  // console.log("History");
  //  console.log("video",video)

  const addToHistory = async () => {
    await axios.post(`${apiUrl}/history/add`, {
      videoId: video._id,
    });

    // console.log("Video added to history:", video._id);
  };

  return (
    <Link
      to={video.duration < 60 ? `/shorts/${video._id}` : `/video/${video._id}`}
    >
      <div className="rounded-lg overflow-hidden bg-[#181818] shadow-md hover:bg-[#222] transition-colors duration-200">
        <img
          src={video.thumbnail}
          alt={video.title}
          className="w-full aspect-video object-cover"
        />
        <div className="flex items-start gap-3 p-3">
          <img
            src={owner?.avatar}
            alt={owner?.username}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="text-white flex flex-col overflow-hidden">
            <h3 className="font-semibold text-sm line-clamp-2">
              {video.title}
            </h3>
            <p className="text-xs text-gray-400">{owner?.username}</p>
            <p className="text-xs text-gray-500 truncate">
              {video.views} views • {formatTimeAgo(video.createdAt)}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
