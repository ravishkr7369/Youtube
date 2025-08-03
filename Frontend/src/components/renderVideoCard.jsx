
import { Link } from "react-router-dom";
import { formatTimeAgo } from "../utils/timeFormat";


export const renderVideoCard = (video) => (
  // Ensure video is defined before accessing properties
  <Link
    to={`/video/${video?._id}`}
    key={video?._id}
    className="rounded-lg overflow-hidden hover:bg-[#2a2a2a] transition flex flex-col sm:block"
  >
    <img
      src={video?.thumbnail}
      alt={video?.title}
      className="w-full h-40 sm:h-28 object-cover"
    />
    <div className="p-2 sm:p-3">
      <h4 className="text-base sm:text-lg font-semibold line-clamp-2">
        {video?.title}
      </h4>
      <p className="text-xs text-gray-400 mt-1">
        {video?.views} views • {formatTimeAgo(video.createdAt)}
      </p>
    </div>
  </Link>
);
