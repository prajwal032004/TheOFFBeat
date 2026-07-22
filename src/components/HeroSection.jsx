import React, { useState, useEffect } from 'react';
import { Play, Youtube, ChevronLeft, ChevronRight, Sparkles, Disc, Flame, Volume2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DEFAULT_FALLBACK_SONGS = [
  {
    id: 1,
    title: 'EK TAAREEF',
    release_type: 'Romantic Song 💖',
    duration: '3:15',
    thumbnail_url: 'https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg',
    youtube_url: 'https://www.youtube.com/@theoffbeat_original',
    youtube_embed_id: 'dQw4w9WgXcQ',
    description: "TheOFFBeat's latest romantic release 'EK Taareef'. A heartwarming melody built around soulful acoustic textures and emotional storytelling.",
    is_latest: true
  },
  {
    id: 2,
    title: 'KHAMOSHI MEIN MAAFI',
    release_type: '2026 Hip-Hop Song 🎧',
    duration: '2:38',
    thumbnail_url: 'https://img.youtube.com/vi/jhJcu7fMmCM/hqdefault.jpg',
    youtube_url: 'https://youtu.be/jhJcu7fMmCM',
    youtube_embed_id: 'jhJcu7fMmCM',
    description: "'Khamoshi Mein Maafi' — a 2026 hip-hop track featuring raw introspective lyrics, punchy drum patterns, and atmospheric sound design.",
    is_latest: false
  }
];

export default function HeroSection({ songs = [], latestSong, onWatchClick }) {
  // Consolidate featured songs array with reliable fallback
  const featuredSongs = React.useMemo(() => {
    if (songs && songs.length > 0) return songs.slice(0, 5);
    if (latestSong) return [latestSong];
    return DEFAULT_FALLBACK_SONGS;
  }, [songs, latestSong]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  // Safely clamp index if song list changes
  const activeIndex = currentIndex < featuredSongs.length ? currentIndex : 0;

  // Auto-play interval logic (pauses on hover)
  useEffect(() => {
    if (featuredSongs.length <= 1 || isPaused) return;

    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredSongs.length);
    }, 6500);

    return () => clearInterval(timer);
  }, [featuredSongs.length, isPaused]);

  const currentSong = featuredSongs[activeIndex] || featuredSongs[0];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredSongs.length);
    setIsPaused(true);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredSongs.length) % featuredSongs.length);
    setIsPaused(true);
  };

  const getHeroThumbnail = (song) => {
    const embedId = song.youtube_embed_id || (song.youtube_url && song.youtube_url.match(/(?:v=|\/|be\/|embed\/)([a-zA-Z0-9_-]{11})/)?.[1]);
    if (embedId) {
      return `https://img.youtube.com/vi/${embedId}/hqdefault.jpg`;
    }
    return song.thumbnail_url || "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1920&q=80";
  };

  // Helper function to force two-line title layout (e.g. KHAMOSHI on Line 1, MEIN MAAFI on Line 2)
  const renderTitleTwoLines = (title) => {
    if (!title) return null;
    const cleanTitle = title.trim();
    
    // Explicit custom splits for top songs
    if (cleanTitle.toUpperCase() === 'KHAMOSHI MEIN MAAFI') {
      return (
        <>
          <span className="block text-white whitespace-nowrap leading-tight">KHAMOSHI</span>
          <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-red-400 to-white whitespace-nowrap leading-tight">MEIN MAAFI</span>
        </>
      );
    }

    const words = cleanTitle.split(/\s+/);
    if (words.length < 2) {
      return <span className="block whitespace-nowrap">{title}</span>;
    }

    const line1 = words[0];
    const line2 = words.slice(1).join(" ");
    return (
      <>
        <span className="block text-white whitespace-nowrap leading-tight">{line1}</span>
        <span className="block text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-red-400 to-white whitespace-nowrap leading-tight">{line2}</span>
      </>
    );
  };

  return (
    <section
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="relative min-h-[85vh] lg:min-h-[92vh] flex items-center justify-center pt-28 pb-16 overflow-hidden bg-dark-950 select-none"
    >
      
      {/* Background Image backdrop */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentSong.id || activeIndex}
          initial={{ opacity: 0, scale: 1.05 }}
          animate={{ opacity: 1, scale: 1.01 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7 }}
          className="absolute inset-0 z-0 pointer-events-none"
        >
          <img
            src={getHeroThumbnail(currentSong)}
            alt={currentSong.title}
            className="w-full h-full object-cover object-center filter brightness-90 contrast-110 opacity-70 transition-transform duration-1000"
          />
          {/* Glow Blobs */}
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-brand-red/20 blur-[120px] rounded-full pointer-events-none animate-pulse" />

          {/* Vignette Gradients */}
          <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-dark-950/80" />
          <div className="absolute inset-0 bg-gradient-to-r from-dark-950 via-dark-950/70 to-transparent" />
        </motion.div>
      </AnimatePresence>

      {/* Horizontal Nav Arrows */}
      {featuredSongs.length > 1 && (
        <>
          <button
            onClick={handlePrev}
            aria-label="Previous Song"
            className="absolute left-3 sm:left-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/70 border border-white/20 hover:border-brand-red text-white flex items-center justify-center hover:bg-brand-red hover:scale-110 transition-all duration-300 backdrop-blur-xl cursor-pointer shadow-glow-red"
          >
            <ChevronLeft size={24} />
          </button>

          <button
            onClick={handleNext}
            aria-label="Next Song"
            className="absolute right-3 sm:right-6 top-1/2 -translate-y-1/2 z-30 w-12 h-12 rounded-full bg-black/70 border border-white/20 hover:border-brand-red text-white flex items-center justify-center hover:bg-brand-red hover:scale-110 transition-all duration-300 backdrop-blur-xl cursor-pointer shadow-glow-red"
          >
            <ChevronRight size={24} />
          </button>
        </>
      )}

      {/* Hero Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center w-full">

          {/* Left Column: Song Details & CTAs */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`text-${currentSong.id || activeIndex}`}
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 30 }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
              className="lg:col-span-7 space-y-6"
            >
              {/* Feature Pills */}
              <div className="flex flex-wrap items-center gap-2">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-red/20 border border-brand-red/50 rounded-full backdrop-blur-md shadow-glow-red">
                  <Sparkles size={14} className="text-brand-red animate-spin-slow" />
                  <span className="text-xs font-black uppercase tracking-widest text-brand-red">
                    {currentSong.is_latest ? 'TOP #1 RELEASE' : `FEATURED TRACK #${activeIndex + 1}`}
                  </span>
                </div>
                <div className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full backdrop-blur-md text-xs text-gray-300 font-mono">
                  <Flame size={13} className="text-orange-400" />
                  <span>TheOFFBeat Music Duo</span>
                </div>
              </div>

              {/* Song Title (FORCED 2 LINES IF 2+ WORDS) */}
              <h1 className="font-heading font-black text-5xl sm:text-7xl lg:text-8xl tracking-tight uppercase leading-[0.95] drop-shadow-2xl">
                {renderTitleTwoLines(currentSong.title)}
              </h1>

              {/* Subtitle / Artist */}
              <div className="flex flex-wrap items-center gap-3 text-base sm:text-lg font-bold text-gray-200 font-heading">
                <span className="px-3 py-0.5 bg-white/10 rounded-md text-white">TheOFFBeat</span>
                <span className="text-brand-red">•</span>
                <span className="text-brand-red tracking-wider uppercase">{currentSong.release_type || 'Official Release'}</span>
                <span className="text-gray-500">•</span>
                <span className="text-gray-400 font-mono text-xs">{currentSong.duration || '3:30'}</span>
              </div>

              {/* Description */}
              {currentSong.description && (
                <p className="text-gray-300 text-sm sm:text-base max-w-xl leading-relaxed bg-black/40 p-4 rounded-2xl border border-white/10 backdrop-blur-md shadow-xl">
                  {currentSong.description}
                </p>
              )}

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-4 pt-2">
                <button
                  onClick={() => onWatchClick(currentSong)}
                  className="group relative px-8 py-4 bg-brand-red hover:bg-red-600 text-white font-black text-xs sm:text-sm tracking-wider uppercase rounded-full shadow-glow-red-lg transition-all duration-300 flex items-center gap-3 cursor-pointer transform hover:scale-105"
                >
                  <span>PLAY NOW</span>
                  <Play size={18} className="fill-white group-hover:scale-110 transition-transform" />
                </button>

                <a
                  href={currentSong.youtube_url || "https://www.youtube.com/@theoffbeat_original"}
                  target="_blank"
                  rel="noreferrer"
                  className="px-7 py-4 border border-white/25 hover:border-brand-red bg-white/[0.06] hover:bg-white/[0.12] text-white font-extrabold text-xs sm:text-sm tracking-wider uppercase rounded-full transition-all duration-300 flex items-center gap-2.5 backdrop-blur-md"
                >
                  <Youtube size={18} className="text-red-500" />
                  <span>WATCH ON YOUTUBE</span>
                </a>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Right Column: 3D Album Cover & Spinning Vinyl Record Effect */}
          <AnimatePresence mode="wait">
            <motion.div
              key={`vinyl-${currentSong.id || activeIndex}`}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
              className="lg:col-span-5 hidden lg:flex justify-center"
            >
              <div
                onClick={() => onWatchClick(currentSong)}
                className="group relative w-[380px] h-[280px] cursor-pointer flex items-center justify-center"
              >
                {/* Spinning Vinyl Record Sliding Out on Hover */}
                <div className="absolute right-0 w-60 h-60 rounded-full bg-black border-4 border-gray-800 shadow-2xl flex items-center justify-center transform translate-x-12 group-hover:translate-x-24 transition-transform duration-700 ease-out z-0 overflow-hidden">
                  <div className="absolute inset-2 border border-white/10 rounded-full" />
                  <div className="absolute inset-6 border border-white/10 rounded-full" />
                  <div className="absolute inset-10 border border-white/10 rounded-full" />
                  
                  <div className="w-20 h-20 rounded-full bg-brand-red border-2 border-white/20 flex items-center justify-center animate-spin-slow shadow-glow-red">
                    <Disc size={28} className="text-white opacity-80" />
                  </div>
                </div>

                {/* Main Album Art Thumbnail Card */}
                <div className="relative w-full h-full rounded-3xl overflow-hidden border-2 border-brand-red/60 hover:border-brand-red shadow-glow-red-lg z-10 bg-dark-900 transition-all duration-500">
                  <img
                    src={getHeroThumbnail(currentSong)}
                    alt={currentSong.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />

                  {/* Dark Vignette Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent group-hover:bg-black/20 transition-colors" />

                  {/* Play Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-brand-red text-white flex items-center justify-center shadow-glow-red transform group-hover:scale-110 transition-transform duration-300">
                      <Play size={28} className="fill-white translate-x-0.5" />
                    </div>
                  </div>

                  {/* Card Title Banner */}
                  <div className="absolute bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-black via-black/80 to-transparent">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-brand-red tracking-widest font-mono">
                        {currentSong.duration || '3:30'} • NOW PLAYING
                      </span>
                      <Volume2 size={16} className="text-brand-red animate-pulse" />
                    </div>
                    <h4 className="text-lg font-bold text-white uppercase font-heading truncate">
                      {currentSong.title}
                    </h4>
                  </div>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

        </div>
      </div>

    </section>
  );
}
