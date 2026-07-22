import React, { useState, useEffect } from 'react';
import { Play, Clock, Calendar, Youtube, VolumeX, ChevronDown, ChevronUp, Share2 } from 'lucide-react';
import { motion } from 'framer-motion';
import SongComments from './SongComments';
import ShareModal from './ShareModal';

export default function SongCard({ song, onPlayClick }) {
  const [isHovered, setIsHovered] = useState(false);
  const [showPreview, setShowPreview] = useState(false);
  const [isDescExpanded, setIsDescExpanded] = useState(false);
  const [shareModalOpen, setShareModalOpen] = useState(false);

  if (!song) return null;

  const getEmbedId = (song) => {
    if (song.youtube_embed_id) return song.youtube_embed_id;
    if (song.youtube_url) {
      const match = song.youtube_url.match(/(?:v=|\/|be\/|embed\/)([a-zA-Z0-9_-]{11})/);
      return match ? match[1] : null;
    }
    return null;
  };

  const embedId = getEmbedId(song);
  const thumbnailUrl = embedId
    ? `https://img.youtube.com/vi/${embedId}/hqdefault.jpg`
    : song.thumbnail_url || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80";

  useEffect(() => {
    let timer;
    if (isHovered && embedId) {
      timer = setTimeout(() => {
        setShowPreview(true);
      }, 350);
    } else {
      setShowPreview(false);
    }
    return () => clearTimeout(timer);
  }, [isHovered, embedId]);

  const handleShareClick = (e) => {
    e.stopPropagation();
    setShareModalOpen(true);
  };

  const shareData = {
    title: song.title,
    url: `${window.location.origin}/music?songId=${song.id}`,
    thumbnailUrl: thumbnailUrl,
    type: 'Song',
    hashtags: `#TheOFFBeat #${song.title.replace(/\s+/g, '')} #NewMusic #IndianMusicDuo #DilSeLikhaBeatPeJeeya`
  };

  return (
    <>
      <motion.div
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        whileHover={{ y: -6 }}
        transition={{ duration: 0.3 }}
        className="group relative bg-dark-900/80 border border-white/10 hover:border-brand-red/40 rounded-2xl overflow-hidden shadow-xl transition-all duration-300 flex flex-col h-full"
      >
        {/* Thumbnail & Silent Video Preview Container */}
        <div className="relative aspect-video w-full overflow-hidden bg-dark-950">
          {showPreview && embedId ? (
            <div className="absolute inset-0 w-full h-full pointer-events-none">
              <iframe
                src={`https://www.youtube.com/embed/${embedId}?autoplay=1&mute=1&controls=0&loop=1&playlist=${embedId}&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
                title={`${song.title} Preview`}
                className="w-full h-full object-cover scale-135"
                allow="autoplay; encrypted-media"
              />
              {/* Silent Badge */}
              <div className="absolute top-3 right-3 px-2 py-1 bg-black/80 backdrop-blur-md rounded-md border border-white/10 flex items-center gap-1 text-[10px] font-mono font-bold text-gray-300 z-10">
                <VolumeX size={12} className="text-brand-red" />
                <span>PREVIEW</span>
              </div>
            </div>
          ) : (
            <img
              src={thumbnailUrl}
              alt={song.title}
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              loading="lazy"
            />
          )}

          {/* Overlay gradient */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-black/30 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

          {/* NEW Badge */}
          {song.is_latest && (
            <span className="absolute top-3 left-3 px-2.5 py-1 bg-brand-red text-white text-[10px] font-extrabold uppercase tracking-wider rounded-md shadow-glow-red z-10">
              NEW
            </span>
          )}

          {/* Play Button Overlay */}
          <button
            onClick={() => onPlayClick(song)}
            className="absolute inset-0 z-10 flex items-center justify-center group/btn cursor-pointer"
            aria-label={`Play ${song.title}`}
          >
            <div className="w-14 h-14 rounded-full bg-brand-red/90 group-hover/btn:bg-brand-red text-white flex items-center justify-center shadow-glow-red transform group-hover/btn:scale-110 transition-all duration-300">
              <Play size={24} className="fill-white translate-x-0.5" />
            </div>
          </button>
        </div>

        {/* Card Content */}
        <div className="p-5 flex flex-col justify-between flex-grow space-y-4">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h3 className="text-xl font-bold font-heading text-white uppercase tracking-wide group-hover:text-brand-red transition-colors line-clamp-1">
                {song.title}
              </h3>
              {/* Share Button (Opens Share Popup Modal) */}
              <button
                onClick={handleShareClick}
                title="Share Song (WhatsApp, Instagram, Twitter, etc.)"
                className="p-2 rounded-lg bg-white/5 hover:bg-brand-red text-gray-300 hover:text-white border border-white/10 transition-all flex items-center gap-1.5 shrink-0 cursor-pointer shadow-sm hover:shadow-glow-red"
              >
                <Share2 size={14} />
                <span className="text-[10px] font-bold uppercase hidden sm:inline">Share</span>
              </button>
            </div>
            <p className="text-xs text-brand-red font-semibold mt-1 font-heading">
              TheOFFBeat | {song.release_type || 'Official Release'}
            </p>
          </div>

          {/* Description Box */}
          {song.description && (
            <div className="text-xs text-gray-300 bg-white/[0.03] p-3 rounded-xl border border-white/5 space-y-1.5 transition-all">
              <p className={`leading-relaxed text-gray-300 ${isDescExpanded ? '' : 'line-clamp-2'}`}>
                {song.description}
              </p>
              {song.description.length > 70 && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsDescExpanded(!isDescExpanded);
                  }}
                  className="text-[11px] font-bold text-brand-red hover:text-white transition-colors flex items-center gap-1 uppercase tracking-wider cursor-pointer"
                >
                  <span>{isDescExpanded ? 'Show Less' : '...More Description'}</span>
                  {isDescExpanded ? <ChevronUp size={12} /> : <ChevronDown size={12} />}
                </button>
              )}
            </div>
          )}

          {/* Meta Info: Duration & Release Date */}
          <div className="flex items-center justify-between text-xs text-gray-400 pt-3 border-t border-white/5 font-mono">
            <div className="flex items-center gap-1.5">
              <Clock size={14} className="text-gray-500" />
              <span>{song.duration || '3:15'}</span>
            </div>

            <div className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gray-500" />
              <span>{song.release_date || '2026'}</span>
            </div>
          </div>

          {/* Action Button: YouTube Only */}
          <div className="pt-1">
            <a
              href={song.youtube_url || "https://www.youtube.com/@theoffbeat_original"}
              target="_blank"
              rel="noreferrer"
              className="w-full py-2.5 px-3 bg-white/[0.04] hover:bg-brand-red text-gray-200 hover:text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition-all border border-white/10 hover:border-brand-red shadow-glow-red"
            >
              <Youtube size={16} className="text-red-500 group-hover:text-white" />
              <span>WATCH ON YOUTUBE</span>
            </a>
          </div>

          {/* Interactive Song Comments Section */}
          <SongComments songId={song.id} songTitle={song.title} />
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
