
import React, { useEffect, useState } from "react";
import VideoGrid from "../components/VideoGrid";
import axios from "axios";

function LikedVideosPage() {
  const apiUrl = import.meta.env.VITE_URL;
  const [LikedVideos, setLikedVideos] = useState([]);

  useEffect(() => {
    const fetchLiked = async () => {
      const res = await axios.get(
        `${apiUrl}/likes/videos`
      );

	// console.log("liked",res?.data?.data.likedVideos);
      setLikedVideos(res?.data?.data);
      
    };
    fetchLiked(); 
  }, []);

  

  return (
    <div className="min-h-screen bg-[#0F0F0F] text-white pt-20 px-4">
      <div className="max-w-7xl mx-auto">
        
        <VideoGrid title="Liked Videos" videos={LikedVideos?.likedVideos?.map(v => v.video)} />
  
      </div>
    </div>
  );
}

export default LikedVideosPage;
