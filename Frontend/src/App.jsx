import { useEffect, useState } from "react";
import CategoryTabs from "./components/CategoryTabs";
import VideoCard from "./components/VideoCard";
import "./index.css";
import { useSelector } from "react-redux";
import { getVideos } from "./features/auth/videoSlice";

import { useDispatch } from "react-redux";
function App() {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { videos} = useSelector((state) => state?.video);
  //console.log("videos", videos);
  useEffect(() => {
    if (!user) {
      return;
    }
    dispatch(getVideos());
  }, [dispatch, user]);



  

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 px-4 pt-4">
      {videos
        ?.filter((video) => video.duration > 60)
        .map((video, index) => (
          <VideoCard key={index} video={video} />
        ))}
    </div>
  );
}

export default App;
