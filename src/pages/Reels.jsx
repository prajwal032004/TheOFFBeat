import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { getReels } from '../services/api';
import ReelCard from '../components/ReelCard';
import VideoModal from '../components/VideoModal';
import PageTransition from '../components/PageTransition';
import { Film, Sparkles } from 'lucide-react';

export default function Reels() {
  const [reels, setReels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalVideo, setModalVideo] = useState(null);
  const [searchParams] = useSearchParams();

  useEffect(() => {
    async function fetchReelsData() {
      try {
        const res = await getReels();
        const reelList = res.data || [];
        setReels(reelList);

        // Check URL for deep link ?reelId=X or ?reel=X
        const paramReelId = searchParams.get('reelId') || searchParams.get('reel');
        if (paramReelId) {
          const targetReel = reelList.find(r => r.id === parseInt(paramReelId, 10));
          if (targetReel) {
            handleReelClick(targetReel);
          }
        }
      } catch (err) {
        console.error('Error loading reels:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchReelsData();
  }, [searchParams]);

  const handleReelClick = (reel) => {
    setModalVideo({
      videoUrl: reel.reel_url,
      title: reel.title || reel.caption || 'YouTube Short / Reel',
      isShort: true
    });
  };

  return (
    <PageTransition>
      <div className="bg-dark-950 min-h-screen pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red flex items-center justify-center gap-2">
              <Sparkles size={14} />
              EXCLUSIVES & SHORTS
            </span>
            <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight text-white uppercase">
              Official Reels
            </h1>
            <p className="text-gray-400 text-base leading-relaxed">
              Experience our highest-energy vertical reels, YouTube Shorts, studio breakdowns, and behind-the-scenes clips.
            </p>
          </div>

          {/* Reels Grid */}
          {loading ? (
            <div className="text-center py-20 text-gray-500 font-mono text-sm">
              Loading Reels...
            </div>
          ) : reels.length === 0 ? (
            <div className="text-center py-20 bg-dark-900/50 rounded-3xl border border-white/5">
              <Film size={48} className="mx-auto text-gray-600 mb-3" />
              <p className="text-gray-400 font-medium">No reels uploaded yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-6">
              {reels.map((reel) => (
                <ReelCard key={reel.id} reel={reel} onPlayClick={handleReelClick} />
              ))}
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
          isShort={modalVideo?.isShort}
        />
      </div>
    </PageTransition>
  );
}
