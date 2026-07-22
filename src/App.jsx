import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation, Navigate } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import Home from './pages/Home';
import Music from './pages/Music';
import Reels from './pages/Reels';
import About from './pages/About';
import Contact from './pages/Contact';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import NotFound from './pages/NotFound';
import ChatbotWidget from './components/ChatbotWidget';
import VideoModal from './components/VideoModal';
import { getSettings } from './services/api';

export default function App() {
  const [settings, setSettings] = useState({});
  const [modalVideo, setModalVideo] = useState(null);
  const location = useLocation();

  useEffect(() => {
    async function loadSettings() {
      try {
        const res = await getSettings();
        setSettings(res.data || {});
      } catch (err) {
        console.error('Error loading global site settings:', err);
      }
    }
    loadSettings();
  }, []);

  const isAdminRoute = location.pathname.startsWith('/admin/offbeat');

  const handleChatbotPlaySong = (song) => {
    if (song) {
      setModalVideo({
        videoUrl: song.youtube_url,
        embedId: song.youtube_embed_id,
        title: song.title
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-dark-950 text-gray-100 selection:bg-brand-red selection:text-white relative">
      <ScrollToTop />
      
      {!isAdminRoute && <Navbar settings={settings} />}

      <main className="flex-grow">
        <Routes>
          <Route path="/" element={<Home settings={settings} />} />
          <Route path="/music" element={<Music />} />
          <Route path="/reels" element={<Reels />} />
          <Route path="/videos" element={<Navigate to="/reels" replace />} />
          <Route path="/about" element={<About settings={settings} />} />
          <Route path="/contact" element={<Contact settings={settings} />} />

          {/* SECRET ADMIN ROUTES */}
          <Route path="/admin/offbeat/login" element={<AdminLogin />} />
          <Route path="/admin/offbeat/dashboard" element={<AdminDashboard />} />

          {/* ANY PUBLIC /admin SEARCH OR INVALID PATH RETURNS 404 NOT FOUND */}
          <Route path="/admin" element={<NotFound />} />
          <Route path="/admin/login" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>

      {!isAdminRoute && <ChatbotWidget onPlaySong={handleChatbotPlaySong} />}

      {!isAdminRoute && <Footer settings={settings} />}

      {/* Global Video Modal triggered by Chatbot or shared events */}
      <VideoModal
        isOpen={!!modalVideo}
        onClose={() => setModalVideo(null)}
        videoUrl={modalVideo?.videoUrl}
        embedId={modalVideo?.embedId}
        title={modalVideo?.title}
      />
    </div>
  );
}
