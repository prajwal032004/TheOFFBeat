import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { PenTool, Sparkles, Send, Music2, CheckCircle2, AlertCircle, User, Mail, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { submitLyrics, getFeaturedLyrics } from '../services/api';

export default function SubmitLyricsSection() {
  const [formData, setFormData] = useState({
    writer_name: '',
    email: '',
    song_title: '',
    genre: 'Romantic',
    lyrics: ''
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [featuredLyrics, setFeaturedLyrics] = useState([]);
  const [expandedId, setExpandedId] = useState(null);

  useEffect(() => {
    fetchFeaturedLyrics();
  }, []);

  const fetchFeaturedLyrics = async () => {
    try {
      const res = await getFeaturedLyrics();
      setFeaturedLyrics(res.data || []);
    } catch (err) {
      console.error('Error fetching featured lyrics:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSuccessMsg('');
    setErrorMsg('');

    if (!formData.writer_name.trim() || !formData.email.trim() || !formData.lyrics.trim()) {
      setErrorMsg('Please fill in your Name, Email, and Lyrics content.');
      return;
    }

    setLoading(true);

    try {
      const res = await submitLyrics(formData);
      setSuccessMsg(res.data?.message || 'Lyrics submitted successfully!');
      setFormData({
        writer_name: '',
        email: '',
        song_title: '',
        genre: 'Romantic',
        lyrics: ''
      });
      fetchFeaturedLyrics();
    } catch (err) {
      const errText = err.response?.data?.error || 'Failed to submit lyrics. Please try again.';
      setErrorMsg(errText);
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="py-20 bg-dark-950 border-t border-b border-white/10 relative overflow-hidden select-none">
      
      {/* Background Red Ambient Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/10 blur-[160px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 space-y-16">
        
        {/* SECTION 1: LYRICS SUBMISSION FORM */}
        <div className="bg-dark-900/90 border border-white/15 rounded-3xl p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
          <div className="max-w-3xl mx-auto space-y-8">
            
            {/* Header */}
            <div className="text-center space-y-3">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-brand-red/15 border border-brand-red/40 rounded-full shadow-glow-red">
                <PenTool size={14} className="text-brand-red animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-brand-red">
                  WRITE FOR THEOFFBEAT
                </span>
              </div>
              <h2 className="text-3xl sm:text-5xl font-black font-heading text-white uppercase tracking-tight">
                Submit Your Lyrics
              </h2>
              <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto">
                Got original poetry or lyrics? Submit your written lyrics below! If selected by <span className="text-brand-red font-bold">TheOFFBeat</span>, we will compose, produce, and record an official song featuring <span className="text-white font-bold underline decoration-brand-red decoration-2">YOUR NAME</span> as the official Lyricist in song credits!
              </p>
            </div>

            {/* Alert Messages */}
            {successMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-start gap-3 text-emerald-400 text-sm"
              >
                <CheckCircle2 size={20} className="shrink-0 mt-0.5" />
                <span>{successMsg}</span>
              </motion.div>
            )}

            {errorMsg && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-500/10 border border-red-500/30 rounded-2xl flex items-start gap-3 text-red-400 text-sm"
              >
                <AlertCircle size={20} className="shrink-0 mt-0.5" />
                <span>{errorMsg}</span>
              </motion.div>
            )}

            {/* Submission Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                
                {/* Writer Name */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-300 flex items-center gap-1.5">
                    <User size={14} className="text-brand-red" />
                    <span>Your Name / Lyricist Name *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul Sharma"
                    value={formData.writer_name}
                    onChange={(e) => setFormData({...formData, writer_name: e.target.value})}
                    className="w-full px-4 py-3 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-brand-red transition-all"
                  />
                </div>

                {/* Email / Instagram */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-300 flex items-center gap-1.5">
                    <Mail size={14} className="text-brand-red" />
                    <span>Email / Social Handle *</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. rahul@gmail.com or @rahul_lyrics"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    className="w-full px-4 py-3 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-brand-red transition-all"
                  />
                </div>

                {/* Song Title / Concept */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-300 flex items-center gap-1.5">
                    <FileText size={14} className="text-brand-red" />
                    <span>Song Title / Concept Name</span>
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. Dil Ki Baatein"
                    value={formData.song_title}
                    onChange={(e) => setFormData({...formData, song_title: e.target.value})}
                    className="w-full px-4 py-3 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-brand-red transition-all"
                  />
                </div>

                {/* Genre Select */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold uppercase text-gray-300 flex items-center gap-1.5">
                    <Music2 size={14} className="text-brand-red" />
                    <span>Preferred Music Genre</span>
                  </label>
                  <select
                    value={formData.genre}
                    onChange={(e) => setFormData({...formData, genre: e.target.value})}
                    className="w-full px-4 py-3 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-brand-red transition-all"
                  >
                    <option value="Romantic">Romantic 💖</option>
                    <option value="Hip-Hop">Hip-Hop / Rap 🎧</option>
                    <option value="Acoustic">Acoustic / Soulful 🎸</option>
                    <option value="EDM/Synthwave">EDM / Synthwave ✨</option>
                    <option value="Sad/Emotional">Sad / Emotional 🌧️</option>
                  </select>
                </div>

              </div>

              {/* Lyrics Textarea */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold uppercase text-gray-300 flex items-center gap-1.5">
                  <PenTool size={14} className="text-brand-red" />
                  <span>Your Original Lyrics Text *</span>
                </label>
                <textarea
                  rows={6}
                  required
                  placeholder="Paste or write your full song lyrics here (Verse, Chorus, Outro)..."
                  value={formData.lyrics}
                  onChange={(e) => setFormData({...formData, lyrics: e.target.value})}
                  className="w-full px-4 py-3 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:outline-none focus:border-brand-red transition-all leading-relaxed"
                />
              </div>

              {/* Submit Button */}
              <div className="text-center pt-2">
                <button
                  type="submit"
                  disabled={loading}
                  className="px-10 py-4 bg-brand-red hover:bg-red-600 text-white font-black text-sm uppercase tracking-wider rounded-full shadow-glow-red hover:shadow-glow-red-lg transition-all duration-300 flex items-center gap-3 mx-auto cursor-pointer disabled:opacity-50"
                >
                  <span>{loading ? 'SUBMITTING...' : 'SUBMIT MY LYRICS FOR SONG PRODUCTION'}</span>
                  <Send size={18} />
                </button>
              </div>
            </form>

          </div>
        </div>


        {/* SECTION 2: FAN LYRICISTS SPOTLIGHT / APPROVED COMMUNITY SONGS SHOWCASE */}
        {featuredLyrics.length > 0 && (
          <div className="space-y-8">
            <div className="text-center space-y-2">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
                COMMUNITY SPOTLIGHT
              </span>
              <h3 className="text-3xl sm:text-4xl font-black font-heading text-white uppercase">
                Fan Lyricists & Approved Songs
              </h3>
              <p className="text-gray-400 text-sm max-w-xl mx-auto">
                Explore lyrics written by listeners that were selected and featured by <span className="text-white font-bold">TheOFFBeat</span>!
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {featuredLyrics.map((item) => {
                const isExpanded = expandedId === item.id;
                return (
                  <div
                    key={item.id}
                    className="p-6 bg-dark-900 border border-brand-red/30 hover:border-brand-red rounded-3xl space-y-4 shadow-xl transition-all"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <span className="px-3 py-1 bg-brand-red/20 text-brand-red text-[11px] font-extrabold uppercase rounded-full tracking-wider">
                          {item.status === 'approved_for_song' ? '🎵 APPROVED FOR OFFICIAL SONG' : '✨ FEATURED LYRICIST'}
                        </span>
                        <h4 className="text-xl font-bold font-heading text-white uppercase mt-2">
                          {item.song_title || 'Untitled Song'}
                        </h4>
                        <p className="text-xs text-gray-300 mt-0.5 font-heading">
                          Written by <span className="text-white font-bold">{item.writer_name}</span> • Genre: <span className="text-brand-red font-semibold">{item.genre}</span>
                        </p>
                      </div>
                    </div>

                    <div className="bg-dark-950 p-4 rounded-2xl border border-white/5 text-xs text-gray-300 space-y-2">
                      <p className={`font-mono leading-relaxed whitespace-pre-line ${isExpanded ? '' : 'line-clamp-4'}`}>
                        {item.lyrics}
                      </p>
                      <button
                        onClick={() => setExpandedId(isExpanded ? null : item.id)}
                        className="text-brand-red hover:text-white font-bold text-[11px] uppercase tracking-wider flex items-center gap-1 cursor-pointer pt-1"
                      >
                        <span>{isExpanded ? 'Hide Lyrics' : 'Read Full Lyrics'}</span>
                        {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </section>
  );
}
