import React from "react";

function CategoryTabs() {
  const categories = [
    "All",
    "Music",
    "Movies",
    "T-Series",
    "Live",
    "Indian Premier League",
    "News",
    "Indian pop",
  ];

  return (
    <div className="flex justify-center overflow-x-auto py-2 border-b border-gray-300">
      {categories.map((category, index) => (
        <button
          key={index}
          className="bg-[#3B3B3B] text-gray-50 border border-gray-300 rounded-3xl px-4 py-1 mr-2 whitespace-nowrap hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-400"
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;
