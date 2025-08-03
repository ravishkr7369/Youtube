// components/UploadVideoModal.jsx
import React, { useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

function UploadVideoModal({ onClose }) {
  const apiUrl = import.meta.env.VITE_URL;
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [videoFile, setVideoFile] = useState(null);
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!title || !description || !videoFile || !thumbnailFile) {
      alert("Please fill all fields and select both files.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("videoFile", videoFile);
    formData.append("thumbnail", thumbnailFile);

    try {
      setLoading(true);
      const response = await axios.post(`${apiUrl}/videos`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log("Upload success:", response.data);
      toast.success("Video uploaded successfully!");
      //alert("Video uploaded successfully!");
      onClose(); // Close modal on success
    } catch (error) {
      console.error("Upload failed:", error.response?.data || error.message);
      toast.error(`Upload failed: ${error.response?.data?.message || error.message}`);
      //alert("Failed to upload video.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-[#121212] text-white p-6 rounded-lg w-full max-w-xl relative">
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-white text-xl hover:text-gray-300 cursor-pointer"
        >
          ✕
        </button>
        <h2 className="text-xl font-semibold mb-4">Upload Video</h2>

        <form className="space-y-4" onSubmit={handleUpload}>
          <input
            type="text"
            placeholder="Title"
            className="w-full p-2 bg-[#222] rounded text-white"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
          <textarea
            placeholder="Description"
            className="w-full p-2 bg-[#222] rounded text-white"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          ></textarea>

          <div className="space-y-2">
            <label className="block">Select Video:</label>
            <input
              type="file"
              accept="video/*"
              className="w-full p-2 bg-[#222] rounded text-white"
              onChange={(e) => setVideoFile(e.target.files[0])}
              required
            />
          </div>

          <div className="space-y-2">
            <label className="block">Select Thumbnail:</label>
            <input
              type="file"
              accept="image/*"
              className="w-full p-2 bg-[#222] rounded text-white"
              onChange={(e) => setThumbnailFile(e.target.files[0])}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700 w-full"
          >
            {loading ? "Uploading..." : "Upload"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UploadVideoModal;
