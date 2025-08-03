import React from "react";

function ShortsCard({ short }) {
  return (
    <div className="rounded-md shadow-lg border border-gray-700 overflow-hidden flex flex-col">
      <img
        src={short.thumbnail}
        alt={short.title}
        className="w-full block aspect-[9/16] object-cover"
      />
      <div className="p-3">
        <p className="font-bold text-sm line-clamp-2">{short.title}</p>
        <p className="text-xs text-gray-500">{short.views} views</p>
      </div>
    </div>
  );
}

export default ShortsCard;
