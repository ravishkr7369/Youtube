import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import axios from "axios";
import { useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
  ThumbsUp,
  ThumbsDown,
  Share2,
  Download,
  MoreHorizontal,
  MessageSquare,
  VolumeX,
  Volume2,
  MessageCircle,
} from "lucide-react";
import { useSelector } from "react-redux";
import CommentSection from "./CommentSection";
import { formatTimeAgo } from "../utils/timeFormat";
import { toast } from "react-toastify";

function VideoPlayer() {
  const apiUrl = import.meta.env.VITE_URL;
  const location = useLocation();

  const { id } = useParams();
  //console.log(id)
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [allVideos, setAllVideos] = useState([]);
  const [isShorts, setIsShorts] = useState(false);
  const [showMore, setShowMore] = useState(false);
  const videoRef = useRef(null);

  const [liked, setLiked] = useState(false);
  const [disliked, setDisliked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSubscribed, setIsSubscribed] = useState(false);
  const [showSharePopup, setShowSharePopup] = useState(false);

  const user = useSelector((state) => state.auth.user);
  const userId = user?._id;
  // console.log("Current User:", userId);
  const channelId = video?.owner?.[0]?._id;
  // console.log("Channel ID:", channelId);

  const fetchChannelSubscriptionStatus = async () => {
    try {
      const res = await axios.get(
        `${apiUrl}/subscriptions/status/${channelId}`,
        { withCredentials: true }
      );
      //console.log(apiUrl)
      setIsSubscribed(res.data?.data?.isSubscribed);
    } catch (err) {
      console.error("Subscription status error:", err);
    }
  };

  const toggleSubscribe = async () => {
    if (!user) return alert("Login to subscribe");

    try {
      const res = await axios.post(
        `${apiUrl}/subscriptions/c/${channelId}`,
        {},
        { withCredentials: true }
      );
      setIsSubscribed(res.data?.data?.isSubscribed);
    } catch (err) {
      console.error("Subscribe toggle failed:", err);
    }
  };

  const fetchReactionStatus = async () => {
    try {
      const res = await axios.get(`${apiUrl}/likes/v/${id}/count`, {
        withCredentials: true,
      });
      const { likeCount, isLiked, isDisliked } = res.data?.data;
      setLikeCount(likeCount);
      setLiked(!!isLiked);
      setDisliked(!!isDisliked);
    } catch (err) {
      console.error("Fetch reaction error:", err);
    }
  };

  const handleLike = async (reactionType) => {
    try {
      const res = await axios.post(
        `${apiUrl}/likes/v/${id}`,
        { reactionType },
        { withCredentials: true }
      );
      const { likeCount, isLiked, isDisliked } = res.data?.data;
      //console.log("Like response:", res.data);
      setLikeCount(likeCount);
      setLiked(!!isLiked);
      setDisliked(!!isDisliked);
    } catch (err) {
      console.error("Like toggle failed:", err);
    }
  };

  const handleDislike = async (reactionType) => {
    await handleLike(reactionType);

    // If you're on the Liked tab, remove the video from the liked list
    if (location.pathname === "/profile" && activeTab === "Liked") {
      if (onRemoveFromLiked) {
        onRemoveFromLiked(id);
      }
    }
  };

  const handleLoadedMetadata = () => {
    setIsShorts((videoRef.current?.duration || 0) < 60);
  };

  const handleDownload = async (videoUrl, title) => {
    try {
      const response = await fetch(videoUrl);
      const blob = await response.blob();

      const blobUrl = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = blobUrl;
      link.download = `${title || "video"}.mp4`;

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(blobUrl); // cleanup
    } catch (error) {
      console.error("Download failed:", error);
      alert("Download failed");
    }
  };

  const menuRef = useRef(null);
  const [selectedPlaylists, setSelectedPlaylists] = useState([]);
  const [userPlaylists, setUserPlaylists] = useState([]);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [creatingPlaylist, setCreatingPlaylist] = useState(false);
  const [newPlaylistName, setNewPlaylistName] = useState("");

  const [showComments, setShowComments] = useState(false);
  const [isSharing, setIsSharing] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const videoRefs = useRef({});

  {
    /* Handle video sharing */
  }
  const handleShare = async () => {
    if (isSharing) return;

    try {
      setIsSharing(true);

      if (navigator.share) {
        await navigator.share({
          title: video.title,
          text: "Check out this video!",
          url: window.location.href,
        });
      } else {
        navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard");
      }

      setShowSharePopup(false); // close custom popup if used
    } catch (err) {
      console.error("Sharing failed:", err);
    } finally {
      setIsSharing(false);
    }
  };

  // add video to the playlists
  const togglePlaylistSelection = async (playlistId) => {
    const isSelected = selectedPlaylists.includes(playlistId);
    try {
      const url = isSelected
        ? `${apiUrl}/playlists/remove/${id}/${playlistId}`
        : `${apiUrl}/playlists/add/${id}/${playlistId}`;

      await axios.patch(url, {}, { withCredentials: true });
      toast.success("Playlist updated successfully!");
      setSelectedPlaylists((prev) =>
        isSelected
          ? prev.filter((pid) => pid !== playlistId)
          : [...prev, playlistId]
      );
    } catch (error) {
      toast.error("Failed to update playlist");
      console.error("Failed to update playlist:", error);
    }
  };

  {
    /* Close more menu on outside click */
  }
  useEffect(() => {
    if (!showMoreMenu) return;

    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !e.target.closest(".more-btn")
      ) {
        setShowMoreMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showMoreMenu]);

  {
    /* Handle More button click */
  }
  const handleMore = async () => {
    // console.log("Clicked More button");
    //console.log("Previous state:", showMoreMenu);
    if (showMoreMenu) {
      setShowMoreMenu(false);
      return;
    }
    try {
      const res = await axios.get(`${apiUrl}/playlists/user/${userId}`, {
        withCredentials: true,
      });
      const playlists = res.data?.data || [];
      //console.log("Fetched playlists:", playlists);
      const alreadySelected = playlists
        .filter((playlist) => playlist.videos?.some((v) => v._id === id))
        .map((playlist) => playlist._id);
      setUserPlaylists(playlists);
      //console.log("Selected playlists:", alreadySelected);
      setSelectedPlaylists(alreadySelected);
      setShowMoreMenu(true);
    } catch (error) {
      console.error("Playlist fetch error:", error);
    }
  };

  {
    /* Channel subscription status */
  }
  useEffect(() => {
    if (!channelId) return;
    fetchChannelSubscriptionStatus();
  }, [video]);

  {
    /* Fetch video */
  }
  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const res = await axios.get(`${apiUrl}/videos/${id}`);
        setVideo(res?.data?.data);
      } catch (err) {
        console.error("Fetch video failed:", err);
      }
    };

    {
      /* fetch AllVideos */
    }
    const fetchAllVideos = async () => {
      try {
        const res = await axios.get(`${apiUrl}/videos`);
        setAllVideos(res.data?.data?.videos);
      } catch (err) {
        console.error("Fetch all videos failed:", err);
      }
    };
    fetchVideo();
    fetchAllVideos();
    fetchReactionStatus();
  }, [id]);

  {
    /* Set videoRef for current video */
  }
  useEffect(() => {
    const current = videoRef.current;
    if (!current) return;
    const handleEnded = () => {
      const idx = allVideos.findIndex((v) => v._id === id);
      const next = allVideos[idx + 1];
      if (next) navigate(`/video/${next._id}`);
    };
    current.addEventListener("ended", handleEnded);
    return () => current.removeEventListener("ended", handleEnded);
  }, [allVideos, id, navigate]);

  const [currentShortId, setCurrentShortId] = useState(id);
  // console.log(currentShortId)
  // console.log(id)

   useEffect(() => {
     setCurrentShortId(id);
   }, [id]);


  {
    /* Set Muted */
  }
  useEffect(() => {
    const current = videoRefs.current[currentShortId];
    if (current) current.muted = isMuted;
  }, [isMuted, currentShortId]);

  {
    /* Set currentShortId on video change */
  }
  useEffect(() => {
    if (currentShortId !== id) {
      navigate(`/video/${currentShortId}`, { replace: true });
    }
  }, [currentShortId]);

  useEffect(() => {
    if (!isShorts || window.innerWidth >= 768) return;

    const observers = [];

    allVideos
      .filter((v) => v.videoFile && v.duration < 60)
      .forEach((v) => {
        const element = document.getElementById(`short-${v._id}`);
        const video = videoRefs.current[v._id];

        if (element && video) {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setCurrentShortId(v._id);

                Object.entries(videoRefs.current).forEach(([key, vid]) => {
                  if (vid && key !== v._id) {
                    vid.pause();
                  }
                });

                video.play().catch(() => {});
              } else {
                video.pause();
              }
            },
            { threshold: 0.7 }
          );
          observer.observe(element);
          observers.push(observer);
        }
      });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, [allVideos, isMuted, isShorts]);

  if (!video) return <div className="text-white p-6">Loading...</div>;
  const owner = video.owner?.[0];
  //console.log("video owner",owner);
  //console.log(user.username)

  {
    /*for shorts videos*/
  }

  if (isShorts && window.innerWidth < 768 && allVideos.length > 0) {
    return (
      <div className="h-screen w-screen overflow-y-scroll snap-y snap-mandatory bg-black text-white">
        {allVideos
          .filter((v) => v.videoFile && v.duration < 60)
          .map((v) => {
            const isCurrent = v._id === currentShortId;
            const o = v.owner?.[0];

            return (
              <div
                key={v._id}
                id={`short-${v._id}`}
                className="h-screen w-full flex items-center justify-center relative snap-start"
              >
                <video
                  ref={(el) => {
                    if (el) videoRefs.current[v._id] = el;
                    if (isCurrent) videoRef.current = el;
                  }}
                  src={v.videoFile}
                  className="h-full w-full object-cover"
                  autoPlay={false}
                  loop
                  playsInline
                  muted={isMuted}
                  onLoadedMetadata={() => {
                    if (isCurrent)
                      setIsShorts((videoRef.current?.duration || 0) < 60);
                  }}
                  onDoubleClick={() => isCurrent && handleLike("like")}
                  onClick={() => {
                    const vid = videoRefs.current[v._id];
                    if (!vid) return;
                    vid.paused ? vid.play() : vid.pause();
                  }}
                />

                <button
                  onClick={() => setIsMuted((prev) => !prev)}
                  className="absolute top-16 right-4 z-20 bg-black/60 text-white px-3 py-1 rounded-full"
                >
                  {isMuted ? (
                    <VolumeX size={24} color="white" />
                  ) : (
                    <Volume2 size={24} color="white" />
                  )}
                </button>

                {isCurrent && (
                  <>
                    {/* Right-side action buttons */}
                    <div className="absolute right-7  bottom-40 flex flex-col items-center gap-5 z-10">
                      <button
                        onClick={() => handleLike("like")}
                        className="flex flex-col items-center"
                      >
                        <ThumbsUp
                          size={26}
                          color="white"
                          fill={liked ? "white" : "none"}
                        />
                        <span className="text-xs">{likeCount}</span>
                      </button>
                      <button
                        onClick={() => handleDislike("dislike")}
                        className="flex flex-col items-center"
                      >
                        <ThumbsDown
                          size={26}
                          color="white"
                          fill={disliked ? "white" : "none"}
                        />
                      </button>
                      <button
                        onClick={() => handleDownload(v.videoFile, v.title)}
                        className="flex flex-col items-center"
                      >
                        <Download size={26} color="white" />
                      </button>

                      <button
                        onClick={() => setShowComments(true)}
                        className="flex flex-col items-center"
                      >
                        <MessageSquare size={26} color="white" />
                      </button>
                    </div>

                    {/* Channel info */}
                    <div className="absolute bottom-20 left-3 z-10 pr-4 flex items-center justify-between w-[calc(100%-2rem)]">
                      {/* Avatar + Name + Title */}
                      <div className="flex items-center gap-4">
                        <img
                          src={o?.avatar}
                          alt={o?.username}
                          className="w-10 h-10 rounded-full object-cover border border-white"
                        />
                        <div className="flex flex-col">
                          <h3 className="text-base font-semibold">
                            {o?.username}
                          </h3>
                          <p className="text-sm text-gray-300">{v.title}</p>
                        </div>
                      </div>

                      {/* Subscribe Button */}
                      {user?._id !== o?._id && (
                        <button
                          onClick={toggleSubscribe}
                          className={`${
                            isSubscribed
                              ? "bg-[#1c1c1c] text-white border border-gray-500"
                              : "bg-white text-black"
                          } px-4 py-1 rounded-full text-sm font-semibold`}
                        >
                          {isSubscribed ? "Subscribed" : "Subscribe"}
                        </button>
                      )}
                    </div>

                    {/* Comments drawer */}
                    {showComments && (
                      <div className="absolute bottom-0 left-0 w-full h-[60%] bg-[#111111] rounded-t-2xl z-50 overflow-y-auto p-4">
                        <div className="flex justify-between items-center mb-2">
                          <h4 className="text-lg font-semibold">Comments</h4>
                          <button
                            onClick={() => setShowComments(false)}
                            className="text-sm text-gray-400"
                          >
                            Close
                          </button>
                        </div>
                        <CommentSection videoId={v._id} />
                      </div>
                    )}
                  </>
                )}
              </div>
            );
          })}
      </div>
    );
  }

  {
    /* Regular video player layout */
  }
  return (
    <div className="bg-[#0F0F0F] text-white min-h-screen pt-16">
      <div className="flex flex-col lg:flex-row gap-6 pt-4">
        <div className="flex-1">
          <video
            ref={videoRef}
            autoPlay
            controls
            onLoadedMetadata={handleLoadedMetadata}
            src={video.videoFile}
            className={`rounded-2xl mx-auto ${
              isShorts
                ? "w-full max-w-[360px] h-[640px]"
                : "w-full aspect-video max-w-full"
            }`}
          />

          {isShorts && (
            <>
              {/* Right-side action buttons */}
              <div className="absolute right-[735px] top-[63%] -translate-y-1/2 flex flex-col items-center gap-6 z-10">
                {/* Like */}
                <button
                  onClick={() => handleLike("like")}
                  className="flex flex-col items-center text-white hover:opacity-80 cursor-pointer"
                >
                  <ThumbsUp size={28} fill={liked ? "white" : "none"} />
                  <span className="text-sm">{likeCount}</span>
                </button>

                {/* Dislike */}
                <button
                  onClick={() => handleDislike("dislike")}
                  className="flex flex-col items-center text-white hover:opacity-80 cursor-pointer"
                >
                  <ThumbsDown size={28} fill={disliked ? "white" : "none"} />
                </button>

                {/* Comment */}
                <button
                  onClick={() => setShowComments(true)}
                  className="flex flex-col items-center text-white hover:opacity-80 cursor-pointer"
                >
                  <MessageCircle size={28} />
                </button>

                {/* Share */}
                <button
                  onClick={handleShare}
                  className="flex flex-col items-center text-white hover:opacity-80 cursor-pointer"
                >
                  <Share2 size={28} />
                </button>

                {/* Download */}
                <button
                  onClick={handleDownload}
                  className="flex flex-col items-center text-white hover:opacity-80"
                >
                  <Download size={28} />
                </button>
              </div>

              {/* Bottom-left channel info */}
              <div className="absolute bottom-20 left-[26%] z-10 flex items-center justify-between w-[calc(100%-5rem)]">
                <div className="flex items-center gap-4">
                  <img
                    src={owner?.avatar}
                    alt={owner?.username}
                    className="w-10 h-10 rounded-full object-cover border border-white"
                  />
                  <div className="flex flex-col">
                    <h3 className="text-base font-semibold">
                      {owner?.username}
                    </h3>
                    <p className="text-sm text-gray-300">{video.title}</p>
                  </div>
                </div>

                {/* Subscribe Button */}
                {user?._id !== owner?._id && (
                  
                  <button
                    onClick={toggleSubscribe}
                    className={`${
                      isSubscribed
                        ? "bg-[#1c1c1c] text-white border border-gray-500"
                        : "bg-white text-black"
                    } px-4 py-1 rounded-full text-sm font-semibold`}
                  >
                    {isSubscribed ? "Subscribed" : "Subscribe"}
                  </button>
                )}
              </div>

              {/* Comments drawer */}
              {showComments && (
                <div className="absolute bottom-0 left-0 w-full h-[60%] bg-[#111111] rounded-t-2xl z-50 overflow-y-auto p-4">
                  <div className="flex justify-between items-center mb-2">
                    <h4 className="text-lg font-semibold">Comments</h4>
                    <button
                      onClick={() => setShowComments(false)}
                      className="text-sm text-gray-400 cursor-pointer"
                    >
                      Close
                    </button>
                  </div>
                  <CommentSection videoId={video._id} />
                </div>
              )}
            </>
          )}

          {!isShorts && (
            <>
              <h1 className="text-lg sm:text-xl font-semibold mt-4">
                {video.title}
              </h1>

              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mt-3">
                <div className="flex items-center justify-between w-full sm:w-auto flex-wrap gap-3">
                  <div className="flex items-center gap-2">
                    <img
                      src={owner?.avatar}
                      alt={owner?.username}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                    <span className="text-md">{owner?.username}</span>
                  </div>
                  {owner?._id !== user?._id && (
                    <button
                      onClick={toggleSubscribe}
                      className={`ml-2 mr-2 ${
                        isSubscribed
                          ? "bg-[#1c1c1c] text-white hover:bg-[#222222]"
                          : "bg-white text-black hover:bg-gray-200"
                      } px-4 sm:px-6 py-1.5 sm:py-2 rounded-full font-medium cursor-pointer text-sm sm:text-base transition`}
                    >
                      {isSubscribed ? "Subscribed" : "Subscribe"}
                    </button>
                  )}
                </div>

                <div className="flex items-center justify-around flex-wrap gap-2 sm:gap-4 overflow-x-auto scrollbar-hide max-w-full w-full sm:w-auto">
                  <motion.div className="flex rounded-full bg-[#272727] px-2 md:px-6 py-1.5 sm:py-2 text-sm">
                    <button
                      onClick={() => handleLike("like")}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <ThumbsUp
                        size={22}
                        color="#ffffff"
                        fill={liked ? "#ffffff" : "none"}
                      />
                      {likeCount}
                    </button>
                    <span className="px-2 text-[18px]">|</span>
                    <button
                      onClick={() => handleDislike("dislike")}
                      className="flex items-center gap-1 cursor-pointer"
                    >
                      <ThumbsDown
                        size={22}
                        color="#ffffff"
                        fill={disliked ? "#ffffff" : "none"}
                      />
                    </button>
                  </motion.div>

                  <motion.button
                    onClick={handleShare}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-xs sm:text-sm"
                  >
                    <Share2 size={18} /> Share
                  </motion.button>

                  <motion.button
                    onClick={handleDownload}
                    className="flex items-center gap-1 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full bg-[#272727] hover:bg-[#3f3f3f] text-xs sm:text-sm"
                  >
                    <Download size={18} /> Download
                  </motion.button>

                  <div className="relative">
                    <motion.button
                      className="more-btn flex items-center justify-center w-10 h-10 rounded-full bg-[#272727] hover:bg-[#3f3f3f] transition cursor-pointer"
                      whileTap={{ scale: 0.95 }}
                      onClick={handleMore}
                    >
                      <MoreHorizontal size={20} color="white" />
                    </motion.button>

                    {showMoreMenu && (
                      <div
                        ref={menuRef}
                        className="fixed right-4 top-32 lg:right-[470px] lg:top-[430px] w-[230px] max-h-[70vh] bg-[#1f1f1f] text-white rounded-xl shadow-xl border border-[#444] overflow-y-auto z-[9999]"
                      >
                        <div className="p-4 pb-3 border-b border-[#333] flex justify-between items-center">
                          <h3 className="text-md font-semibold">
                            Save video to...
                          </h3>
                          <button
                            onClick={() => setShowMoreMenu(false)}
                            className="text-gray-400 hover:text-white text-xl font-bold cursor-pointer"
                          >
                            ×
                          </button>
                        </div>

                        {/* Playlist List */}
                        <div className="p-4 pt-2 flex flex-col gap-3">
                          {userPlaylists.length === 0 && (
                            <p className="text-gray-400 text-sm">
                              No playlists found.
                            </p>
                          )}

                          {userPlaylists.map((playlist) => (
                            <label
                              key={playlist._id}
                              className="flex items-center justify-between gap-2 cursor-pointer hover:bg-[#2a2a2a] px-3 py-2 rounded"
                            >
                              <div className="flex items-center gap-3">
                                <input
                                  type="checkbox"
                                  checked={selectedPlaylists.includes(
                                    playlist._id
                                  )}
                                  onChange={() =>
                                    togglePlaylistSelection(playlist._id)
                                  }
                                  className="w-4 h-4 accent-white"
                                />
                                <span className="text-sm">{playlist.name}</span>
                              </div>
                            </label>
                          ))}
                        </div>

                        {/* New Playlist Button */}
                        <div className="border-t border-[#333] p-4 pt-3">
                          {creatingPlaylist ? (
                            <form
                              onSubmit={async (e) => {
                                e.preventDefault();
                                if (!newPlaylistName.trim()) return;

                                try {
                                  const res = await axios.post(
                                    `${apiUrl}/playlists`,
                                    { name: newPlaylistName },
                                    { withCredentials: true }
                                  );

                                  const created = res.data?.data;

                                  
                                  await axios.patch(
                                    `${apiUrl}/playlists/add/${id}/${created._id}`,
                                    {},
                                    { withCredentials: true }
                                  );

                                  setUserPlaylists((prev) => [
                                    ...prev,
                                    created,
                                  ]);
                                  setSelectedPlaylists((prev) => [
                                    ...prev,
                                    created._id,
                                  ]);
                                  toast.success(
                                    "Playlist created and video added!"
                                  );
                                  setCreatingPlaylist(false);
                                  setNewPlaylistName("");
                                } catch (err) {
                                  toast.error("Failed to create playlist");
                                  console.error(
                                    "Failed to create playlist:",
                                    err
                                  );
                                }
                              }}
                              className="flex items-center gap-2"
                            >
                              <input
                                type="text"
                                placeholder="New playlist name"
                                value={newPlaylistName}
                                onChange={(e) =>
                                  setNewPlaylistName(e.target.value)
                                }
                                className="w-full p-2 rounded bg-[#2a2a2a] text-white text-sm outline-none border border-[#444]"
                              />
                              <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-600 px-3 py-1 text-sm rounded text-white"
                              >
                                Save
                              </button>
                            </form>
                          ) : (
                            <button
                              onClick={() => setCreatingPlaylist(true)}
                              className="w-full bg-[#333] hover:bg-[#444] px-4 py-2 rounded-full text-white text-sm flex justify-center items-center gap-2 cursor-pointer"
                            >
                              <span className="text-sm">＋</span> New playlist
                            </button>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="bg-[#1c1c1c] mt-4 p-4 rounded-lg text-sm text-gray-300">
                <div className="text-gray-400 mb-2">
                  {video.views} views • {formatTimeAgo(video.createdAt)}
                </div>
                <p>
                  {showMore
                    ? video.description
                    : video.description?.slice(0, 200)}
                  {video.description?.length > 200 && (
                    <button
                      className="text-blue-400 ml-2 cursor-pointer"
                      onClick={() => setShowMore(!showMore)}
                    >
                      {showMore ? "Show Less" : "Show More"}
                    </button>
                  )}
                </p>
              </div>

              <CommentSection videoId={id} />
            </>
          )}
        </div>


          {/*suggestion videos */}
        <div className="lg:w-[410px] w-full flex flex-col gap-3">
          {allVideos
            .filter((v) => v._id !== id)
            .map((v) => {
              const o = v.owner?.[0];
              return (
                <Link
                  to={`/video/${v._id}`}
                  key={v._id}
                  className="flex gap-3 p-2 rounded-lg hover:bg-[#1c1c1c] transition"
                >
                  <img
                    src={v.thumbnail}
                    alt={v.title}
                    className="w-[130px] sm:w-[180px] h-[80px] sm:h-[100px] rounded-lg object-cover"
                  />
                  <div className="flex flex-col overflow-hidden">
                    <h3 className="text-sm font-medium line-clamp-2">
                      {v.title}
                    </h3>
                    <p className="text-xs text-gray-400">{o?.username}</p>
                    <p className="text-xs text-gray-500 truncate">
                      {v.views} views • {formatTimeAgo(v.createdAt)}
                    </p>
                  </div>
                </Link>
              );
            })}
        </div>

      </div>
    </div>
  );
}

export default VideoPlayer;
