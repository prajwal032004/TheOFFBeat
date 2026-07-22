import React, { useState, useEffect } from 'react';
import { getSongComments, postSongComment } from '../services/api';
import { MessageSquare, Send, AlertTriangle, ShieldCheck, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SongComments({ songId, songTitle }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [authorName, setAuthorName] = useState('');
  const [content, setContent] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [vulgarError, setVulgarError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    async function loadComments() {
      if (!songId) return;
      try {
        setLoading(true);
        const res = await getSongComments(songId);
        setComments(res.data || []);
      } catch (err) {
        console.error('Error loading comments:', err);
      } finally {
        setLoading(false);
      }
    }
    if (isOpen) {
      loadComments();
    }
  }, [songId, isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setVulgarError('');
    setSuccessMsg('');

    if (!content.trim()) return;

    setSubmitting(true);
    try {
      const res = await postSongComment(songId, {
        author_name: authorName.trim() || 'Music Fan',
        content: content.trim()
      });

      if (res.data && res.data.comment) {
        setComments([res.data.comment, ...comments]);
        setContent('');
        setSuccessMsg('Comment posted successfully!');
        setTimeout(() => setSuccessMsg(''), 3000);
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setVulgarError(err.response.data.error);
      } else {
        setVulgarError('Failed to post comment. Please try again.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mt-4 pt-3 border-t border-white/10">
      {/* Toggle Comments Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-brand-red uppercase tracking-wider transition-colors cursor-pointer"
      >
        <MessageSquare size={14} className="text-brand-red" />
        <span>{isOpen ? 'Hide Comments' : `Comments (${comments.length > 0 ? comments.length : 'Join Chat'})`}</span>
      </button>

      {/* Collapsible Comment Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="mt-4 space-y-4 overflow-hidden"
          >
            {/* Vulgarity Warning Banner */}
            {vulgarError && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-red-950/80 border border-red-500/50 rounded-xl text-red-300 text-xs flex items-start gap-2 shadow-lg"
              >
                <AlertTriangle size={16} className="text-red-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold block uppercase tracking-wide">Vulgarity Detected</span>
                  <p>{vulgarError}</p>
                </div>
              </motion.div>
            )}

            {/* Success Banner */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-2.5 bg-emerald-950/80 border border-emerald-500/50 rounded-xl text-emerald-300 text-xs flex items-center gap-2"
              >
                <ShieldCheck size={16} className="text-emerald-400" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {/* Comment Post Form */}
            <form onSubmit={handleSubmit} className="space-y-2 bg-black/40 p-3.5 rounded-xl border border-white/5">
              <div className="flex items-center gap-2">
                <User size={14} className="text-gray-400" />
                <input
                  type="text"
                  placeholder="Your Name (Optional)"
                  value={authorName}
                  onChange={(e) => setAuthorName(e.target.value)}
                  className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-1.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red"
                  maxLength={50}
                />
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Add a respectful comment..."
                  value={content}
                  onChange={(e) => {
                    setContent(e.target.value);
                    if (vulgarError) setVulgarError('');
                  }}
                  className="w-full bg-dark-900 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-brand-red"
                  maxLength={300}
                />
                <button
                  type="submit"
                  disabled={submitting || !content.trim()}
                  className="px-3 py-2 bg-brand-red hover:bg-red-600 disabled:opacity-50 text-white rounded-lg text-xs font-bold transition-all flex items-center gap-1 shrink-0 cursor-pointer shadow-glow-red"
                >
                  <Send size={12} />
                  <span>Post</span>
                </button>
              </div>
              <p className="text-[10px] text-gray-500 italic">Automated moderation active. Inappropriate comments will be blocked.</p>
            </form>

            {/* Comment List */}
            {loading ? (
              <div className="text-center py-4 text-xs text-gray-500">Loading comments...</div>
            ) : comments.length === 0 ? (
              <div className="text-center py-4 text-xs text-gray-500 italic">
                No comments yet. Be the first to share your thoughts on {songTitle || 'this track'}!
              </div>
            ) : (
              <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1 custom-scrollbar">
                {comments.map((comment) => (
                  <div
                    key={comment.id}
                    className="p-3 bg-white/[0.03] border border-white/5 rounded-xl text-left space-y-1"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-gray-200">{comment.author_name}</span>
                      <span className="text-[10px] text-gray-500">
                        {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : 'Recently'}
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 leading-relaxed">{comment.content}</p>
                  </div>
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
