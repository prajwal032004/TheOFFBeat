import React from 'react';
import { NavLink } from 'react-router-dom';
import { Instagram, Youtube, Mail, Heart, Copy, Check } from 'lucide-react';

export default function Footer({ settings }) {
  const [copied, setCopied] = React.useState(false);
  const instagramUrl = settings?.instagram_url || "https://www.instagram.com/theoffbeat_original?utm_source=qr";
  const youtubeUrl = settings?.youtube_url || "https://www.youtube.com/@theoffbeat_original";
  const bookingEmail = "management@theoffbeat.com";

  const handleCopyEmail = (e) => {
    e.preventDefault();
    navigator.clipboard.writeText(bookingEmail);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <footer className="bg-dark-950 border-t border-white/10 text-gray-300 relative select-none">
      
      {/* Glow Backdrop */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-96 h-40 bg-brand-red/10 blur-[100px] pointer-events-none" />

      {/* DESKTOP VIEW (md:block) */}
      <div className="hidden md:block max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-12">
        <div className="bg-dark-900/60 border border-white/10 backdrop-blur-2xl rounded-3xl p-10 shadow-2xl space-y-12">
          
          {/* Main Top Grid */}
          <div className="grid grid-cols-12 gap-8 items-start">
            
            {/* Col 1: Brand & Slogan */}
            <div className="col-span-4 space-y-4">
              <NavLink to="/" className="inline-flex items-center gap-1 group">
                <span className="font-heading font-black text-3xl tracking-wider text-white">The</span>
                <span className="font-heading italic font-black text-3xl text-brand-red group-hover:text-glow-red transition-all">OFFBeat</span>
                <span className="w-2 h-2 rounded-full bg-brand-red shadow-glow-red animate-pulse ml-0.5" />
              </NavLink>

              <p className="text-sm font-heading italic text-gray-400 leading-relaxed">
                "{settings?.tagline || 'Dil se Likha, Beat pe Jeeya...'}"
              </p>

              {/* Social Icons */}
              <div className="flex items-center space-x-3 pt-2">
                <a
                  href={instagramUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-white/5 border border-white/10 hover:border-brand-red hover:bg-brand-red text-gray-300 hover:text-white rounded-2xl transition-all shadow-glow-red group"
                  aria-label="Instagram"
                  title="Follow on Instagram"
                >
                  <Instagram size={18} />
                </a>
                <a
                  href={youtubeUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="p-3 bg-white/5 border border-white/10 hover:border-brand-red hover:bg-brand-red text-gray-300 hover:text-white rounded-2xl transition-all shadow-glow-red group"
                  aria-label="YouTube"
                  title="Subscribe on YouTube"
                >
                  <Youtube size={18} />
                </a>
              </div>
            </div>

            {/* Col 2: Navigation Links */}
            <div className="col-span-3 space-y-3 pl-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-brand-red font-mono">
                NAVIGATION
              </h4>
              <ul className="space-y-2 text-sm font-bold text-gray-300 uppercase tracking-wider">
                <li>
                  <NavLink to="/" className="hover:text-brand-red transition-colors">Home</NavLink>
                </li>
                <li>
                  <NavLink to="/music" className="hover:text-brand-red transition-colors">Music & Tracks</NavLink>
                </li>
                <li>
                  <NavLink to="/reels" className="hover:text-brand-red transition-colors">Reels & Shorts</NavLink>
                </li>
                <li>
                  <NavLink to="/about" className="hover:text-brand-red transition-colors">About Duo</NavLink>
                </li>
                <li>
                  <NavLink to="/contact" className="hover:text-brand-red transition-colors">Contact Us</NavLink>
                </li>
              </ul>
            </div>

            {/* Col 3: Business Inquiries & Booking Card */}
            <div className="col-span-5 bg-dark-950/80 border border-brand-red/30 p-6 rounded-2xl space-y-3 shadow-glow-red">
              <div className="flex items-center gap-2 text-brand-red">
                <Mail size={18} />
                <span className="text-xs font-black uppercase tracking-widest">
                  Business Inquiries & Booking
                </span>
              </div>
              <p className="text-xs text-gray-400 leading-relaxed">
                For live shows, music sync licensing, collaborations, or corporate bookings, reach out directly to our management team:
              </p>
              <div className="flex items-center justify-between bg-black/60 p-3 rounded-xl border border-white/10">
                <a
                  href={`mailto:${bookingEmail}`}
                  className="text-sm font-bold font-mono text-white hover:text-brand-red transition-colors truncate"
                >
                  {bookingEmail}
                </a>
                <button
                  onClick={handleCopyEmail}
                  className="px-3 py-1.5 bg-brand-red/20 hover:bg-brand-red text-brand-red hover:text-white border border-brand-red/40 text-[11px] font-bold uppercase rounded-lg transition-all flex items-center gap-1 shrink-0 cursor-pointer"
                  title="Copy email address"
                >
                  {copied ? (
                    <>
                      <Check size={13} className="text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy size={13} />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

          {/* Desktop Bottom Bar */}
          <div className="pt-8 border-t border-white/10 flex items-center justify-between text-xs text-gray-400 font-mono">
            <p>© {new Date().getFullYear()} TheOFFBeat. All Rights Reserved.</p>
            
            <div className="flex items-center gap-1.5 text-gray-400">
              <span>Crafted with</span>
              <Heart size={14} className="text-brand-red fill-brand-red animate-pulse" />
              <span>for music lovers.</span>
            </div>
          </div>

        </div>
      </div>


      {/* MOBILE VIEW (block md:hidden) */}
      <div className="block md:hidden max-w-7xl mx-auto px-4 py-10">
        <div className="bg-dark-900/80 border border-white/10 backdrop-blur-2xl rounded-3xl p-6 space-y-8 shadow-2xl">
          
          {/* Mobile Header Branding */}
          <div className="text-center space-y-2">
            <NavLink to="/" className="inline-flex items-center gap-1">
              <span className="font-heading font-black text-2xl tracking-wider text-white">The</span>
              <span className="font-heading italic font-black text-2xl text-brand-red">OFFBeat</span>
              <span className="w-2 h-2 rounded-full bg-brand-red shadow-glow-red animate-pulse" />
            </NavLink>
            <p className="text-xs font-heading italic text-gray-400">
              "{settings?.tagline || 'Dil se Likha, Beat pe Jeeya...'}"
            </p>
          </div>

          {/* Business Inquiries & Booking Card */}
          <div className="bg-dark-950 p-5 rounded-2xl border border-brand-red/40 space-y-3 text-center shadow-glow-red">
            <span className="text-[11px] font-black uppercase tracking-widest text-brand-red block">
              Business Inquiries & Booking
            </span>
            <a
              href={`mailto:${bookingEmail}`}
              className="text-sm font-bold font-mono text-white block underline decoration-brand-red decoration-2"
            >
              {bookingEmail}
            </a>
            <button
              onClick={handleCopyEmail}
              className="w-full py-2 bg-brand-red text-white text-xs font-bold uppercase tracking-wider rounded-xl transition-all flex items-center justify-center gap-1.5 shadow-glow-red"
            >
              {copied ? <Check size={14} /> : <Copy size={14} />}
              <span>{copied ? 'Email Copied!' : 'Copy Email Address'}</span>
            </button>
          </div>

          {/* Mobile Navigation Pill Links */}
          <div className="flex flex-wrap items-center justify-center gap-2">
            <NavLink to="/" className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase text-gray-300">Home</NavLink>
            <NavLink to="/music" className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase text-gray-300">Music</NavLink>
            <NavLink to="/reels" className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase text-gray-300">Reels</NavLink>
            <NavLink to="/about" className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase text-gray-300">About</NavLink>
            <NavLink to="/contact" className="px-3.5 py-1.5 bg-white/5 border border-white/10 rounded-full text-xs font-bold uppercase text-gray-300">Contact</NavLink>
          </div>

          {/* Mobile Social Badges */}
          <div className="flex items-center justify-center space-x-4 pt-2">
            <a
              href={instagramUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-300 hover:text-brand-red"
              aria-label="Instagram"
            >
              <Instagram size={20} />
            </a>
            <a
              href={youtubeUrl}
              target="_blank"
              rel="noreferrer"
              className="p-3 bg-white/5 border border-white/10 rounded-2xl text-gray-300 hover:text-brand-red"
              aria-label="YouTube"
            >
              <Youtube size={20} />
            </a>
          </div>

          {/* Mobile Bottom */}
          <div className="pt-6 border-t border-white/10 text-center text-xs text-gray-400 font-mono">
            <p>© {new Date().getFullYear()} TheOFFBeat. All Rights Reserved.</p>
          </div>

        </div>
      </div>

    </footer>
  );
}
