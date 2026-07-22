import React, { useState, useEffect } from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';
import { Menu, X, Instagram, Youtube, Sparkles } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar({ settings }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const instagramUrl = settings?.instagram_url || "https://www.instagram.com/theoffbeat_original?utm_source=qr";
  const youtubeUrl = settings?.youtube_url || "https://www.youtube.com/@theoffbeat_original";

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Music', path: '/music' },
    { name: 'Reels', path: '/reels' },
    { name: 'About', path: '/about' },
    { name: 'Contact', path: '/contact' },
  ];

  const handleSubscribeClick = () => {
    const el = document.getElementById('newsletter-section');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#newsletter-section');
    }
  };

  return (
    <header className="fixed top-4 left-0 right-0 z-50 flex justify-center px-4 pointer-events-none">
      
      {/* Floating Island Capsule Bar */}
      <motion.div
        initial={{ y: -30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5, type: 'spring', damping: 20 }}
        className={`pointer-events-auto w-full max-w-6xl transition-all duration-500 rounded-full px-5 py-2.5 flex items-center justify-between gap-4 border shadow-2xl backdrop-blur-2xl ${
          scrolled
            ? 'bg-dark-950/90 border-brand-red/40 shadow-glow-red-lg'
            : 'bg-dark-900/75 border-white/10 hover:border-white/20'
        }`}
      >
        {/* LEFT: Brand Logo */}
        <NavLink to="/" className="flex items-center gap-1 group pl-2">
          <span className="font-heading font-black text-xl sm:text-2xl tracking-wider text-white">
            The
          </span>
          <span className="font-heading italic font-black text-xl sm:text-2xl text-brand-red group-hover:text-glow-red transition-all">
            OFFBeat
          </span>
          <span className="w-1.5 h-1.5 rounded-full bg-brand-red shadow-glow-red animate-pulse ml-0.5" />
        </NavLink>

        {/* CENTER: Desktop Floating Pill Nav Links */}
        <nav className="hidden md:flex items-center space-x-1 relative bg-black/40 p-1.5 rounded-full border border-white/5">
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path || (link.path === '/' && location.pathname === '/');
            return (
              <NavLink
                key={link.name}
                to={link.path}
                end={link.path === '/'}
                className="relative px-4 py-1.5 text-xs font-bold uppercase tracking-wider transition-colors cursor-pointer select-none"
              >
                {/* Smooth Animated Pill Selection Background */}
                {isActive && (
                  <motion.div
                    layoutId="floatingActivePill"
                    className="absolute inset-0 bg-brand-red rounded-full shadow-glow-red"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}

                {/* Text Content */}
                <span className={`relative z-10 flex items-center gap-1.5 ${
                  isActive ? 'text-white font-black' : 'text-gray-300 hover:text-white'
                }`}>
                  {link.name}
                  {isActive && <span className="w-1 h-1 rounded-full bg-white animate-ping" />}
                </span>
              </NavLink>
            );
          })}
        </nav>

        {/* RIGHT: Social Media Icons + Subscribe Button */}
        <div className="hidden lg:flex items-center space-x-4 pr-1">
          <div className="flex items-center space-x-3 text-gray-400">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-red transition-colors p-1.5 rounded-full hover:bg-white/5"
              aria-label="Instagram"
              title="Follow on Instagram"
            >
              <Instagram size={18} />
            </a>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="hover:text-brand-red transition-colors p-1.5 rounded-full hover:bg-white/5"
              aria-label="YouTube"
              title="Subscribe on YouTube"
            >
              <Youtube size={18} />
            </a>
          </div>

          <button
            onClick={handleSubscribeClick}
            className="px-4 py-1.5 bg-brand-red hover:bg-red-600 text-white text-xs font-extrabold uppercase tracking-wider rounded-full transition-all shadow-glow-red hover:shadow-glow-red-lg cursor-pointer transform hover:scale-105 active:scale-95"
          >
            SUBSCRIBE
          </button>
        </div>

        {/* MOBILE TOGGLE */}
        <div className="flex md:hidden items-center gap-2">
          <button
            onClick={handleSubscribeClick}
            className="px-3 py-1 bg-brand-red text-white text-xs font-bold uppercase rounded-full shadow-glow-red"
          >
            SUBSCRIBE
          </button>
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-1.5 rounded-full text-gray-300 hover:text-white bg-white/5"
            aria-label="Toggle menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

      </motion.div>

      {/* Mobile Menu Overlay Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="pointer-events-auto absolute top-16 left-4 right-4 bg-dark-950/95 backdrop-blur-2xl border border-white/15 rounded-3xl p-5 shadow-2xl space-y-4"
          >
            <div className="space-y-2">
              {navLinks.map((link) => (
                <NavLink
                  key={link.name}
                  to={link.path}
                  className={({ isActive }) =>
                    `block text-sm font-bold uppercase tracking-wider py-2.5 px-4 rounded-xl transition-colors ${
                      isActive ? 'bg-brand-red text-white font-black shadow-glow-red' : 'text-gray-300 hover:bg-white/5 hover:text-white'
                    }`
                  }
                  end={link.path === '/'}
                >
                  {link.name}
                </NavLink>
              ))}
            </div>

            <div className="pt-3 border-t border-white/10 flex items-center justify-around text-gray-300">
              <a href={instagramUrl} target="_blank" rel="noreferrer" className="hover:text-brand-red p-2 flex items-center gap-2">
                <Instagram size={18} />
                <span className="text-xs uppercase font-bold">Instagram</span>
              </a>
              <a href={youtubeUrl} target="_blank" rel="noreferrer" className="hover:text-brand-red p-2 flex items-center gap-2">
                <Youtube size={18} />
                <span className="text-xs uppercase font-bold">YouTube</span>
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
