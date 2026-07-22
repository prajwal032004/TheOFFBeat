import React, { useEffect, useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Share2, Maximize2, Minimize2, RotateCw, MessageSquare, Send, User, CheckCircle2, AlertCircle } from 'lucide-react';
import ShareModal from './ShareModal';
import { getSongComments, postSongComment } from '../services/api';

export default function VideoModal({ isOpen, onClose, videoUrl, embedId, title, songId, isShort = false }) {
  const [shareModalOpen, setShareModalOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentForm, setCommentForm] = useState({ author_name: '', author_email: '', content: '' });
  const [commentSuccess, setCommentSuccess] = useState('');
  const [commentError, setCommentError] = useState('');
  const [commentSubmitting, setCommentSubmitting] = useState(false);
  const playerContainerRef = useRef(null);

  // Extract YouTube ID
  let finalEmbedId = embedId;
  if (!finalEmbedId && videoUrl) {
    const match = videoUrl.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
    if (match) finalEmbedId = match[1];
  }

  const isVertical = isShort || (videoUrl && (videoUrl.includes('shorts') || videoUrl.includes('reel')));

  // Lock body scroll and listen for key presses / fullscreen changes
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose();
    };

    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
      document.addEventListener('fullscreenchange', handleFullscreenChange);

      // Load comments for song
      fetchComments();
    }

    return () => {
      document.body.style.overflow = 'unset';
      window.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
    };
  }, [isOpen, songId, finalEmbedId]);

  const fetchComments = async () => {
    const targetId = songId || 1;
    setCommentsLoading(true);
    try {
      const res = await getSongComments(targetId);
      setComments(res.data || []);
    } catch (err) {
      console.error('Error fetching song comments:', err);
    } finally {
      setCommentsLoading(false);
    }
  };

  const toggleNativeFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (playerContainerRef.current?.requestFullscreen) {
          await playerContainerRef.current.requestFullscreen();
        } else if (playerContainerRef.current?.webkitRequestFullscreen) {
          await playerContainerRef.current.webkitRequestFullscreen();
        }
        // Attempt mobile orientation lock to landscape
        if (window.screen?.orientation?.lock) {
          window.screen.orientation.lock('landscape').catch(() => {});
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request bypassed:', err);
    }
  };

  const handleCommentSubmit = async (e) => {
    e.preventDefault();
    setCommentSuccess('');
    setCommentError('');

    if (!commentForm.author_name.trim() || !commentForm.content.trim()) {
      setCommentError('Please fill in your Name and Comment.');
      return;
    }

    setCommentSubmitting(true);
    const targetId = songId || 1;

    try {
      const res = await postSongComment(targetId, commentForm);
      setCommentSuccess(res.data?.message || 'Comment posted successfully!');
      setCommentForm({ author_name: '', author_email: '', content: '' });
      fetchComments();
    } catch (err) {
      setCommentError(err.response?.data?.error || 'Failed to post comment.');
    } finally {
      setCommentSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const thumbnailUrl = finalEmbedId
    ? `https://img.youtube.com/vi/${finalEmbedId}/hqdefault.jpg`
    : 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80';

  const shareData = {
    title: title || (isVertical ? 'TheOFFBeat Short' : 'TheOFFBeat Video'),
    url: window.location.href,
    thumbnailUrl: thumbnailUrl,
    type: isVertical ? 'Reel' : 'Song',
    hashtags: `#TheOFFBeat ${isVertical ? '#Shorts #Reels' : '#NewMusic'} #IndianMusicDuo #DilSeLikhaBeatPeJeeya`
  };

  return (
    <>
      <AnimatePresence>
        <div className="fixed inset-0 z-50 bg-dark-950/98 backdrop-blur-2xl flex flex-col overflow-y-auto min-h-screen text-gray-200 select-none">
          
          {/* Top Sticky Header Controls Bar */}
          <div className="sticky top-0 z-30 bg-dark-900/90 border-b border-white/10 px-4 sm:px-8 py-4 backdrop-blur-md flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <span className="w-2.5 h-2.5 rounded-full bg-brand-red shadow-glow-red animate-pulse shrink-0" />
              <h2 className="text-base sm:text-xl font-black font-heading text-white uppercase tracking-tight truncate">
                {title || (isVertical ? 'TheOFFBeat Short' : 'TheOFFBeat Official Video')}
              </h2>
            </div>

            <div className="flex items-center gap-2 sm:gap-3 shrink-0">
              
              {/* Share Button */}
              <button
                onClick={() => setShareModalOpen(true)}
                className="px-3.5 py-1.5 bg-brand-red hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 shadow-glow-red transition-all cursor-pointer"
                title="Share Video"
              >
                <Share2 size={16} />
                <span className="hidden sm:inline">Share</span>
              </button>

              {/* Close Button */}
              <button
                onClick={onClose}
                className="p-2 rounded-xl bg-white/10 hover:bg-red-950 hover:text-red-300 text-white transition-colors cursor-pointer"
                aria-label="Close Video"
              >
                <X size={20} />
              </button>
            </div>

          </div>


          {/* Main Full-Screen Video Theater Stage */}
          <div className="max-w-7xl mx-auto w-full px-0 sm:px-6 lg:px-8 py-4 sm:py-8 space-y-8 flex-grow">
            
            {/* Player Container Box */}
            <div
              ref={playerContainerRef}
              className={`relative ${
                isVertical ? 'max-w-md mx-auto aspect-[9/16] min-h-[70vh]' : 'aspect-video w-full'
              } bg-black rounded-none sm:rounded-3xl overflow-hidden border border-white/10 shadow-glow-red-lg flex items-center justify-center`}
            >
              {finalEmbedId ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${finalEmbedId}?autoplay=1&rel=0&enablejsapi=1`}
                  title={title || 'TheOFFBeat Video Player'}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="text-center p-8 space-y-4">
                  <p className="text-gray-400 text-sm">Video stream link is active.</p>
                  {videoUrl && (
                    <a
                      href={videoUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red text-white font-bold text-xs uppercase rounded-full shadow-glow-red"
                    >
                      <span>OPEN VIDEO LINK</span>
                      <ExternalLink size={16} />
                    </a>
                  )}
                </div>
              )}
            </div>

            {/* Video Details & Integrated Comments Section Below Video */}
            <div className="px-4 sm:px-0 max-w-5xl mx-auto space-y-10">
              
              {/* Song Information Banner */}
              <div className="p-6 bg-dark-900 border border-white/10 rounded-3xl space-y-3 shadow-xl">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <span className="text-xs font-mono font-bold uppercase tracking-widest text-brand-red">
                    OFFICIAL RELEASE • TheOFFBeat
                  </span>
                  <span className="text-xs text-gray-400 font-mono">
                    Dil se Likha, Beat pe Jeeya...
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl font-black font-heading text-white uppercase">
                  {title || 'TheOFFBeat Track'}
                </h1>
                <p className="text-sm text-gray-300 leading-relaxed">
                  Thank you for listening! Leave your thoughts, comments, and lyrics feedback below.
                </p>
              </div>

              {/* LIVE COMMENTS & FEEDBACK SECTION BELOW VIDEO */}
              <div className="space-y-8">
                
                {/* Header */}
                <div className="flex items-center justify-between border-b border-white/10 pb-4">
                  <div className="flex items-center gap-2 text-white">
                    <MessageSquare size={20} className="text-brand-red" />
                    <h3 className="text-xl font-bold font-heading uppercase">
                      Listener Comments ({comments.length})
                    </h3>
                  </div>
                </div>

                {/* Add Comment Form */}
                <form onSubmit={handleCommentSubmit} className="bg-dark-900 border border-white/10 p-6 rounded-3xl space-y-4 shadow-xl">
                  <h4 className="text-sm font-bold uppercase text-white tracking-wide">
                    Leave a Comment
                  </h4>

                  {commentSuccess && (
                    <div className="p-3 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-xl flex items-center gap-2">
                      <CheckCircle2 size={16} />
                      <span>{commentSuccess}</span>
                    </div>
                  )}

                  {commentError && (
                    <div className="p-3 bg-red-500/10 border border-red-500/30 text-red-400 text-xs rounded-xl flex items-center gap-2">
                      <AlertCircle size={16} />
                      <span>{commentError}</span>
                    </div>
                  )}

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-gray-300 uppercase block mb-1">Your Name *</label>
                      <input
                        type="text"
                        required
                        placeholder="e.g. Ananya"
                        value={commentForm.author_name}
                        onChange={(e) => setCommentForm({ ...commentForm, author_name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-brand-red"
                      />
                    </div>

                    <div>
                      <label className="text-xs font-bold text-gray-300 uppercase block mb-1">Email / Instagram (Optional)</label>
                      <input
                        type="text"
                        placeholder="e.g. @ananya_music"
                        value={commentForm.author_email}
                        onChange={(e) => setCommentForm({ ...commentForm, author_email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-brand-red"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-bold text-gray-300 uppercase block mb-1">Your Comment *</label>
                    <textarea
                      rows={3}
                      required
                      placeholder="Share your thoughts on this video..."
                      value={commentForm.content}
                      onChange={(e) => setCommentForm({ ...commentForm, content: e.target.value })}
                      className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-brand-red leading-relaxed"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={commentSubmitting}
                    className="px-6 py-3 bg-brand-red hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-glow-red transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
                  >
                    <Send size={15} />
                    <span>{commentSubmitting ? 'POSTING...' : 'POST COMMENT'}</span>
                  </button>
                </form>

                {/* Display Comments List */}
                <div className="space-y-4">
                  {commentsLoading ? (
                    <div className="p-6 text-center text-gray-500 text-xs font-mono">
                      Loading comments...
                    </div>
                  ) : comments.length === 0 ? (
                    <div className="p-8 text-center bg-dark-900/50 border border-white/10 rounded-2xl text-gray-400 text-sm">
                      Be the first to comment on this song!
                    </div>
                  ) : (
                    comments.map((comment) => (
                      <div key={comment.id} className="p-5 bg-dark-900 border border-white/10 rounded-2xl space-y-2 shadow-md">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-brand-red/20 border border-brand-red/40 flex items-center justify-center text-brand-red text-xs font-bold">
                              {comment.author_name ? comment.author_name[0].toUpperCase() : 'U'}
                            </div>
                            <div>
                              <span className="font-bold text-white text-sm block">{comment.author_name}</span>
                              <span className="text-[10px] text-gray-500 font-mono">
                                {comment.created_at ? new Date(comment.created_at).toLocaleDateString() : 'Recent'}
                              </span>
                            </div>
                          </div>
                        </div>
                        <p className="text-xs text-gray-300 leading-relaxed bg-dark-950/60 p-3 rounded-xl border border-white/5 font-sans">
                          "{comment.content}"
                        </p>
                      </div>
                    ))
                  )}
                </div>

              </div>

            </div>

          </div>

        </div>
      </AnimatePresence>

      {/* Share Modal Overlay */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareData={shareData}
      />
    </>
  );
}
