import React, { useEffect, useState } from "react";
import { ThumbsUp, Trash2, Edit3, Save, X } from "lucide-react";
import axios from "axios";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";


function formatTimeAgo(dateString) {
  const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);
  const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
  if (seconds < 5) return "Now";
  if (seconds < 60) return rtf.format(-seconds, "second");
  const minutes = seconds / 60;
  if (minutes < 60) return rtf.format(-Math.floor(minutes), "minute");
  const hours = minutes / 60;
  if (hours < 24) return rtf.format(-Math.floor(hours), "hour");
  const days = hours / 24;
  return rtf.format(-Math.floor(days), "day");
}

export default function CommentSection({ videoId }) {
  const apiUrl = import.meta.env.VITE_URL;
  const user = useSelector((state) => state.auth.user);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingCommentId, setEditingCommentId] = useState(null);
  const [editText, setEditText] = useState("");

  const fetchComments = async () => {
      const apiUrl = import.meta.env.VITE_URL;
    try {
      const res = await axios.get(`${apiUrl}/comments/${videoId}`);
      setComments(res?.data?.data?.comments || []);
    } catch (err) {
      console.error("Failed to fetch comments:", err);
    }
  };

  const handleCommentSubmit = async () => {
    if (!user) return alert("Login to comment");
    if (!newComment.trim()) return;

    try {
      const res = await axios.post(
        `${apiUrl}/comments/${videoId}`,
        { text: newComment.trim() },
        { withCredentials: true }
      );
      setNewComment("");
      setComments([res?.data?.data?.comment, ...comments]);
    } catch (err) {
      console.error("Failed to post comment:", err);
    }
  };

const handleDelete = async (commentId) => {
  const result = await Swal.fire({
    title: "Delete this comment?",
    text: "This action cannot be undone!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Yes, delete it!",
  });

  if (result.isConfirmed) {
    try {
      await axios.delete(`${apiUrl}/comments/c/${commentId}`, {
        withCredentials: true,
      });
      setComments(comments.filter((c) => c._id !== commentId));
      Swal.fire("Deleted!", "Your comment has been deleted.", "success");
    } catch (err) {
      console.error("Delete failed:", err);
      Swal.fire("Error!", "Something went wrong.", "error");
    }
  }
};


  const handleEdit = (comment) => {
    setEditingCommentId(comment._id);
    setEditText(comment.content);
  };

  const handleUpdate = async (commentId) => {
    if (!editText.trim()) return;
    try {
      const res = await axios.patch(
        `${apiUrl}/comments/c/${commentId}`,
        { text: editText.trim() },
        { withCredentials: true }
      );
      setComments(
        comments.map((c) =>
          c._id === commentId ? { ...c, content: editText.trim() } : c
        )
      );
      setEditingCommentId(null);
      setEditText("");
    } catch (err) {
      console.error("Update failed:", err);
    }
  };

  useEffect(() => {
    fetchComments();
  }, [videoId]);

  return (
    <div className="mt-4">
      <h2 className="text-white text-lg mb-4">{comments.length} Comments</h2>

      <div className="flex gap-3 mb-4">
        <img
          src={user?.avatar || "/default-avatar.png"}
          alt="user"
          className="w-10 h-10 rounded-full object-cover"
        />
        <div className="flex-1">
          <textarea
            rows="2"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            className="w-full bg-[#1f1f1f] text-white p-2 rounded-md resize-none"
            placeholder="Add a comment..."
          />
          <div className="text-right mt-2">
            <button
              onClick={handleCommentSubmit}
              className="bg-blue-600 hover:bg-blue-700 px-4 py-1 rounded-md text-sm"
            >
              Comment
            </button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {comments?.map((c) => (
          <div key={c?._id} className="flex gap-3">
            <img
              src={c?.owner?.avatar || "/default-avatar.png"}
              alt="avatar"
              className="w-9 h-9 rounded-full object-cover"
            />
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-sm font-semibold">
                  @{c?.owner?.username}
                </span>
                <span className="text-xs text-gray-400">
                  {formatTimeAgo(c?.createdAt)}
                </span>
              </div>

              {/* Edit Mode */}
              {editingCommentId === c._id ? (
                <>
                  <textarea
                    className="w-full bg-[#1f1f1f] text-white p-2 rounded-md resize-none mt-1"
                    value={editText}
                    onChange={(e) => setEditText(e.target.value)}
                  />
                  <div className="flex gap-2 mt-1 text-sm">
                    <button
                      onClick={() => handleUpdate(c._id)}
                      className="text-blue-500 hover:underline flex items-center gap-1"
                    >
                      <Save size={14} /> Save
                    </button>
                    <button
                      onClick={() => {
                        setEditingCommentId(null);
                        setEditText("");
                      }}
                      className="text-gray-400 hover:text-red-400 flex items-center gap-1"
                    >
                      <X size={14} /> Cancel
                    </button>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-sm mt-1">{c?.content}</p>
                  <div className="flex items-center gap-2 text-gray-400 text-xs mt-1">
                    <ThumbsUp size={16} /> Like
                    {/* Only show Edit/Delete if comment belongs to user */}
                    {c?.owner?._id === user?._id && (
                      <>
                        <button
                          onClick={() => handleEdit(c)}
                          className="hover:text-white flex items-center gap-1 ml-4"
                        >
                          <Edit3 size={14} /> Edit
                        </button>
                        <button
                          onClick={() => handleDelete(c._id)}
                          className="hover:text-white flex items-center gap-1"
                        >
                          <Trash2 size={14} /> Delete
                        </button>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
