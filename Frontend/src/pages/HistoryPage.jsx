
import { useEffect, useState } from "react";
import VideoGrid from "../components/VideoGrid";
import axios from "axios";

function HistoryPage() {
  const apiUrl = import.meta.env.VITE_URL;
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const fetchHistory = async () => {
      const res = await axios.get(`${apiUrl}/history`);
	 // console.log(res?.data.data);
      setHistory(res?.data.data.data);
    };
    fetchHistory();
  }, []);

  return (
   <div className="min-h-screen bg-[#0F0F0F] text-white pt-20 px-4">
		  <div className="max-w-7xl mx-auto">
		  <VideoGrid title="Watch History" videos={history} />
		</div>
		</div>
  );
}

export default HistoryPage;
