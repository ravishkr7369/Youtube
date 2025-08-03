import React, { useEffect } from 'react'
import { useDispatch,useSelector } from 'react-redux'
import { getVideos } from "../features/auth/videoSlice";
import VideoGrid from '../components/VideoGrid';

const YourVideos = () => {
const dispatch=useDispatch();

 const user = useSelector((state) => state?.auth?.user);
 let videos = useSelector((state) => state.video.videos || []);

 videos = videos.filter((v) => v?.owner?.[0]._id===user?._id);

//  console.log("videos", videos);


useEffect(()=>{
if(!user){
	return ;
}

dispatch(getVideos());
},[dispatch,user])
  return (
	<div className="min-h-screen bg-[#0F0F0F] text-white pt-20 px-4">
		  <div className="max-w-7xl mx-auto">
		  <VideoGrid title="Your Videos" videos={videos} />
		</div>
		
		</div>
  )
}

export default YourVideos
