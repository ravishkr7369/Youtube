// pages/Shorts.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import VideoCard from "../components/VideoCard"; // reuse the component
import { formatTimeAgo } from "../utils/timeFormat";

function Shorts() {
  const apiURL = import.meta.env.VITE_URL;
  const [shorts, setShorts] = useState([]);

  useEffect(() => {
    const fetchShorts = async () => {
      try {
        const res = await axios.get(`${apiURL}/videos`);
        // filter: either use duration or a flag like `isShort`
        const all = res?.data?.data?.videos || [];
        const shortsOnly = all.filter((v) => v.duration <= 60 || v.isShort);
        setShorts(shortsOnly);
      } catch (err) {
        console.error("Failed to fetch shorts:", err.message);
      }
    };

    fetchShorts();
  }, []);

  return (
    <div className="min-h-screen bg-[#0F0F0F] pt-16 text-white px-4">
      <h2 className="text-2xl font-semibold mb-4">Shorts</h2>
      {shorts.length === 0 ? (
        <p className="text-gray-400 text-sm">No shorts found.</p>
      ) : (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {shorts.map((video) => (
            <VideoCard key={video._id} video={video} />
          ))}
        </div>
      )}
    </div>
  );
}

export default Shorts;
