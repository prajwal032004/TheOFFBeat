import React, { useState } from 'react';
import { Play, Instagram, Youtube, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import ShareModal from './ShareModal';

export default function ReelCard({ reel, onPlayClick }) {
  const [shareModalOpen, setShareModalOpen] = useState(false);

  if (!reel) return null;

  const isYoutube = reel.reel_url && (reel.reel_url.includes('youtube') || reel.reel_url.includes('youtu.be'));

  // Extract YouTube ID if Youtube Short
  const getEmbedId = (reel) => {
    if (!reel.reel_url) return null;
    const match = reel.reel_url.match(/(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|shorts\/|watch\?.+&v=))([\w-]{11})/);
    return match ? match[1] : null;
  };

  const youtubeId = getEmbedId(reel);
  const thumbnailUrl = (isYoutube && youtubeId)
    ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg`
    : (reel.thumbnail_url || "https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?auto=format&fit=crop&w=600&h=1066&q=80");

  const handleClick = (e) => {
    if (onPlayClick) {
      e.preventDefault();
      onPlayClick(reel);
    }
  };

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShareModalOpen(true);
  };

  const reelTitle = reel.title || reel.caption || 'TheOFFBeat Short';

  const shareData = {
    title: reelTitle,
    url: `${window.location.origin}/reels?reelId=${reel.id}`,
    thumbnailUrl: thumbnailUrl,
    type: 'Reel',
    hashtags: `#TheOFFBeat #Shorts #Reels #DilSeLikhaBeatPeJeeya #${reelTitle.replace(/\s+/g, '')}`
  };

  return (
    <>
      <motion.div
        onClick={handleClick}
        whileHover={{ y: -6, scale: 1.02 }}
        transition={{ duration: 0.3 }}
        className="group relative block aspect-[9/16] w-full rounded-2xl overflow-hidden bg-dark-900 border border-white/10 hover:border-brand-red/50 shadow-lg cursor-pointer select-none"
      >
        {/* Thumbnail */}
        <img
          src={thumbnailUrl}
          alt={reelTitle}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          loading="lazy"
        />

        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:bg-black/40 transition-all duration-300" />

        {/* Share Button (Opens Share Modal) at top-left */}
        <button
          onClick={handleShareClick}
          title="Share Reel (WhatsApp, Instagram, Twitter, etc.)"
          className="absolute top-3 left-3 z-20 p-2 rounded-full bg-black/70 backdrop-blur-md text-gray-200 hover:text-white hover:bg-brand-red border border-white/10 transition-all cursor-pointer flex items-center justify-center shadow-md hover:shadow-glow-red"
        >
          <Share2 size={14} />
        </button>

        {/* Platform Badge (YouTube Shorts or Instagram) at top-right */}
        <div className="absolute top-3 right-3 z-10 p-2 rounded-full bg-black/60 backdrop-blur-md text-white border border-white/10 group-hover:bg-brand-red transition-colors">
          {isYoutube ? <Youtube size={16} className="text-red-500 group-hover:text-white" /> : <Instagram size={16} />}
        </div>

        {/* Animated Play Button Icon */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="w-12 h-12 rounded-full bg-brand-red/90 text-white flex items-center justify-center shadow-glow-red transform scale-90 opacity-80 group-hover:scale-110 group-hover:opacity-100 transition-all duration-300">
            <Play size={20} className="fill-white translate-x-0.5" />
          </div>
        </div>

        {/* Caption Bottom Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 text-left">
          {reel.title && (
            <h4 className="text-sm font-bold font-heading text-white uppercase tracking-wider line-clamp-1">
              {reel.title}
            </h4>
          )}
          {reel.caption && (
            <p className="text-xs text-gray-300 mt-1 line-clamp-2 leading-relaxed">
              {reel.caption}
            </p>
          )}
        </div>
      </motion.div>

      {/* Share Modal Dialog */}
      <ShareModal
        isOpen={shareModalOpen}
        onClose={() => setShareModalOpen(false)}
        shareData={shareData}
      />
    </>
  );
}
