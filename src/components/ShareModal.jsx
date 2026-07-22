import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Copy, Check, Share2, Send, Instagram } from 'lucide-react';

export default function ShareModal({ isOpen, onClose, shareData }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen || !shareData) return null;

  const {
    title = 'TheOFFBeat Track',
    url = window.location.href,
    thumbnailUrl = 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=600&q=80',
    type = 'Song',
    hashtags = '#TheOFFBeat #NewMusic #IndianMusicDuo #DilSeLikhaBeatPeJeeya'
  } = shareData;

  const shareText = `🔥 Check out "${title}" by TheOFFBeat!\n\n${url}\n\n${hashtags}`;
  const encodedText = encodeURIComponent(shareText);
  const encodedUrl = encodeURIComponent(url);

  // Social Share URLs
  const whatsappUrl = `https://api.whatsapp.com/send?text=${encodedText}`;
  const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(`🔥 Listen to "${title}" by @theoffbeat_original! ${hashtags}`)}&url=${encodedUrl}`;
  const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;
  const instagramUrl = `https://www.instagram.com/theoffbeat_original?utm_source=qr`;

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleNativeShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `TheOFFBeat - ${title}`,
          text: `🔥 Listen to "${title}" by TheOFFBeat!`,
          url: url,
        });
      } catch (err) {
        console.log('Share canceled:', err);
      }
    } else {
      handleCopyLink();
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/80 backdrop-blur-md"
        />

        {/* Share Dialog */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="relative w-full max-w-md bg-dark-900 border border-white/15 rounded-3xl p-6 shadow-2xl z-10 overflow-hidden"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-white/10">
            <div className="flex items-center gap-2">
              <Share2 size={20} className="text-brand-red" />
              <h3 className="text-lg font-black font-heading uppercase text-white tracking-wide">
                Share {type}
              </h3>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full text-gray-400 hover:text-white hover:bg-white/10 transition-colors cursor-pointer"
            >
              <X size={20} />
            </button>
          </div>

          {/* Item Preview Card */}
          <div className="my-5 p-3 bg-dark-950 border border-white/10 rounded-2xl flex items-center gap-3">
            {thumbnailUrl && (
              <img
                src={thumbnailUrl}
                alt={title}
                className="w-16 h-16 rounded-xl object-cover border border-white/10 shrink-0"
              />
            )}
            <div className="overflow-hidden space-y-1">
              <span className="text-[10px] font-mono font-bold uppercase text-brand-red tracking-wider">
                TheOFFBeat Official
              </span>
              <h4 className="text-sm font-bold text-white uppercase truncate">
                {title}
              </h4>
              <p className="text-[11px] text-gray-400 truncate font-mono">
                {hashtags}
              </p>
            </div>
          </div>

          {/* Social Icons Grid with Perfectly Centered SVGs */}
          <div className="grid grid-cols-4 gap-3 my-4 text-center">
            
            {/* WhatsApp */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 hover:scale-105 transition-all group"
            >
              <div className="w-11 h-11 rounded-full bg-emerald-500 text-black flex items-center justify-center shadow-lg shadow-emerald-500/20 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" className="w-6 h-6 fill-current text-white">
                  <path d="M12.012 2c-5.506 0-9.989 4.478-9.989 9.984 0 1.758.459 3.474 1.33 4.988l-1.413 5.161 5.282-1.385c1.455.794 3.09 1.213 4.789 1.213 5.507 0 9.99-4.478 9.99-9.985 0-5.506-4.483-9.976-9.989-9.976zm5.836 14.167c-.244.688-1.43 1.319-1.964 1.378-.492.055-1.127.08-3.284-.813-2.759-1.142-4.52-3.955-4.659-4.139-.136-.184-1.124-1.498-1.124-2.857 0-1.359.711-2.025.962-2.298.244-.272.532-.34.708-.34.177 0 .354.002.508.01.164.008.384-.062.6.457.221.531.75 1.83.816 1.966.066.136.111.295.021.472-.089.177-.134.288-.266.443-.133.156-.279.349-.398.469-.133.133-.272.28-.118.544.154.264.685 1.13 1.469 1.828 1.008.898 1.859 1.177 2.124 1.31.265.133.421.111.576-.067.155-.178.665-.776.842-1.042.177-.266.354-.222.598-.133.244.089 1.55.731 1.816.864.266.133.443.2.51.31.066.111.066.643-.178 1.331z"/>
                </svg>
              </div>
              <span className="text-[11px] font-bold uppercase text-emerald-400">WhatsApp</span>
            </a>

            {/* Instagram */}
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-pink-500/10 hover:bg-pink-500/20 border border-pink-500/30 text-pink-400 hover:scale-105 transition-all group"
            >
              <div className="w-11 h-11 rounded-full bg-gradient-to-tr from-yellow-400 via-rose-500 to-purple-600 text-white flex items-center justify-center shadow-lg shadow-pink-500/20 group-hover:scale-110 transition-transform">
                <Instagram size={22} className="text-white" />
              </div>
              <span className="text-[11px] font-bold uppercase text-pink-400">Instagram</span>
            </a>

            {/* Twitter / X */}
            <a
              href={twitterUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-sky-500/10 hover:bg-sky-500/20 border border-sky-500/30 text-sky-400 hover:scale-105 transition-all group"
            >
              <div className="w-11 h-11 rounded-full bg-black border border-white/20 text-white flex items-center justify-center shadow-lg shadow-sky-500/10 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </div>
              <span className="text-[11px] font-bold uppercase text-sky-400">Twitter / X</span>
            </a>

            {/* Facebook */}
            <a
              href={facebookUrl}
              target="_blank"
              rel="noreferrer"
              className="flex flex-col items-center gap-2 p-3 rounded-2xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/30 text-blue-400 hover:scale-105 transition-all group"
            >
              <div className="w-11 h-11 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-110 transition-transform">
                <svg viewBox="0 0 24 24" className="w-5 h-5 fill-current text-white">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
              </div>
              <span className="text-[11px] font-bold uppercase text-blue-400">Facebook</span>
            </a>

          </div>

          {/* Copy Link Section */}
          <div className="pt-3 border-t border-white/10 space-y-3">
            <label className="text-xs font-bold uppercase text-gray-400 block tracking-wider">
              Direct Link
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={url}
                className="w-full px-3 py-2 bg-dark-950 border border-white/15 rounded-xl text-xs font-mono text-gray-300 focus:outline-none"
              />
              <button
                onClick={handleCopyLink}
                className={`px-4 py-2 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 shrink-0 transition-all cursor-pointer ${
                  copied
                    ? 'bg-emerald-500 text-black shadow-glow-green'
                    : 'bg-brand-red hover:bg-red-600 text-white shadow-glow-red'
                }`}
              >
                {copied ? (
                  <>
                    <Check size={15} />
                    <span>Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy size={15} />
                    <span>Copy</span>
                  </>
                )}
              </button>
            </div>
          </div>

          {/* Native Mobile Share Button */}
          {navigator.share && (
            <div className="pt-3">
              <button
                onClick={handleNativeShare}
                className="w-full py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-200 text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Send size={15} />
                <span>More Options (Mobile Apps)</span>
              </button>
            </div>
          )}

        </motion.div>
      </div>
    </AnimatePresence>
  );
}
