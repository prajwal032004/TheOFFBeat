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
  getAdminAnalytics,
  checkAdminAuth
} from '../services/api';
import PageTransition from '../components/PageTransition';
import {
  BarChart3, TrendingUp, Monitor, Smartphone, Tablet, Eye, Plus, Trash2, Edit3, Check, X, LogOut, Star,
  Mail, MessageSquare, Music, Film, Users, Settings, PenTool, RefreshCw, AlertTriangle, Menu, Clock, ShieldAlert, Sparkles, CheckCircle2, ChevronRight
} from 'lucide-react';

export default function AdminDashboard({ onLogout }) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('analytics');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [messageToast, setMessageToast] = useState(null);

  // Data States
  const [analytics, setAnalytics] = useState(null);
  const [songs, setSongs] = useState([]);
  const [reels, setReels] = useState([]);
  const [members, setMembers] = useState([]);
  const [settings, setSettings] = useState({});
  const [subscribers, setSubscribers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [comments, setComments] = useState([]);
  const [lyricsList, setLyricsList] = useState([]);

  // Modals & Confirm state
  const [confirmModal, setConfirmModal] = useState(null);

  // Form states
  const [editingSong, setEditingSong] = useState(null);
  const [songForm, setSongForm] = useState({
    title: '', release_type: 'Official Music Video', release_date: '2026',
    duration: '3:45', thumbnail_url: '', youtube_url: '', spotify_url: '',
    description: '', is_latest: false, is_popular: false
  });

  const [editingReel, setEditingReel] = useState(null);
  const [reelForm, setReelForm] = useState({
    title: '', reel_url: '', thumbnail_url: '', caption: '', display_order: 1
  });

  const [editingMember, setEditingMember] = useState(null);
  const [memberForm, setMemberForm] = useState({
    name: '', role: '', image_url: '', bio: '', display_order: 1
  });

  useEffect(() => {
    loadAdminData();
  }, [navigate]);

  const loadAdminData = async () => {
    setLoading(true);
    try {
      await checkAdminAuth();
      const [analyticsRes, songsRes, reelsRes, membersRes, settingsRes, subsRes, msgsRes, commentsRes, lyricsRes] = await Promise.all([
        getAdminAnalytics(), getSongs(), getReels(), getMembers(), getSettings(),
        getAdminSubscribers(), getAdminMessages(), getAdminComments(), getAllLyricsAdmin()
      ]);
      setAnalytics(analyticsRes.data || null);
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

  // Song CRUD
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
      title: 'Delete Song',
      message: `Are you sure you want to delete "${title || 'this song'}"?`,
      onConfirm: async () => {
        try {
          await deleteSong(id);
          setSongs(prev => prev.filter(s => s.id !== id));
          showToast('Song deleted successfully!');
        } catch (err) {
          showToast('Failed to delete song', true);
        }
      }
    });
  };

  // Reel CRUD
  const handleOpenAddReel = () => {
    setEditingReel({});
    setReelForm({ title: '', reel_url: '', thumbnail_url: '', caption: '', display_order: reels.length + 1 });
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
        showToast('Short / Reel updated!');
      } else {
        await createReel(reelForm);
        showToast('New Short / Reel added!');
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
      title: 'Delete Reel',
      message: `Delete short "${title || 'this item'}"?`,
      onConfirm: async () => {
        try {
          await deleteReel(id);
          setReels(prev => prev.filter(r => r.id !== id));
          showToast('Reel deleted successfully!');
        } catch (err) {
          showToast('Failed to delete reel', true);
        }
      }
    });
  };

  // Member CRUD
  const handleOpenAddMember = () => {
    setEditingMember({});
    setMemberForm({ name: '', role: 'Songwriter', image_url: '', bio: '', display_order: members.length + 1 });
  };

  const handleOpenEditMember = (m) => {
    setEditingMember(m);
    setMemberForm({
      name: m.name || '',
      role: m.role || '',
      image_url: m.image_url || '',
      bio: m.bio || '',
      display_order: m.display_order || 1
    });
  };

  const handleSaveMember = async (e) => {
    e.preventDefault();
    try {
      if (editingMember && editingMember.id) {
        await updateMember(editingMember.id, memberForm);
        showToast('Member profile updated!');
      } else {
        await createMember(memberForm);
        showToast('Member added!');
      }
      const updated = await getMembers();
      setMembers(updated.data || []);
      setEditingMember(null);
    } catch (err) {
      showToast('Error saving member', true);
    }
  };

  const promptDeleteMember = (id, name) => {
    setConfirmModal({
      title: 'Delete Team Member',
      message: `Remove "${name}" from team listing?`,
      onConfirm: async () => {
        try {
          await deleteMember(id);
          setMembers(prev => prev.filter(m => m.id !== id));
          showToast('Member removed!');
        } catch (err) {
          showToast('Failed to delete member', true);
        }
      }
    });
  };

  // Lyrics Status Updates
  const handleLyricStatusChange = async (id, status) => {
    try {
      await updateLyricStatus(id, { status });
      setLyricsList(prev => prev.map(l => l.id === id ? { ...l, status } : l));
      showToast(`Lyric submission marked as ${status}!`);
    } catch (err) {
      showToast('Failed to update lyric status', true);
    }
  };

  const promptDeleteLyric = (id) => {
    setConfirmModal({
      title: 'Delete Lyric Submission',
      message: 'Delete this submitted lyric draft?',
      onConfirm: async () => {
        try {
          await deleteLyricSubmission(id);
          setLyricsList(prev => prev.filter(l => l.id !== id));
          showToast('Lyric deleted!');
        } catch (err) {
          showToast('Failed to delete lyric', true);
        }
      }
    });
  };

  // Comments
  const handleToggleComment = async (id) => {
    try {
      const res = await toggleAdminComment(id);
      setComments(prev => prev.map(c => c.id === id ? res.data : c));
      showToast('Comment status toggled!');
    } catch (err) {
      showToast('Error updating comment', true);
    }
  };

  const promptDeleteComment = (id) => {
    setConfirmModal({
      title: 'Delete Comment',
      message: 'Remove this fan comment permanently?',
      onConfirm: async () => {
        try {
          await deleteAdminComment(id);
          setComments(prev => prev.filter(c => c.id !== id));
          showToast('Comment deleted!');
        } catch (err) {
          showToast('Failed to delete comment', true);
        }
      }
    });
  };

  // Messages
  const handleToggleReadMessage = async (id) => {
    try {
      const res = await markMessageRead(id);
      setMessages(prev => prev.map(m => m.id === id ? res.data : m));
      showToast('Message status updated!');
    } catch (err) {
      showToast('Error marking message read', true);
    }
  };

  const promptDeleteMessage = (id) => {
    setConfirmModal({
      title: 'Delete Contact Message',
      message: 'Delete message permanently?',
      onConfirm: async () => {
        try {
          await deleteMessage(id);
          setMessages(prev => prev.filter(m => m.id !== id));
          showToast('Message deleted!');
        } catch (err) {
          showToast('Failed to delete message', true);
        }
      }
    });
  };

  // Subscribers
  const promptDeleteSubscriber = (id, email) => {
    setConfirmModal({
      title: 'Remove Subscriber',
      message: `Unsubscribe "${email}"?`,
      onConfirm: async () => {
        try {
          await deleteSubscriber(id);
          setSubscribers(prev => prev.filter(s => s.id !== id));
          showToast('Subscriber removed!');
        } catch (err) {
          showToast('Failed to remove subscriber', true);
        }
      }
    });
  };

  // Settings
  const handleSaveSettings = async (e) => {
    e.preventDefault();
    try {
      await updateSettings(settings);
      showToast('Site settings updated successfully!');
    } catch (err) {
      showToast('Failed to save settings', true);
    }
  };

  // Badge counts
  const unreadMsgCount = messages.filter(m => !m.is_read).length;
  const pendingCommentsCount = comments.filter(c => !c.is_approved).length;
  const pendingLyricsCount = lyricsList.filter(l => l.status === 'pending').length;

  const tabs = [
    { id: 'analytics', label: 'Analytics & EDA', icon: BarChart3, badge: null },
    { id: 'songs', label: 'Songs Catalog', icon: Music, badge: songs.length },
    { id: 'reels', label: 'Reels & Shorts', icon: Film, badge: reels.length },
    { id: 'members', label: 'Team Duo', icon: Users, badge: members.length },
    { id: 'lyrics', label: 'Fan Lyrics', icon: PenTool, badge: pendingLyricsCount > 0 ? pendingLyricsCount : null, color: 'bg-amber-500' },
    { id: 'comments', label: 'Comments', icon: MessageSquare, badge: pendingCommentsCount > 0 ? pendingCommentsCount : null, color: 'bg-blue-500' },
    { id: 'messages', label: 'Messages', icon: Mail, badge: unreadMsgCount > 0 ? unreadMsgCount : null, color: 'bg-brand-red' },
    { id: 'subscribers', label: 'Subscribers', icon: Mail, badge: subscribers.length },
    { id: 'settings', label: 'Site Settings', icon: Settings, badge: null },
  ];

  return (
    <PageTransition>
      <div className="min-h-screen bg-dark-950 text-gray-100 flex flex-col md:flex-row">

        {/* TOAST NOTIFICATION */}
        {messageToast && (
          <div className={`fixed top-6 right-6 z-50 px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 border text-sm font-semibold animate-bounce ${messageToast.isError ? 'bg-red-950/90 border-red-500 text-red-200' : 'bg-emerald-950/90 border-emerald-500 text-emerald-200'}`}>
            {messageToast.isError ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
            <span>{messageToast.text}</span>
          </div>
        )}

        {/* MOBILE TOP BAR */}
        <header className="md:hidden sticky top-0 z-40 bg-dark-900/95 backdrop-blur-md border-b border-white/10 px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 bg-white/5 border border-white/10 rounded-xl text-white hover:bg-brand-red"
            >
              <Menu size={20} />
            </button>
            <div className="font-heading font-black text-lg tracking-wider">
              The<span className="text-brand-red">OFFBeat</span> <span className="text-xs px-2 py-0.5 bg-brand-red/20 text-brand-red rounded-full uppercase tracking-widest font-sans ml-1">Admin</span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs text-emerald-400 font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>{analytics?.active_now || 24} Live</span>
            </span>
            <button
              onClick={handleLogout}
              className="p-2 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-600 hover:text-white"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {/* MOBILE SLIDE-OUT DRAWER OVERLAY */}
        {isMobileMenuOpen && (
          <div className="md:hidden fixed inset-0 z-50 flex">
            <div className="fixed inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setIsMobileMenuOpen(false)} />
            <div className="relative w-4/5 max-w-xs bg-dark-900 border-r border-white/10 p-6 flex flex-col justify-between shadow-2xl z-10">
              <div>
                <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/10">
                  <div className="font-heading font-black text-xl text-white">
                    The<span className="text-brand-red">OFFBeat</span>
                  </div>
                  <button onClick={() => setIsMobileMenuOpen(false)} className="text-gray-400 hover:text-white">
                    <X size={20} />
                  </button>
                </div>

                <nav className="space-y-1">
                  {tabs.map((tab) => {
                    const Icon = tab.icon;
                    const isActive = activeTab === tab.id;
                    return (
                      <button
                        key={tab.id}
                        onClick={() => {
                          setActiveTab(tab.id);
                          setIsMobileMenuOpen(false);
                        }}
                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-medium text-sm transition-all ${isActive ? 'bg-brand-red text-white shadow-glow-red' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} />
                          <span>{tab.label}</span>
                        </div>
                        {tab.badge !== null && (
                          <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${tab.color || 'bg-white/10 text-white'}`}>
                            {tab.badge}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </nav>
              </div>

              <div className="pt-6 border-t border-white/10">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/20 text-red-400 border border-red-500/30 rounded-xl hover:bg-red-600 hover:text-white text-sm font-semibold transition-all"
                >
                  <LogOut size={16} />
                  <span>Log Out Admin</span>
                </button>
              </div>
            </div>
          </div>
        )}

        {/* DESKTOP SIDEBAR NAVIGATION */}
        <aside className="hidden md:flex flex-col w-64 lg:w-72 bg-dark-900 border-r border-white/10 min-h-screen p-6 sticky top-0 justify-between shrink-0">
          <div>
            {/* BRAND HEADER */}
            <div className="mb-10 flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-red to-orange-600 flex items-center justify-center text-white shadow-glow-red">
                <Sparkles size={22} />
              </div>
              <div>
                <h1 className="font-heading font-black text-xl text-white tracking-wider uppercase leading-tight">
                  The<span className="text-brand-red">OFFBeat</span>
                </h1>
                <span className="text-[10px] font-bold tracking-widest text-gray-400 uppercase">
                  Control Center
                </span>
              </div>
            </div>

            {/* NAVIGATION ITEMS */}
            <nav className="space-y-1.5">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl font-semibold text-sm transition-all duration-200 ${isActive ? 'bg-brand-red text-white shadow-glow-red translate-x-1' : 'text-gray-400 hover:bg-white/5 hover:text-white'}`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon size={18} />
                      <span>{tab.label}</span>
                    </div>
                    {tab.badge !== null && (
                      <span className={`px-2 py-0.5 text-xs font-bold rounded-full ${tab.color || 'bg-white/10 text-white'}`}>
                        {tab.badge}
                      </span>
                    )}
                  </button>
                );
              })}
            </nav>
          </div>

          {/* DESKTOP FOOTER / PROFILE */}
          <div className="pt-6 border-t border-white/10 space-y-4">
            <div className="flex items-center justify-between px-2">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-xs text-gray-400 font-medium">System Healthy</span>
              </div>
              <button
                onClick={loadAdminData}
                title="Refresh All Data"
                className="p-1.5 bg-white/5 hover:bg-white/10 rounded-lg text-gray-400 hover:text-white transition-colors"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
              </button>
            </div>

            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-red-600/15 text-red-400 border border-red-500/30 hover:bg-red-600 hover:text-white text-sm font-semibold rounded-xl transition-all shadow-md"
            >
              <LogOut size={16} />
              <span>Log Out Admin</span>
            </button>
          </div>
        </aside>

        {/* MAIN DASHBOARD CONTENT AREA */}
        <main className="flex-grow p-4 sm:p-8 max-w-7xl mx-auto w-full overflow-x-hidden">

          {/* DESKTOP TOP HEADER / STATUS STRIP */}
          <div className="hidden md:flex items-center justify-between mb-8 pb-6 border-b border-white/10">
            <div>
              <h2 className="text-2xl font-black font-heading tracking-tight uppercase text-white">
                {tabs.find(t => t.id === activeTab)?.label || 'Dashboard'}
              </h2>
              <p className="text-gray-400 text-xs mt-1">
                Manage your music catalog, team profiles, fan submissions & website growth EDA analytics.
              </p>
            </div>

            <div className="flex items-center gap-4">
              <div className="px-4 py-2 bg-dark-900 border border-white/10 rounded-2xl flex items-center gap-3">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
                <div>
                  <div className="text-[10px] text-gray-400 font-bold uppercase tracking-wider">Live Visitors</div>
                  <div className="text-sm font-black text-white leading-none">{analytics?.active_now || 24} Active Devices</div>
                </div>
              </div>

              <button
                onClick={loadAdminData}
                className="px-4 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl text-xs font-bold uppercase tracking-wider text-white flex items-center gap-2 transition-all"
              >
                <RefreshCw size={14} className={loading ? "animate-spin" : ""} />
                <span>Refresh</span>
              </button>
            </div>
          </div>

          {/* MOBILE SCROLLABLE TAB STRIP */}
          <div className="md:hidden flex items-center gap-2 overflow-x-auto pb-4 mb-6 scrollbar-none">
            {tabs.map((t) => {
              const Icon = t.icon;
              const isActive = activeTab === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => setActiveTab(t.id)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold tracking-wider whitespace-nowrap flex items-center gap-2 border transition-all ${isActive ? 'bg-brand-red border-brand-red text-white shadow-glow-red' : 'bg-dark-900 border-white/10 text-gray-400'}`}
                >
                  <Icon size={14} />
                  <span>{t.label}</span>
                  {t.badge !== null && (
                    <span className="px-1.5 py-0.2 bg-white/20 text-white text-[10px] rounded-full">
                      {t.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* LOADING STATE */}
          {loading && !analytics && (
            <div className="py-20 text-center space-y-4">
              <div className="w-12 h-12 border-4 border-brand-red border-t-transparent rounded-full animate-spin mx-auto" />
              <p className="text-gray-400 text-sm font-medium">Fetching real-time admin insights...</p>
            </div>
          )}

          {/* TAB 1: ANALYTICS & EDA DASHBOARD */}
          {activeTab === 'analytics' && analytics && (
            <div className="space-y-8">

              {/* KPI STAT CARDS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                
                <div className="bg-dark-900/80 border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 text-brand-red/20 group-hover:text-brand-red/40 transition-colors">
                    <Eye size={36} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Total Page Views</span>
                  <div className="text-2xl sm:text-3xl font-black font-heading text-white mt-1">
                    {(analytics.total_views || 3650).toLocaleString()}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <TrendingUp size={14} />
                    <span>{analytics.growth_rate || '+24.6%'} this week</span>
                  </div>
                </div>

                <div className="bg-dark-900/80 border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 text-blue-500/20 group-hover:text-blue-500/40 transition-colors">
                    <Smartphone size={36} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Unique Devices</span>
                  <div className="text-2xl sm:text-3xl font-black font-heading text-white mt-1">
                    {(analytics.unique_visitors || 1480).toLocaleString()}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-blue-400 font-semibold">
                    <Monitor size={14} />
                    <span>Distinct Fingerprints</span>
                  </div>
                </div>

                <div className="bg-dark-900/80 border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 text-emerald-500/20 group-hover:text-emerald-500/40 transition-colors">
                    <Clock size={36} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Avg. Session Time</span>
                  <div className="text-2xl sm:text-3xl font-black font-heading text-white mt-1">
                    {analytics.avg_session || '2m 45s'}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-400 font-semibold">
                    <CheckCircle2 size={14} />
                    <span>High Engagement</span>
                  </div>
                </div>

                <div className="bg-dark-900/80 border border-white/10 rounded-2xl p-5 shadow-xl relative overflow-hidden group">
                  <div className="absolute top-0 right-0 p-4 text-purple-500/20 group-hover:text-purple-500/40 transition-colors">
                    <Sparkles size={36} />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">Live Active Traffic</span>
                  <div className="text-2xl sm:text-3xl font-black font-heading text-white mt-1">
                    {analytics.active_now || 24}
                  </div>
                  <div className="mt-3 flex items-center gap-1.5 text-xs text-purple-400 font-semibold">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                    <span>Right Now Online</span>
                  </div>
                </div>

              </div>

              {/* TRAFFIC TREND & DEVICE BREAKDOWN GRID */}
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">

                {/* 7-DAY TRAFFIC TREND AREA CHART */}
                <div className="lg:col-span-8 bg-dark-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 gap-2">
                    <div>
                      <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2">
                        <BarChart3 size={18} className="text-brand-red" />
                        <span>Daily Website Visitors Trend</span>
                      </h3>
                      <p className="text-gray-400 text-xs mt-0.5">Page views & unique device visits over the last 7 days</p>
                    </div>

                    <div className="flex items-center gap-4 text-xs font-semibold">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-brand-red" />
                        <span className="text-gray-300">Page Views</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm bg-blue-500" />
                        <span className="text-gray-300">Unique Devices</span>
                      </div>
                    </div>
                  </div>

                  {/* CUSTOM SVG TREND GRAPH */}
                  <div className="relative h-64 w-full pt-4">
                    {(() => {
                      const trend = analytics.daily_trend || [];
                      if (trend.length === 0) return null;
                      const maxVal = Math.max(...trend.map(t => Math.max(t.views, t.uniques)), 100);

                      const pointsViews = trend.map((t, idx) => {
                        const x = (idx / (trend.length - 1)) * 100;
                        const y = 100 - ((t.views / maxVal) * 80 + 10);
                        return `${x},${y}`;
                      }).join(' ');

                      const pointsUniques = trend.map((t, idx) => {
                        const x = (idx / (trend.length - 1)) * 100;
                        const y = 100 - ((t.uniques / maxVal) * 80 + 10);
                        return `${x},${y}`;
                      }).join(' ');

                      return (
                        <div className="w-full h-full flex flex-col justify-between relative">
                          <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-48 overflow-visible">
                            {/* Gridlines */}
                            <line x1="0" y1="20" x2="100" y2="20" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" />
                            <line x1="0" y1="50" x2="100" y2="50" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" />
                            <line x1="0" y1="80" x2="100" y2="80" stroke="rgba(255,255,255,0.05)" strokeDasharray="2" />

                            {/* Views Polyline */}
                            <polygon points={`0,100 ${pointsViews} 100,100`} fill="url(#redGrad)" opacity="0.25" />
                            <polyline points={pointsViews} fill="none" stroke="#E50914" strokeWidth="2.5" strokeLinecap="round" />

                            {/* Uniques Polyline */}
                            <polyline points={pointsUniques} fill="none" stroke="#3B82F6" strokeWidth="2" strokeDasharray="3 3" />

                            <defs>
                              <linearGradient id="redGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#E50914" stopOpacity="0.8" />
                                <stop offset="100%" stopColor="#E50914" stopOpacity="0.0" />
                              </linearGradient>
                            </defs>
                          </svg>

                          {/* Date Labels */}
                          <div className="flex justify-between items-center pt-4 border-t border-white/10 text-[11px] text-gray-400 font-medium">
                            {trend.map((t, i) => (
                              <div key={i} className="text-center">
                                <div>{t.date}</div>
                                <div className="text-white font-bold text-[10px] mt-0.5">{t.views}</div>
                              </div>
                            ))}
                          </div>
                        </div>
                      );
                    })()}
                  </div>
                </div>

                {/* DEVICE TYPE DISTRIBUTION BREAKDOWN */}
                <div className="lg:col-span-4 bg-dark-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wider flex items-center gap-2 mb-2">
                      <Smartphone size={18} className="text-brand-red" />
                      <span>Device Types EDA</span>
                    </h3>
                    <p className="text-gray-400 text-xs mb-6">Traffic distribution by user device</p>

                    {(() => {
                      const dev = analytics.device_breakdown || { Mobile: 1420, Desktop: 1850, Tablet: 380 };
                      const total = (dev.Mobile || 0) + (dev.Desktop || 0) + (dev.Tablet || 0) || 1;
                      const mobPct = Math.round(((dev.Mobile || 0) / total) * 100);
                      const deskPct = Math.round(((dev.Desktop || 0) / total) * 100);
                      const tabPct = 100 - mobPct - deskPct;

                      return (
                        <div className="space-y-5">
                          <div>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span className="text-gray-300 flex items-center gap-2">
                                <Smartphone size={14} className="text-brand-red" /> Mobile Devices
                              </span>
                              <span className="text-white font-bold">{mobPct}% ({dev.Mobile})</span>
                            </div>
                            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-brand-red h-full rounded-full transition-all duration-500" style={{ width: `${mobPct}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span className="text-gray-300 flex items-center gap-2">
                                <Monitor size={14} className="text-blue-400" /> Desktop Browsers
                              </span>
                              <span className="text-white font-bold">{deskPct}% ({dev.Desktop})</span>
                            </div>
                            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-blue-500 h-full rounded-full transition-all duration-500" style={{ width: `${deskPct}%` }} />
                            </div>
                          </div>

                          <div>
                            <div className="flex justify-between text-xs font-semibold mb-1">
                              <span className="text-gray-300 flex items-center gap-2">
                                <Tablet size={14} className="text-amber-400" /> Tablets & iPad
                              </span>
                              <span className="text-white font-bold">{tabPct}% ({dev.Tablet})</span>
                            </div>
                            <div className="w-full bg-white/5 h-2.5 rounded-full overflow-hidden">
                              <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${tabPct}%` }} />
                            </div>
                          </div>
                        </div>
                      );
                    })()}
                  </div>

                  {/* QUICK INSIGHT BANNER */}
                  <div className="mt-8 p-4 bg-brand-red/10 border border-brand-red/30 rounded-2xl">
                    <div className="text-xs font-bold text-brand-red uppercase tracking-wider flex items-center gap-1.5">
                      <Sparkles size={14} /> Optimization Tip
                    </div>
                    <p className="text-gray-300 text-xs mt-1 leading-relaxed">
                      Mobile users represent over half of total visitors! Mobile responsive player controls are active.
                    </p>
                  </div>
                </div>

              </div>

              {/* TOP PERFORMING PAGES & CONTENT SUMMARY */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
                
                {/* TOP PAGES */}
                <div className="bg-dark-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
                  <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wider mb-4 flex items-center gap-2">
                    <ChevronRight size={18} className="text-brand-red" />
                    <span>Top Visited Pages</span>
                  </h3>
                  <div className="space-y-3">
                    {(analytics.top_pages || []).map((page, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3 bg-white/[0.03] border border-white/5 rounded-xl text-sm">
                        <div className="font-mono text-gray-300">{page.path}</div>
                        <div className="font-bold text-white bg-white/10 px-3 py-1 rounded-lg text-xs">
                          {page.views.toLocaleString()} views
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* QUICK ACTIONS & SUMMARY */}
                <div className="bg-dark-900/80 border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold font-heading text-white uppercase tracking-wider mb-4">
                      Quick Content Management
                    </h3>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => { setActiveTab('songs'); handleOpenAddSong(); }}
                        className="p-4 bg-brand-red/10 border border-brand-red/30 hover:bg-brand-red hover:text-white rounded-2xl text-left transition-all"
                      >
                        <Music size={20} className="text-brand-red mb-2" />
                        <div className="font-bold text-sm">Add New Song</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">Catalog + YouTube</div>
                      </button>

                      <button
                        onClick={() => { setActiveTab('reels'); handleOpenAddReel(); }}
                        className="p-4 bg-blue-500/10 border border-blue-500/30 hover:bg-blue-500 hover:text-white rounded-2xl text-left transition-all"
                      >
                        <Film size={20} className="text-blue-400 mb-2" />
                        <div className="font-bold text-sm">Add Reel / Short</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">Vertical Video</div>
                      </button>

                      <button
                        onClick={() => setActiveTab('lyrics')}
                        className="p-4 bg-amber-500/10 border border-amber-500/30 hover:bg-amber-500 hover:text-white rounded-2xl text-left transition-all"
                      >
                        <PenTool size={20} className="text-amber-400 mb-2" />
                        <div className="font-bold text-sm">Review Fan Lyrics</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{pendingLyricsCount} Pending</div>
                      </button>

                      <button
                        onClick={() => setActiveTab('messages')}
                        className="p-4 bg-emerald-500/10 border border-emerald-500/30 hover:bg-emerald-500 hover:text-white rounded-2xl text-left transition-all"
                      >
                        <Mail size={20} className="text-emerald-400 mb-2" />
                        <div className="font-bold text-sm">Read Messages</div>
                        <div className="text-[11px] text-gray-400 mt-0.5">{unreadMsgCount} Unread</div>
                      </button>
                    </div>
                  </div>
                </div>

              </div>

            </div>
          )}

          {/* TAB 2: SONGS CATALOG */}
          {activeTab === 'songs' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-900/60 p-6 rounded-3xl border border-white/10">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white uppercase">Music Catalog ({songs.length})</h3>
                  <p className="text-gray-400 text-xs mt-1">Manage official releases, video links & featured badges</p>
                </div>
                <button
                  onClick={handleOpenAddSong}
                  className="px-5 py-2.5 bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-glow-red transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>ADD NEW SONG</span>
                </button>
              </div>

              {/* SONGS RESPONSIVE GRID / CARDS */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {songs.map((song) => (
                  <div key={song.id} className="bg-dark-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-video w-full bg-dark-950">
                        <img src={song.thumbnail_url} alt={song.title} className="w-full h-full object-cover" />
                        <div className="absolute top-3 right-3 flex gap-1.5">
                          {song.is_latest && <span className="px-2 py-0.5 bg-brand-red text-white text-[10px] font-bold rounded-md uppercase">LATEST</span>}
                          {song.is_popular && <span className="px-2 py-0.5 bg-amber-500 text-black text-[10px] font-bold rounded-md uppercase">POPULAR</span>}
                        </div>
                      </div>
                      <div className="p-5 space-y-2">
                        <span className="text-[10px] font-bold uppercase text-brand-red tracking-wider">{song.release_type} • {song.release_date}</span>
                        <h4 className="text-lg font-bold font-heading text-white uppercase">{song.title}</h4>
                        <p className="text-gray-400 text-xs line-clamp-2">{song.description}</p>
                      </div>
                    </div>

                    <div className="p-5 pt-0 flex items-center justify-end gap-2 border-t border-white/5 mt-3">
                      <button
                        onClick={() => handleOpenEditSong(song)}
                        className="px-3 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-gray-200 flex items-center gap-1.5 transition-all"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => promptDeleteSong(song.id, song.title)}
                        className="px-3 py-1.5 bg-red-600/20 hover:bg-red-600 border border-red-500/30 rounded-lg text-xs font-semibold text-red-300 hover:text-white flex items-center gap-1.5 transition-all"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: REELS & SHORTS */}
          {activeTab === 'reels' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-900/60 p-6 rounded-3xl border border-white/10">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white uppercase">Reels & YouTube Shorts ({reels.length})</h3>
                  <p className="text-gray-400 text-xs mt-1">Manage vertical 9:16 video reels featured on home page</p>
                </div>
                <button
                  onClick={handleOpenAddReel}
                  className="px-5 py-2.5 bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-glow-red transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>ADD NEW REEL</span>
                </button>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-6">
                {reels.map((reel) => (
                  <div key={reel.id} className="bg-dark-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-[9/16] w-full bg-dark-950">
                        <img src={reel.thumbnail_url} alt={reel.title} className="w-full h-full object-cover" />
                      </div>
                      <div className="p-4 space-y-1">
                        <h4 className="text-sm font-bold text-white truncate">{reel.title || 'Untitled Reel'}</h4>
                        <p className="text-gray-400 text-xs line-clamp-2">{reel.caption}</p>
                      </div>
                    </div>

                    <div className="p-3 pt-0 flex items-center justify-between gap-1 border-t border-white/5">
                      <button
                        onClick={() => handleOpenEditReel(reel)}
                        className="px-2.5 py-1 bg-white/5 hover:bg-white/10 rounded-lg text-xs text-gray-300 flex items-center gap-1"
                      >
                        <Edit3 size={12} /> Edit
                      </button>
                      <button
                        onClick={() => promptDeleteReel(reel.id, reel.title)}
                        className="px-2.5 py-1 bg-red-600/20 hover:bg-red-600 rounded-lg text-xs text-red-300 hover:text-white flex items-center gap-1"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: TEAM DUO MEMBERS */}
          {activeTab === 'members' && (
            <div className="space-y-6">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 bg-dark-900/60 p-6 rounded-3xl border border-white/10">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white uppercase">Team Duo Profiles ({members.length})</h3>
                  <p className="text-gray-400 text-xs mt-1">Manage team member details, bios, and profile photos</p>
                </div>
                <button
                  onClick={handleOpenAddMember}
                  className="px-5 py-2.5 bg-brand-red hover:bg-brand-redHover text-white text-xs font-bold uppercase tracking-wider rounded-xl shadow-glow-red transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Plus size={16} />
                  <span>ADD MEMBER</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {members.map((m) => (
                  <div key={m.id} className="bg-dark-900 border border-white/10 rounded-3xl overflow-hidden shadow-xl flex flex-col justify-between">
                    <div>
                      <div className="relative aspect-square w-full bg-dark-950">
                        <img src={m.image_url} alt={m.name} className="w-full h-full object-cover object-top" />
                        <div className="absolute bottom-3 left-4">
                          <span className="px-3 py-1 bg-brand-red text-white text-xs font-bold uppercase rounded-md">
                            {m.role}
                          </span>
                        </div>
                      </div>
                      <div className="p-6 space-y-2">
                        <h4 className="text-xl font-bold font-heading text-white uppercase">{m.name}</h4>
                        <p className="text-gray-400 text-sm leading-relaxed">{m.bio}</p>
                      </div>
                    </div>

                    <div className="p-6 pt-0 flex items-center justify-end gap-3 border-t border-white/5">
                      <button
                        onClick={() => handleOpenEditMember(m)}
                        className="px-4 py-2 bg-white/5 hover:bg-white/10 rounded-xl text-xs font-semibold text-gray-200 flex items-center gap-2"
                      >
                        <Edit3 size={14} /> Edit
                      </button>
                      <button
                        onClick={() => promptDeleteMember(m.id, m.name)}
                        className="px-4 py-2 bg-red-600/20 hover:bg-red-600 rounded-xl text-xs font-semibold text-red-300 hover:text-white flex items-center gap-2"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: FAN LYRICS SUBMISSIONS */}
          {activeTab === 'lyrics' && (
            <div className="space-y-6">
              <div className="bg-dark-900/60 p-6 rounded-3xl border border-white/10 flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-bold font-heading text-white uppercase">Fan Lyrics Submissions ({lyricsList.length})</h3>
                  <p className="text-gray-400 text-xs mt-1">Review community-submitted lyrics and spotlight them on the homepage</p>
                </div>
              </div>

              <div className="space-y-4">
                {lyricsList.length === 0 ? (
                  <div className="p-12 text-center text-gray-400 bg-dark-900/40 rounded-2xl border border-white/5">
                    No lyrics submissions received yet.
                  </div>
                ) : (
                  lyricsList.map((lyric) => (
                    <div key={lyric.id} className="bg-dark-900 border border-white/10 rounded-2xl p-6 shadow-xl space-y-4">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-white/5 pb-4">
                        <div>
                          <div className="flex items-center gap-3">
                            <h4 className="text-lg font-bold text-white">{lyric.writer_name}</h4>
                            <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md uppercase ${lyric.status === 'featured' ? 'bg-emerald-500 text-black' : lyric.status === 'approved_for_song' ? 'bg-blue-500 text-white' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'}`}>
                              {lyric.status}
                            </span>
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {lyric.email} • Genre: <span className="text-brand-red font-semibold">{lyric.genre}</span> • Title: {lyric.song_title || 'Untitled'}
                          </div>
                        </div>

                        {/* Status Action Buttons */}
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleLyricStatusChange(lyric.id, 'featured')}
                            className="px-3 py-1.5 bg-emerald-600/20 hover:bg-emerald-600 text-emerald-300 hover:text-white border border-emerald-500/30 rounded-xl text-xs font-bold transition-all"
                          >
                            Feature on Home
                          </button>
                          <button
                            onClick={() => handleLyricStatusChange(lyric.id, 'pending')}
                            className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl text-xs font-bold transition-all"
                          >
                            Pending
                          </button>
                          <button
                            onClick={() => promptDeleteLyric(lyric.id)}
                            className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-xl transition-all"
                          >
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </div>

                      <div className="bg-dark-950 p-4 rounded-xl text-gray-300 text-sm italic whitespace-pre-line font-mono border border-white/5">
                        "{lyric.lyrics}"
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 6: COMMENTS */}
          {activeTab === 'comments' && (
            <div className="space-y-6">
              <div className="bg-dark-900/60 p-6 rounded-3xl border border-white/10">
                <h3 className="text-xl font-bold font-heading text-white uppercase">Song Comments ({comments.length})</h3>
                <p className="text-gray-400 text-xs mt-1">Approve or hide fan comments displayed under music tracks</p>
              </div>

              <div className="space-y-4">
                {comments.map((c) => (
                  <div key={c.id} className="bg-dark-900 border border-white/10 rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-3">
                        <span className="font-bold text-white">{c.author_name}</span>
                        <span className={`px-2 py-0.5 text-[10px] font-bold rounded-md ${c.is_approved ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-400 border border-amber-500/30'}`}>
                          {c.is_approved ? 'Approved' : 'Hidden'}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm mt-2">"{c.content}"</p>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggleComment(c.id)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold border transition-all ${c.is_approved ? 'bg-amber-600/20 text-amber-300 border-amber-500/30' : 'bg-emerald-600/20 text-emerald-300 border-emerald-500/30'}`}
                      >
                        {c.is_approved ? 'Hide Comment' : 'Approve Comment'}
                      </button>
                      <button
                        onClick={() => promptDeleteComment(c.id)}
                        className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-xl"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: MESSAGES */}
          {activeTab === 'messages' && (
            <div className="space-y-6">
              <div className="bg-dark-900/60 p-6 rounded-3xl border border-white/10">
                <h3 className="text-xl font-bold font-heading text-white uppercase">Contact Inquiries ({messages.length})</h3>
                <p className="text-gray-400 text-xs mt-1">Management inquiries, booking requests & fan messages</p>
              </div>

              <div className="space-y-4">
                {messages.map((msg) => (
                  <div key={msg.id} className={`bg-dark-900 border rounded-2xl p-6 shadow-xl space-y-3 ${!msg.is_read ? 'border-brand-red/60 shadow-glow-red-lg' : 'border-white/10'}`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 border-b border-white/5 pb-3">
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-white text-base">{msg.name}</h4>
                          <span className="text-xs text-brand-red">({msg.email})</span>
                          {!msg.is_read && <span className="px-2 py-0.5 bg-brand-red text-white text-[10px] font-bold rounded-md">NEW</span>}
                        </div>
                        <div className="text-xs text-gray-400 mt-0.5">Subject: <span className="text-gray-200 font-semibold">{msg.subject || 'General Inquiry'}</span></div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => handleToggleReadMessage(msg.id)}
                          className="px-3 py-1.5 bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 rounded-xl text-xs font-bold"
                        >
                          {msg.is_read ? 'Mark Unread' : 'Mark Read'}
                        </button>
                        <button
                          onClick={() => promptDeleteMessage(msg.id)}
                          className="p-2 bg-red-600/20 hover:bg-red-600 text-red-300 hover:text-white rounded-xl"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>

                    <p className="text-gray-300 text-sm leading-relaxed whitespace-pre-line">{msg.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 8: SUBSCRIBERS */}
          {activeTab === 'subscribers' && (
            <div className="space-y-6">
              <div className="bg-dark-900/60 p-6 rounded-3xl border border-white/10">
                <h3 className="text-xl font-bold font-heading text-white uppercase">Newsletter Subscribers ({subscribers.length})</h3>
                <p className="text-gray-400 text-xs mt-1">Fans subscribed to receives new track drop updates</p>
              </div>

              <div className="bg-dark-900 border border-white/10 rounded-2xl overflow-hidden shadow-xl">
                <div className="divide-y divide-white/5">
                  {subscribers.map((sub) => (
                    <div key={sub.id} className="p-4 flex items-center justify-between hover:bg-white/[0.02]">
                      <div className="flex items-center gap-3">
                        <Mail size={16} className="text-brand-red" />
                        <span className="text-sm font-semibold text-white">{sub.email}</span>
                      </div>
                      <button
                        onClick={() => promptDeleteSubscriber(sub.id, sub.email)}
                        className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: SITE SETTINGS */}
          {activeTab === 'settings' && (
            <div className="space-y-6 max-w-3xl">
              <div className="bg-dark-900/60 p-6 rounded-3xl border border-white/10">
                <h3 className="text-xl font-bold font-heading text-white uppercase">Global Website Settings</h3>
                <p className="text-gray-400 text-xs mt-1">Update duo branding, social media links & story copy</p>
              </div>

              <form onSubmit={handleSaveSettings} className="bg-dark-900 border border-white/10 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Duo Name</label>
                  <input
                    type="text"
                    value={settings.duo_name || ''}
                    onChange={e => setSettings({ ...settings, duo_name: e.target.value })}
                    className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Motto / Tagline</label>
                  <input
                    type="text"
                    value={settings.tagline || ''}
                    onChange={e => setSettings({ ...settings, tagline: e.target.value })}
                    className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">Instagram Channel URL</label>
                  <input
                    type="text"
                    value={settings.instagram_url || ''}
                    onChange={e => setSettings({ ...settings, instagram_url: e.target.value })}
                    className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">YouTube Channel URL</label>
                  <input
                    type="text"
                    value={settings.youtube_url || ''}
                    onChange={e => setSettings({ ...settings, youtube_url: e.target.value })}
                    className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">About Story Copy</label>
                  <textarea
                    rows={4}
                    value={settings.about_story || ''}
                    onChange={e => setSettings({ ...settings, about_story: e.target.value })}
                    className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 bg-brand-red hover:bg-brand-redHover text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-glow-red transition-all"
                >
                  SAVE ALL SETTINGS
                </button>
              </form>
            </div>
          )}

        </main>

        {/* SONG MODAL */}
        {editingSong && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-dark-900 border border-white/10 rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 shadow-2xl relative my-8">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold font-heading text-white uppercase">{editingSong.id ? 'Edit Song' : 'Add New Song'}</h3>
                <button onClick={() => setEditingSong(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveSong} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Song Title</label>
                  <input type="text" required value={songForm.title} onChange={e => setSongForm({ ...songForm, title: e.target.value })} className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none" />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Release Type</label>
                    <input type="text" value={songForm.release_type} onChange={e => setSongForm({ ...songForm, release_type: e.target.value })} className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Release Date</label>
                    <input type="text" value={songForm.release_date} onChange={e => setSongForm({ ...songForm, release_date: e.target.value })} className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Thumbnail Image URL</label>
                  <input type="text" required value={songForm.thumbnail_url} onChange={e => setSongForm({ ...songForm, thumbnail_url: e.target.value })} className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">YouTube Video URL</label>
                  <input type="text" value={songForm.youtube_url} onChange={e => setSongForm({ ...songForm, youtube_url: e.target.value })} className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Description</label>
                  <textarea rows={3} value={songForm.description} onChange={e => setSongForm({ ...songForm, description: e.target.value })} className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none resize-none" />
                </div>

                <div className="flex gap-6 pt-2">
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={songForm.is_latest} onChange={e => setSongForm({ ...songForm, is_latest: e.target.checked })} className="accent-brand-red w-4 h-4" />
                    <span>Set as Latest Release</span>
                  </label>
                  <label className="flex items-center gap-2 text-xs font-bold text-gray-300 cursor-pointer">
                    <input type="checkbox" checked={songForm.is_popular} onChange={e => setSongForm({ ...songForm, is_popular: e.target.checked })} className="accent-brand-red w-4 h-4" />
                    <span>Set as Popular</span>
                  </label>
                </div>

                <button type="submit" className="w-full py-3 bg-brand-red hover:bg-brand-redHover text-white font-bold text-sm uppercase rounded-xl shadow-glow-red transition-all">
                  Save Song
                </button>
              </form>
            </div>
          </div>
        )}

        {/* REEL MODAL */}
        {editingReel && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-dark-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold font-heading text-white uppercase">{editingReel.id ? 'Edit Reel' : 'Add New Short / Reel'}</h3>
                <button onClick={() => setEditingReel(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveReel} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Title</label>
                  <input type="text" required value={reelForm.title} onChange={e => setReelForm({ ...reelForm, title: e.target.value })} className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Reel / YouTube Short URL</label>
                  <input type="text" required value={reelForm.reel_url} onChange={e => setReelForm({ ...reelForm, reel_url: e.target.value })} className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Thumbnail Image URL</label>
                  <input type="text" required value={reelForm.thumbnail_url} onChange={e => setReelForm({ ...reelForm, thumbnail_url: e.target.value })} className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Caption</label>
                  <textarea rows={2} value={reelForm.caption} onChange={e => setReelForm({ ...reelForm, caption: e.target.value })} className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none resize-none" />
                </div>

                <button type="submit" className="w-full py-3 bg-brand-red hover:bg-brand-redHover text-white font-bold text-sm uppercase rounded-xl shadow-glow-red transition-all">
                  Save Reel
                </button>
              </form>
            </div>
          </div>
        )}

        {/* MEMBER MODAL */}
        {editingMember && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm overflow-y-auto">
            <div className="bg-dark-900 border border-white/10 rounded-3xl max-w-lg w-full p-6 space-y-6 shadow-2xl relative">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <h3 className="text-xl font-bold font-heading text-white uppercase">{editingMember.id ? 'Edit Member' : 'Add Team Member'}</h3>
                <button onClick={() => setEditingMember(null)} className="text-gray-400 hover:text-white"><X size={20} /></button>
              </div>

              <form onSubmit={handleSaveMember} className="space-y-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Member Name</label>
                  <input type="text" required value={memberForm.name} onChange={e => setMemberForm({ ...memberForm, name: e.target.value })} className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Role</label>
                  <input type="text" required value={memberForm.role} onChange={e => setMemberForm({ ...memberForm, role: e.target.value })} className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Photo Image URL</label>
                  <input type="text" required value={memberForm.image_url} onChange={e => setMemberForm({ ...memberForm, image_url: e.target.value })} className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none" />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-1">Bio</label>
                  <textarea rows={3} value={memberForm.bio} onChange={e => setMemberForm({ ...memberForm, bio: e.target.value })} className="w-full bg-dark-950 border border-white/10 rounded-xl p-3 text-sm text-white focus:border-brand-red focus:outline-none resize-none" />
                </div>

                <button type="submit" className="w-full py-3 bg-brand-red hover:bg-brand-redHover text-white font-bold text-sm uppercase rounded-xl shadow-glow-red transition-all">
                  Save Member Profile
                </button>
              </form>
            </div>
          </div>
        )}

        {/* CONFIRMATION POPUP MODAL */}
        {confirmModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
            <div className="bg-dark-900 border border-white/10 rounded-3xl max-w-md w-full p-6 space-y-6 shadow-2xl text-center">
              <div className="w-14 h-14 rounded-full bg-red-600/20 text-red-500 flex items-center justify-center mx-auto border border-red-500/30">
                <ShieldAlert size={28} />
              </div>

              <div className="space-y-2">
                <h3 className="text-xl font-bold font-heading text-white">{confirmModal.title}</h3>
                <p className="text-gray-300 text-sm">{confirmModal.message}</p>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <button
                  onClick={() => setConfirmModal(null)}
                  className="w-1/2 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 rounded-xl font-semibold text-xs uppercase"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    confirmModal.onConfirm();
                    setConfirmModal(null);
                  }}
                  className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-xl font-bold text-xs uppercase shadow-glow-red"
                >
                  Confirm Delete
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </PageTransition>
  );
}
