// components/VideoGrid.js
import { Link } from "react-router-dom";
import { formatTimeAgo } from "../utils/timeFormat";

export default function VideoGrid({ title, videos }) {

 // console.log(videos?.[0])



  return (
    <div className="mb-10">
    <h3 className="text-xl font-semibold mb-4">{title}</h3>
    <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
      {videos?.map((item) => {
        if (!item) return null;
        return (
          <Link to={`/video/${item._id}`} key={item?._id} className="block ">
            <div className="rounded-lg overflow-hidden bg-[#181818] shadow-md hover:bg-[#222] transition-colors duration-200">
              <img
                src={item.thumbnail}
                alt={item.title}
                className="w-full aspect-video object-cover"
              />
              <div className="flex items-start gap-3 p-3">
                <img
                  src={
                    item.owner?.[0]?.avatar
                      ? item.owner?.[0]?.avatar
                      : item?.owner?.avatar
                  }
                  alt={item?.owner?.username}
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div className="text-white flex flex-col overflow-hidden">
                  <h3 className="font-semibold text-sm line-clamp-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-400">
                    {item?.owner?.username}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {item.views} views • {formatTimeAgo(item.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  </div>

)

}

