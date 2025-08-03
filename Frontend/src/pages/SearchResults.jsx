import { useSelector } from "react-redux";
import VideoCard from "../components/VideoCard";

export default function SearchResults() {
  const { searchResults, isLoading } = useSelector((state) => state?.video);

 // console.log("hello",useSelector((state) => state.video));
  if (isLoading) return <div className="text-white p-6">Loading...</div>;

  return (
    <div className="bg-[#0F0F0F] min-h-screen pt-16 px-4">
      <h2 className="text-white text-xl font-semibold mb-6">Search Results</h2>
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        {searchResults?.map((video) => (
          <VideoCard key={video._id} video={video} />
        ))}
      </div>
    </div>
  );
}
