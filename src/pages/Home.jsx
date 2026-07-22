import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getSongs, getLatestSong, getReels } from '../services/api';
import HeroSection from '../components/HeroSection';
import SongCard from '../components/SongCard';
import ReelCard from '../components/ReelCard';
import AboutPreview from '../components/AboutPreview';
import SubscribeForm from '../components/SubscribeForm';
import SubmitLyricsSection from '../components/SubmitLyricsSection';
import PageTransition from '../components/PageTransition';
import VideoModal from '../components/VideoModal';
import { Instagram, Youtube, ChevronRight } from 'lucide-react';


const DEFAULT_SONGS = [
  {
    id: 1,
    title: "EK TAAREEF",
    slug: "ek-taareef",
    release_type: "Romantic Song 💖",
    release_date: "July 2026",
    duration: "3:15",
    thumbnail_url: "https://img.youtube.com/vi/dQw4w9WgXcQ/hqdefault.jpg",
    youtube_url: "https://www.youtube.com/@theoffbeat_original",
    youtube_embed_id: "dQw4w9WgXcQ",
    description: "TheOFFBeat's latest romantic release 'EK Taareef'. A heartwarming melody built around soulful acoustic textures and emotional storytelling.",
    is_latest: true,
    is_popular: true
  },
  {
    id: 2,
    title: "KHAMOSHI MEIN MAAFI",
    slug: "khamoshi-mein-maafi",
    release_type: "2026 Hip-Hop Song 🎧",
    release_date: "July 2026",
    duration: "2:38",
    thumbnail_url: "https://img.youtube.com/vi/jhJcu7fMmCM/hqdefault.jpg",
    youtube_url: "https://youtu.be/jhJcu7fMmCM",
    youtube_embed_id: "jhJcu7fMmCM",
    description: "'Khamoshi Mein Maafi' — a 2026 hip-hop track featuring raw introspective lyrics, punchy drum patterns, and atmospheric sound design.",
    is_latest: false,
    is_popular: true
  }
];

const DEFAULT_REELS = [
  {
    id: 1,
    title: "TheOFFBeat Official Short",
    reel_url: "https://youtube.com/shorts/1BFaZkuWDP0?si=F3_fe4RrES4sZmxb",
    thumbnail_url: "https://img.youtube.com/vi/1BFaZkuWDP0/hqdefault.jpg",
    caption: "Official YouTube Short by TheOFFBeat 🎧🔥 Dil se Likha, Beat pe Jeeya!"
  },
  {
    id: 2,
    title: "Khamoshi Mein Maafi Short",
    reel_url: "https://www.youtube.com/shorts/jhJcu7fMmCM",
    thumbnail_url: "https://img.youtube.com/vi/jhJcu7fMmCM/hqdefault.jpg",
    caption: "Official YouTube Short for Khamoshi Mein Maafi 🎧🔥 Dil se Likha, Beat pe Jeeya!"
  }
];


export default function Home({ settings }) {
  const navigate = useNavigate();
  const [latestSong, setLatestSong] = useState(null);
  const [songs, setSongs] = useState(DEFAULT_SONGS);
  const [reels, setReels] = useState(DEFAULT_REELS);
  const [loading, setLoading] = useState(true);
  const [modalVideo, setModalVideo] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const [latestRes, songsRes, reelsRes] = await Promise.allSettled([
          getLatestSong(),
          getSongs(),
          getReels()
        ]);
        
        if (latestRes.status === 'fulfilled' && latestRes.value?.data) {
          setLatestSong(latestRes.value.data);
        }
        if (songsRes.status === 'fulfilled' && songsRes.value?.data?.length > 0) {
          setSongs(songsRes.value.data);
        }
        if (reelsRes.status === 'fulfilled' && reelsRes.value?.data?.length > 0) {
          setReels(reelsRes.value.data);
        }
      } catch (err) {
        console.error('Error fetching homepage data:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const handlePlayClick = (song) => {
    setModalVideo({
      videoUrl: song.youtube_url,
      embedId: song.youtube_embed_id,
      title: song.title
    });
  };

  const handleReelClick = (reel) => {
    setModalVideo({
      videoUrl: reel.reel_url,
      title: reel.title || reel.caption || 'YouTube Short / Reel',
      isShort: true
    });
  };

  return (
    <PageTransition>
      <div className="bg-dark-950 min-h-screen">

        {/* SECTION 1: CINEMATIC HERO (TOP 5 LATEST SONGS) */}
        <HeroSection songs={songs.slice(0, 5)} latestSong={latestSong} onWatchClick={handlePlayClick} />

        {/* SECTION 2: LATEST RELEASES */}
        <section className="py-20 bg-dark-950 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
                  LATEST RELEASES
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white uppercase mt-1">
                  Our Newest Music
                </h2>
              </div>

              <button
                onClick={() => navigate('/music')}
                className="px-6 py-2.5 bg-white/[0.04] hover:bg-brand-red border border-white/10 hover:border-brand-red text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-2 cursor-pointer"
              >
                <span>VIEW ALL SONGS</span>
                <ChevronRight size={16} />
              </button>
            </div>

            {/* Song Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
              {songs.slice(0, 4).map((song) => (
                <SongCard key={song.id} song={song} onPlayClick={handlePlayClick} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 3: YOUTUBE SHORTS & REELS */}
        <section className="py-20 bg-dark-900/50 border-t border-b border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between mb-12 gap-4">
              <div>
                <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
                  SHORTS & REELS
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white uppercase mt-1">
                  Shorts & Behind The Scenes
                </h2>
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <a
                  href={settings?.youtube_url || "https://www.youtube.com/@theoffbeat_original"}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-red-600/15 border border-red-500/40 hover:bg-red-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-2 shadow-glow-red cursor-pointer"
                >
                  <Youtube size={16} className="text-red-500" />
                  <span>FOLLOW ON YOUTUBE</span>
                </a>

                <a
                  href={settings?.instagram_url || "https://www.instagram.com/theoffbeat_original"}
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-2.5 bg-pink-600/15 border border-pink-500/40 hover:bg-gradient-to-r hover:from-purple-600 hover:to-pink-600 text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-2 shadow-md cursor-pointer"
                >
                  <Instagram size={16} className="text-pink-400" />
                  <span>FOLLOW ON INSTAGRAM</span>
                </a>
              </div>

            </div>

            {/* 9:16 Vertical Reel Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {reels.slice(0, 4).map((reel) => (
                <ReelCard key={reel.id} reel={reel} onPlayClick={handleReelClick} />
              ))}
            </div>
          </div>
        </section>

        {/* SECTION 4: FAN LYRICS SUBMISSION & SPOTLIGHT */}
        <SubmitLyricsSection />

        {/* SECTION 5: ABOUT PREVIEW */}
        <AboutPreview settings={settings} />

        {/* SECTION 6: SUBSCRIBE / NEWSLETTER */}
        <SubscribeForm />

        {/* Video Player Modal */}
        <VideoModal
          isOpen={!!modalVideo}
          onClose={() => setModalVideo(null)}
          videoUrl={modalVideo?.videoUrl}
          embedId={modalVideo?.embedId}
          title={modalVideo?.title}
          isShort={modalVideo?.isShort}
        />

      </div>
    </PageTransition>
  );
}
