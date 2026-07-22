import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getSongs } from '../services/api';
import SongCard from '../components/SongCard';
import VideoModal from '../components/VideoModal';
import PageTransition from '../components/PageTransition';
import { Music as MusicIcon } from 'lucide-react';

export default function Music() {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVideo, setModalVideo] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function fetchMusic() {
      setLoading(true);
      try {
        const res = await getSongs();
        const songList = res.data || [];
        setSongs(songList);

        // Check URL for deep-linked share link ?songId=X
        const paramSongId = searchParams.get('songId') || searchParams.get('song');
        if (paramSongId) {
          const targetSong = songList.find(s => s.id === parseInt(paramSongId, 10));
          if (targetSong) {
            handlePlayClick(targetSong);
          }
        }
      } catch (err) {
        console.error('Error loading songs:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMusic();
  }, [searchParams]);

  const handlePlayClick = (song) => {
    setModalVideo({
      videoUrl: song.youtube_url,
      embedId: song.youtube_embed_id,
      title: song.title
    });
  };

  return (
    <PageTransition>
      <div className="bg-dark-950 min-h-screen pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
              DISCOGRAPHY & RELEASES
            </span>
            <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight text-white uppercase">
              All Songs & Videos
            </h1>
            <p className="text-gray-400 text-base leading-relaxed">
              Explore the complete soundscape of TheOFFBeat. Watch official music videos, listen to new releases, and discover our sound.
            </p>
          </div>

          {/* Song Grid */}
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((n) => (
                <div key={n} className="aspect-video bg-dark-900 border border-white/10 rounded-2xl animate-pulse" />
              ))}
            </div>
          ) : songs.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {songs.map((song) => (
                <SongCard key={song.id} song={song} onPlayClick={handlePlayClick} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20 bg-dark-900/50 border border-white/10 rounded-3xl">
              <MusicIcon size={48} className="mx-auto text-gray-600 mb-4" />
              <h3 className="text-xl font-bold text-white uppercase">No songs found</h3>
              <p className="text-gray-400 text-sm mt-1">Check back soon for new releases from TheOFFBeat!</p>
            </div>
          )}

        </div>

        {/* Video Player Modal */}
        <VideoModal
          isOpen={!!modalVideo}
          onClose={() => setModalVideo(null)}
          videoUrl={modalVideo?.videoUrl}
          embedId={modalVideo?.embedId}
          title={modalVideo?.title}
        />
      </div>
    </PageTransition>
  );
}
