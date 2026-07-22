import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  getSongs, createSong, updateSong, deleteSong,
  getReels, createReel, updateReel, deleteReel,
  getMembers, createMember, updateMember, deleteMember,
  getSettings, updateSettings,
  getAdminSubscribers, deleteSubscriber,
  getAdminMessages, markMessageRead, deleteMessage,
  getAdminComments, toggleAdminComment, deleteAdminComment,
  getAllLyricsAdmin, updateLyricStatus, deleteLyricSubmission,
  checkAdminAuth
} from '../services/api';
import PageTransition from '../components/PageTransition';
import {
  Music, Film, Users, Settings, Mail, MessageSquare, Plus, Trash2, Edit3, Check, X, LogOut, Star, Eye, EyeOff, ShieldAlert, PenTool, RefreshCw, AlertTriangle
} from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('songs');
  const [songs, setSongs] = useState([]);
  const [reels, setReels] = useState([]);
  const [members, setMembers] = useState([]);
  const [settings, setSettings] = useState({});
  const [subscribers, setSubscribers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [comments, setComments] = useState([]);
  const [lyricsList, setLyricsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messageToast, setMessageToast] = useState(null);

  // Custom Delete Confirmation Popup Modal state
  const [confirmModal, setConfirmModal] = useState(null);

  // Song Modal / Form state
  const [editingSong, setEditingSong] = useState(null);
  const [songForm, setSongForm] = useState({
    title: '', release_type: 'Official Music Video', release_date: '2026',
    duration: '3:45', thumbnail_url: '', youtube_url: '', spotify_url: '',
    description: '', is_latest: false, is_popular: false
  });

  // Reel Modal / Form state
  const [editingReel, setEditingReel] = useState(null);
  const [reelForm, setReelForm] = useState({
    title: '', reel_url: '', thumbnail_url: '', caption: '', display_order: 1
  });

  // Check auth and load all data
  useEffect(() => {
    loadAdminData();
  }, [navigate]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      await checkAdminAuth();
      const [songsRes, reelsRes, membersRes, settingsRes, subsRes, msgsRes, commentsRes, lyricsRes] = await Promise.all([
        getSongs(), getReels(), getMembers(), getSettings(),
        getAdminSubscribers(), getAdminMessages(), getAdminComments(), getAllLyricsAdmin()
      ]);
      setSongs(songsRes.data || []);
      setReels(reelsRes.data || []);
      setMembers(membersRes.data || []);
      setSettings(settingsRes.data || {});
      setSubscribers(subsRes.data || []);
      setMessages(msgsRes.data || []);
      setComments(commentsRes.data || []);
      setLyricsList(lyricsRes.data || []);
    } catch (err) {
      console.error('Admin Auth failed:', err);
      localStorage.removeItem('echoverse_admin_token');
      navigate('/admin/offbeat/login');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('echoverse_admin_token');
    if (onLogout) onLogout();
    navigate('/admin/offbeat/login');
  };


  const showToast = (msg, isError = false) => {
    setMessageToast({ text: msg, isError });
    setTimeout(() => setMessageToast(null), 3500);
  };

  // SONG HANDLERS
  const handleOpenAddSong = () => {
    setEditingSong({});
    setSongForm({
      title: '', release_type: 'Official Music Video', release_date: '2026',
      duration: '3:45', thumbnail_url: '', youtube_url: '', spotify_url: '',
      description: '', is_latest: false, is_popular: false
    });
  };

  const handleOpenEditSong = (song) => {
    setEditingSong(song);
    setSongForm({
      title: song.title || '',
      release_type: song.release_type || 'Official Music Video',
      release_date: song.release_date || '2026',
      duration: song.duration || '3:45',
      thumbnail_url: song.thumbnail_url || '',
      youtube_url: song.youtube_url || '',
      spotify_url: song.spotify_url || '',
      description: song.description || '',
      is_latest: song.is_latest || false,
      is_popular: song.is_popular || false
    });
  };

  const handleSaveSong = async (e) => {
    e.preventDefault();
    try {
      if (editingSong && editingSong.id) {
        await updateSong(editingSong.id, songForm);
        showToast('Song updated successfully!');
      } else {
        await createSong(songForm);
        showToast('New song added to catalog!');
      }
      const updated = await getSongs();
      setSongs(updated.data || []);
      setEditingSong(null);
    } catch (err) {
      showToast('Error saving song: ' + (err.response?.data?.error || err.message), true);
    }
  };

  const promptDeleteSong = (id, title) => {
    setConfirmModal({
      title: 'Delete Song Permanently',
      message: `Are you sure you want to delete "${title || 'this song'}" from your music catalog?`,
      onConfirm: async () => {
        try {
          await deleteSong(id);
          setSongs(prev => prev.filter(s => s.id !== id));
          showToast('Song deleted successfully!');
        } catch (err) {
          showToast('Failed to delete song: ' + (err.response?.data?.error || err.message), true);
        } finally {
          setConfirmModal(null);
        }
      }
    });
  };

  // REEL HANDLERS
  const handleOpenAddReel = () => {
    setEditingReel({});
    setReelForm({ title: '', reel_url: '', thumbnail_url: '', caption: '', display_order: 1 });
  };

  const handleOpenEditReel = (reel) => {
    setEditingReel(reel);
    setReelForm({
      title: reel.title || '',
      reel_url: reel.reel_url || '',
      thumbnail_url: reel.thumbnail_url || '',
      caption: reel.caption || '',
      display_order: reel.display_order || 1
    });
  };

  const handleSaveReel = async (e) => {
    e.preventDefault();
    try {
      if (editingReel && editingReel.id) {
        await updateReel(editingReel.id, reelForm);
        showToast('Reel updated successfully!');
      } else {
        await createReel(reelForm);
        showToast('New Reel added!');
      }
      const updated = await getReels();
      setReels(updated.data || []);
      setEditingReel(null);
    } catch (err) {
      showToast('Error saving reel: ' + (err.response?.data?.error || err.message), true);
    }
  };

  const promptDeleteReel = (id, title) => {
    setConfirmModal({
      title: 'Delete Reel / Short',
      message: `Are you sure you want to delete "${title || 'this reel'}"?`,
      onConfirm: async () => {
        try {
          await deleteReel(id);
          setReels(prev => prev.filter(r => r.id !== id));
          showToast('Reel deleted successfully!');
        } catch (err) {
          showToast('Failed to delete reel: ' + (err.response?.data?.error || err.message), true);
        } finally {
          setConfirmModal(null);
        }
      }
    });
  };

  // SETTINGS HANDLER
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(settings);
      showToast('Settings saved successfully!');
    } catch (err) {
      showToast('Error saving settings', true);
    }
  };

  // SUBSCRIBER & MESSAGE HANDLERS
  const promptDeleteSub = (id, email) => {
    setConfirmModal({
      title: 'Remove Subscriber',
      message: `Remove "${email}" from subscriber list?`,
      onConfirm: async () => {
        try {
          await deleteSubscriber(id);
          setSubscribers(prev => prev.filter(s => s.id !== id));
          showToast('Subscriber removed');
        } catch (err) {
          showToast('Failed to remove subscriber', true);
        } finally {
          setConfirmModal(null);
        }
      }
    });
  };

  const handleMarkRead = async (id) => {
    try {
      await markMessageRead(id);
      setMessages(prev => prev.map(m => m.id === id ? { ...m, is_read: true } : m));
      showToast('Message marked as read');
    } catch (err) {
      console.error(err);
    }
  };

  const promptDeleteMsg = (id, name) => {
    setConfirmModal({
      title: 'Delete Message',
      message: `Delete message from "${name}"?`,
      onConfirm: async () => {
        try {
          await deleteMessage(id);
          setMessages(prev => prev.filter(m => m.id !== id));
          showToast('Message deleted');
        } catch (err) {
          showToast('Failed to delete message', true);
        } finally {
          setConfirmModal(null);
        }
      }
    });
  };

  // COMMENT MODERATION HANDLERS
  const handleToggleComment = async (id) => {
    try {
      const res = await toggleAdminComment(id);
      setComments(prev => prev.map(c => c.id === id ? { ...c, is_approved: !c.is_approved } : c));
      showToast(res.data?.message || 'Comment status updated');
    } catch (err) {
      showToast('Failed to update comment status', true);
    }
  };

  const promptDeleteComment = (id, author) => {
    setConfirmModal({
      title: 'Delete Comment',
      message: `Delete comment by "${author}" permanently?`,
      onConfirm: async () => {
        try {
          await deleteAdminComment(id);
          setComments(prev => prev.filter(c => c.id !== id));
          showToast('Comment deleted permanently');
        } catch (err) {
          showToast('Failed to delete comment', true);
        } finally {
          setConfirmModal(null);
        }
      }
    });
  };

  // LYRICS SUBMISSION HANDLERS
  const handleUpdateLyricStatus = async (id, status) => {
    try {
      await updateLyricStatus(id, { status });
      setLyricsList(prev => prev.map(item => item.id === id ? { ...item, status } : item));
      showToast('Lyric status updated!');
    } catch (err) {
      showToast('Failed to update lyric status', true);
    }
  };

  const promptDeleteLyric = (id, writer) => {
    setConfirmModal({
      title: 'Delete Fan Lyric Submission',
      message: `Delete lyric submission by "${writer}"?`,
      onConfirm: async () => {
        try {
          await deleteLyricSubmission(id);
          setLyricsList(prev => prev.filter(item => item.id !== id));
          showToast('Lyric submission deleted');
        } catch (err) {
          showToast('Failed to delete submission', true);
        } finally {
          setConfirmModal(null);
        }
      }
    });
  };

  return (
    <PageTransition>
      <div className="bg-dark-950 min-h-screen pt-20 pb-20 text-gray-200 select-none">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">

          {/* Top Header Controls */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-6 border-b border-white/10 gap-4">
            <div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-brand-red shadow-glow-red animate-pulse" />
                <span className="text-xs font-black uppercase tracking-widest text-brand-red font-mono">
                  THEOFFBEAT ADMIN PANEL
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black font-heading text-white uppercase mt-1">
                Dashboard Controls
              </h1>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
              <button
                onClick={loadAdminData}
                disabled={loading}
                className="px-3.5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 transition-all cursor-pointer"
                title="Refresh All Data"
              >
                <RefreshCw size={15} className={loading ? 'animate-spin' : ''} />
                <span className="hidden sm:inline">Refresh</span>
              </button>

              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-950/80 hover:bg-brand-red border border-red-500/30 text-white rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all shadow-glow-red cursor-pointer"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          </div>

          {/* Toast Notification Alert */}
          {messageToast && (
            <div className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-xl ${
              messageToast.isError
                ? 'bg-red-950 border-red-500/40 text-red-300'
                : 'bg-emerald-950 border-emerald-500/40 text-emerald-300'
            }`}>
              <div className="flex items-center gap-2">
                {messageToast.isError ? <ShieldAlert size={16} /> : <Check size={16} />}
                <span>{messageToast.text}</span>
              </div>
              <button onClick={() => setMessageToast(null)} className="text-white/60 hover:text-white">
                <X size={14} />
              </button>
            </div>
          )}

          {/* Mobile Responsive Swipe Navigation Bar */}
          <div className="flex items-center gap-2 overflow-x-auto pb-3 pt-2 no-scrollbar border-b border-white/10">
            <button
              onClick={() => setActiveTab('songs')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                activeTab === 'songs' ? 'bg-brand-red text-white shadow-glow-red' : 'bg-dark-900 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Music size={15} />
              <span>Songs ({songs.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('reels')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                activeTab === 'reels' ? 'bg-brand-red text-white shadow-glow-red' : 'bg-dark-900 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Film size={15} />
              <span>Reels ({reels.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('lyrics')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                activeTab === 'lyrics' ? 'bg-brand-red text-white shadow-glow-red' : 'bg-dark-900 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <PenTool size={15} />
              <span>Fan Lyrics ({lyricsList.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('subscribers')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                activeTab === 'subscribers' ? 'bg-brand-red text-white shadow-glow-red' : 'bg-dark-900 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Mail size={15} />
              <span>Subscribers ({subscribers.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('messages')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                activeTab === 'messages' ? 'bg-brand-red text-white shadow-glow-red' : 'bg-dark-900 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare size={15} />
              <span>Messages ({messages.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('comments')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                activeTab === 'comments' ? 'bg-brand-red text-white shadow-glow-red' : 'bg-dark-900 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <MessageSquare size={15} />
              <span>Comments ({comments.length})</span>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider flex items-center gap-2 shrink-0 transition-all cursor-pointer ${
                activeTab === 'settings' ? 'bg-brand-red text-white shadow-glow-red' : 'bg-dark-900 border border-white/10 text-gray-400 hover:text-white'
              }`}
            >
              <Settings size={15} />
              <span>Settings</span>
            </button>
          </div>

          {/* TAB 1: SONGS MANAGEMENT */}
          {activeTab === 'songs' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold font-heading uppercase text-white">Manage Songs</h3>
                  <p className="text-xs text-gray-400">Add, edit, or delete tracks from your public music catalog.</p>
                </div>
                <button
                  onClick={handleOpenAddSong}
                  className="px-4 py-2 bg-brand-red hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 shadow-glow-red cursor-pointer"
                >
                  <Plus size={16} /> Add New Song
                </button>
              </div>

              {/* Songs List Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {songs.map(song => (
                  <div key={song.id} className="p-4 bg-dark-900 border border-white/10 rounded-2xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3 w-full sm:w-auto">
                      <img src={song.thumbnail_url} alt="" className="w-20 h-14 object-cover rounded-xl shrink-0" />
                      <div className="min-w-0">
                        <h4 className="font-bold text-white text-base truncate">{song.title}</h4>
                        <p className="text-xs text-gray-400 truncate">{song.release_type} • {song.release_date}</p>
                        {song.is_latest && <span className="text-[10px] text-brand-red font-bold uppercase tracking-wider block">Top #1 Hero Banner</span>}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 w-full sm:w-auto justify-end border-t sm:border-t-0 border-white/10 pt-3 sm:pt-0">
                      <button
                        onClick={() => handleOpenEditSong(song)}
                        className="px-3.5 py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => promptDeleteSong(song.id, song.title)}
                        className="px-3.5 py-2 bg-red-950 hover:bg-brand-red text-red-300 hover:text-white border border-red-500/30 rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 cursor-pointer transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 2: REELS MANAGEMENT */}
          {activeTab === 'reels' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold font-heading uppercase text-white">Manage Reels & Shorts</h3>
                  <p className="text-xs text-gray-400">Add, edit, or delete 9:16 YouTube Shorts & Instagram Reels.</p>
                </div>
                <button
                  onClick={handleOpenAddReel}
                  className="px-4 py-2 bg-brand-red hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1.5 shadow-glow-red cursor-pointer"
                >
                  <Plus size={16} /> Add Reel
                </button>
              </div>

              {/* Reels Grid with BOTH Edit and Delete */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {reels.map(reel => (
                  <div key={reel.id} className="p-4 bg-dark-900 border border-white/10 rounded-2xl flex flex-col justify-between space-y-3">
                    <div className="relative aspect-[9/16] rounded-xl overflow-hidden bg-black border border-white/5">
                      <img src={reel.thumbnail_url || 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=600&h=1066&q=80'} alt="" className="w-full h-full object-cover" />
                      <div className="absolute top-2 right-2 px-2 py-1 bg-black/80 backdrop-blur-md rounded-md text-[10px] text-brand-red font-mono font-bold">
                        9:16 REEL
                      </div>
                    </div>

                    <div>
                      <h4 className="font-bold text-white text-sm truncate">{reel.title || 'Reel Short'}</h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-0.5">{reel.caption || reel.reel_url}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 pt-2 border-t border-white/10">
                      <button
                        onClick={() => handleOpenEditReel(reel)}
                        className="w-full py-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => promptDeleteReel(reel.id, reel.title)}
                        className="w-full py-2 bg-red-950 hover:bg-brand-red text-red-300 hover:text-white border border-red-500/30 rounded-xl text-xs font-bold uppercase flex items-center justify-center gap-1 cursor-pointer transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: FAN LYRICS MODERATION */}
          {activeTab === 'lyrics' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <div>
                  <h3 className="text-xl font-bold font-heading uppercase text-white">Fan Lyrics Submissions</h3>
                  <p className="text-xs text-gray-400">Review submissions, approve for official songs, or feature on website spotlight.</p>
                </div>
              </div>

              {lyricsList.length === 0 ? (
                <div className="p-8 text-center bg-dark-900 border border-white/10 rounded-2xl text-gray-400 text-sm">
                  No lyrics submitted by fans yet.
                </div>
              ) : (
                <div className="space-y-4">
                  {lyricsList.map((item) => (
                    <div key={item.id} className="p-5 bg-dark-900 border border-white/10 rounded-2xl space-y-3 shadow-lg">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/5 pb-3">
                        <div>
                          <h4 className="font-bold text-white text-base">{item.writer_name} ({item.email})</h4>
                          <p className="text-xs text-brand-red font-semibold mt-0.5">
                            Title: {item.song_title || 'Untitled'} • Genre: {item.genre} • Date: {item.created_at ? new Date(item.created_at).toLocaleDateString() : 'Recent'}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <select
                            value={item.status}
                            onChange={(e) => handleUpdateLyricStatus(item.id, e.target.value)}
                            className="px-3 py-2 bg-dark-950 border border-white/20 rounded-xl text-xs font-bold text-white focus:border-brand-red focus:outline-none"
                          >
                            <option value="pending">Pending Review</option>
                            <option value="featured">Featured Lyricist (Public)</option>
                            <option value="approved_for_song">Approved for Official Song 🎵</option>
                            <option value="rejected">Rejected</option>
                          </select>

                          <button
                            onClick={() => promptDeleteLyric(item.id, item.writer_name)}
                            className="p-2 bg-red-950 text-red-300 hover:bg-brand-red hover:text-white border border-red-500/30 rounded-xl transition-colors cursor-pointer"
                            title="Delete submission"
                          >
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </div>

                      <div className="bg-dark-950 p-4 rounded-xl border border-white/5 text-xs text-gray-300 font-mono leading-relaxed whitespace-pre-line">
                        {item.lyrics}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* TAB 4: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-heading uppercase text-white">Newsletter Subscribers</h3>
              <div className="space-y-3">
                {subscribers.map(sub => (
                  <div key={sub.id} className="p-4 bg-dark-900 border border-white/10 rounded-2xl flex items-center justify-between gap-4">
                    <div>
                      <h4 className="font-bold text-white text-sm">{sub.email}</h4>
                      <span className="text-xs text-gray-500 font-mono">Subscribed: {sub.subscribed_at ? new Date(sub.subscribed_at).toLocaleDateString() : 'N/A'}</span>
                    </div>
                    <button onClick={() => promptDeleteSub(sub.id, sub.email)} className="px-3 py-1.5 bg-red-950 hover:bg-brand-red text-red-300 hover:text-white rounded-xl text-xs font-bold uppercase flex items-center gap-1 cursor-pointer border border-red-500/30">
                      <Trash2 size={14} /> Remove
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-4">
              <h3 className="text-xl font-bold font-heading uppercase text-white">Contact Messages</h3>
              <div className="space-y-3">
                {messages.map(msg => (
                  <div key={msg.id} className={`p-5 rounded-2xl border ${msg.is_read ? 'bg-dark-900/60 border-white/10' : 'bg-dark-900 border-brand-red/40 shadow-glow-red'}`}>
                    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-2">
                      <div>
                        <h4 className="font-bold text-white text-base">{msg.name} ({msg.email})</h4>
                        <span className="text-xs text-brand-red font-semibold">{msg.subject}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        {!msg.is_read && (
                          <button onClick={() => handleMarkRead(msg.id)} className="px-3 py-1.5 bg-emerald-950 border border-emerald-500/40 text-emerald-300 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer">
                            <Check size={14} /> Mark Read
                          </button>
                        )}
                        <button onClick={() => promptDeleteMsg(msg.id, msg.name)} className="px-3 py-1.5 bg-red-950 hover:bg-brand-red text-red-300 hover:text-white border border-red-500/30 rounded-xl text-xs font-bold flex items-center gap-1 cursor-pointer">
                          <Trash2 size={14} /> Delete
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-gray-300 leading-relaxed bg-dark-950/60 p-3 rounded-xl border border-white/5 mt-2">
                      {msg.message}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: COMMENTS MODERATION */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="flex justify-between items-center">
                <h3 className="text-xl font-bold font-heading uppercase text-white">Song Comments Moderation</h3>
              </div>

              <div className="space-y-3">
                {comments.map((comment) => (
                  <div key={comment.id} className="p-5 bg-dark-900 border border-white/10 rounded-2xl space-y-2">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-white/5 pb-2">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-white text-sm">{comment.author_name}</span>
                        <span className="text-xs text-brand-red font-semibold">• {comment.song_title}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleComment(comment.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer ${
                            comment.is_approved
                              ? 'bg-emerald-950 border border-emerald-500/40 text-emerald-300'
                              : 'bg-amber-950 border border-amber-500/40 text-amber-300'
                          }`}
                        >
                          {comment.is_approved ? <Eye size={14} /> : <EyeOff size={14} />}
                          <span>{comment.is_approved ? 'Approved' : 'Hidden'}</span>
                        </button>

                        <button
                          onClick={() => promptDeleteComment(comment.id, comment.author_name)}
                          className="p-1.5 bg-red-950 text-red-300 hover:bg-brand-red hover:text-white border border-red-500/30 rounded-xl cursor-pointer"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </div>
                    <p className="text-xs text-gray-300 bg-dark-950/60 p-3 rounded-xl border border-white/5">
                      "{comment.content}"
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: SETTINGS */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="bg-dark-900 border border-white/10 p-6 sm:p-8 rounded-3xl space-y-5 max-w-2xl">
              <h3 className="text-xl font-bold font-heading uppercase text-white">Site Settings</h3>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Duo Name</label>
                <input type="text" value={settings.duo_name || ''} onChange={e => setSettings({...settings, duo_name: e.target.value})} className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-white text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Tagline</label>
                <input type="text" value={settings.tagline || ''} onChange={e => setSettings({...settings, tagline: e.target.value})} className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-white text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Contact Email</label>
                <input type="email" value={settings.contact_email || ''} onChange={e => setSettings({...settings, contact_email: e.target.value})} className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-white text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">Instagram URL</label>
                <input type="text" value={settings.instagram_url || ''} onChange={e => setSettings({...settings, instagram_url: e.target.value})} className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-white text-sm" />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-gray-400 mb-1">YouTube URL</label>
                <input type="text" value={settings.youtube_url || ''} onChange={e => setSettings({...settings, youtube_url: e.target.value})} className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-white text-sm" />
              </div>

              <button type="submit" className="w-full py-3.5 bg-brand-red text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-red cursor-pointer">
                Save All Settings
              </button>
            </form>
          )}

        </div>
      </div>


      {/* CUSTOM CONFIRMATION POPUP MODAL (REPLACES BROWSER CONFIRM) */}
      {confirmModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-dark-900 border border-brand-red/50 rounded-3xl p-6 sm:p-8 max-w-md w-full space-y-5 shadow-2xl animate-in fade-in zoom-in duration-200">
            <div className="w-12 h-12 rounded-full bg-red-950 border border-brand-red/40 flex items-center justify-center text-brand-red mx-auto shadow-glow-red">
              <AlertTriangle size={24} />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-xl font-bold font-heading text-white uppercase tracking-wide">
                {confirmModal.title || 'Confirm Action'}
              </h3>
              <p className="text-sm text-gray-300 leading-relaxed">
                {confirmModal.message}
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3 pt-2">
              <button
                onClick={() => setConfirmModal(null)}
                className="w-full py-3 bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-xs uppercase tracking-wider rounded-xl transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={confirmModal.onConfirm}
                className="w-full py-3 bg-brand-red hover:bg-red-600 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-red transition-all cursor-pointer"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}


      {/* CUSTOM EDIT / CREATE SONG POPUP MODAL */}
      {editingSong !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-900 border border-brand-red/50 p-6 sm:p-8 rounded-3xl space-y-5 shadow-2xl max-w-2xl w-full my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h4 className="font-bold font-heading text-white uppercase text-lg flex items-center gap-2">
                <Music size={20} className="text-brand-red" />
                <span>{editingSong.id ? `Edit Song: ${editingSong.title}` : 'Add New Song to Catalog'}</span>
              </h4>
              <button onClick={() => setEditingSong(null)} className="p-1 text-gray-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveSong} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Song Title *</label>
                  <input
                    type="text" placeholder="e.g. KHAMOSHI MEIN MAAFI"
                    value={songForm.title} onChange={e => setSongForm({...songForm, title: e.target.value})}
                    required className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Release Type</label>
                  <input
                    type="text" placeholder="e.g. 2026 Hip-Hop Song 🎧"
                    value={songForm.release_type} onChange={e => setSongForm({...songForm, release_type: e.target.value})}
                    required className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Release Date</label>
                  <input
                    type="text" placeholder="e.g. July 2026"
                    value={songForm.release_date} onChange={e => setSongForm({...songForm, release_date: e.target.value})}
                    required className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Duration</label>
                  <input
                    type="text" placeholder="e.g. 3:45"
                    value={songForm.duration} onChange={e => setSongForm({...songForm, duration: e.target.value})}
                    className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Thumbnail Image URL *</label>
                  <input
                    type="text" placeholder="https://img.youtube.com/vi/.../hqdefault.jpg"
                    value={songForm.thumbnail_url} onChange={e => setSongForm({...songForm, thumbnail_url: e.target.value})}
                    required className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">YouTube Video URL</label>
                  <input
                    type="text" placeholder="https://youtu.be/..."
                    value={songForm.youtube_url} onChange={e => setSongForm({...songForm, youtube_url: e.target.value})}
                    className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:border-brand-red"
                  />
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Description / Lyrics Overview</label>
                <textarea
                  rows="3" placeholder="Song description..."
                  value={songForm.description} onChange={e => setSongForm({...songForm, description: e.target.value})}
                  className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:border-brand-red"
                />
              </div>

              <div className="flex flex-wrap items-center gap-6 text-xs text-gray-300">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={songForm.is_latest} onChange={e => setSongForm({...songForm, is_latest: e.target.checked})} className="accent-brand-red" />
                  <span>Set as Top #1 Hero Release</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input type="checkbox" checked={songForm.is_popular} onChange={e => setSongForm({...songForm, is_popular: e.target.checked})} className="accent-brand-red" />
                  <span>Mark as Popular</span>
                </label>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setEditingSong(null)} className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold uppercase cursor-pointer">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-brand-red hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase shadow-glow-red cursor-pointer">Save Song</button>
              </div>
            </form>
          </div>
        </div>
      )}


      {/* CUSTOM EDIT / CREATE REEL POPUP MODAL */}
      {editingReel !== null && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-dark-900 border border-brand-red/50 p-6 sm:p-8 rounded-3xl space-y-5 shadow-2xl max-w-xl w-full my-8">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h4 className="font-bold font-heading text-white uppercase text-lg flex items-center gap-2">
                <Film size={20} className="text-brand-red" />
                <span>{editingReel.id ? `Edit Reel: ${editingReel.title}` : 'Add New Short or Reel'}</span>
              </h4>
              <button onClick={() => setEditingReel(null)} className="p-1 text-gray-400 hover:text-white cursor-pointer">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSaveReel} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Title / Short Name *</label>
                  <input
                    type="text" placeholder="e.g. TheOFFBeat Official Short"
                    value={reelForm.title} onChange={e => setReelForm({...reelForm, title: e.target.value})}
                    required className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Reel / YouTube Short URL *</label>
                  <input
                    type="text" placeholder="https://youtube.com/shorts/... or Instagram Reel link"
                    value={reelForm.reel_url} onChange={e => setReelForm({...reelForm, reel_url: e.target.value})}
                    required className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Thumbnail Image URL</label>
                  <input
                    type="text" placeholder="https://img.youtube.com/vi/.../hqdefault.jpg"
                    value={reelForm.thumbnail_url} onChange={e => setReelForm({...reelForm, thumbnail_url: e.target.value})}
                    className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:border-brand-red"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-gray-300 uppercase block mb-1">Caption / Description</label>
                  <input
                    type="text" placeholder="e.g. Official YouTube Short by TheOFFBeat..."
                    value={reelForm.caption} onChange={e => setReelForm({...reelForm, caption: e.target.value})}
                    className="w-full px-4 py-2.5 bg-dark-950 border border-white/15 rounded-xl text-sm text-white focus:border-brand-red"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-3 border-t border-white/10">
                <button type="button" onClick={() => setEditingReel(null)} className="px-5 py-2.5 bg-gray-800 hover:bg-gray-700 text-gray-300 rounded-xl text-xs font-bold uppercase cursor-pointer">Cancel</button>
                <button type="submit" className="px-6 py-2.5 bg-brand-red hover:bg-red-600 text-white rounded-xl text-xs font-bold uppercase shadow-glow-red cursor-pointer">Save Reel</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </PageTransition>
  );
}
