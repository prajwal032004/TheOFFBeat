import React, { useState } from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { adminLogin } from '../services/api';
import { Lock, Mail, AlertCircle, Loader2, ArrowRight, ArrowLeft, Eye, EyeOff, Music, Video, Users, BarChart3 } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function AdminLogin({ onLoginSuccess }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError('Please enter your email and password.');
      return;
    }

    setLoading(true);

    try {
      const response = await adminLogin({ email: email.trim(), password });
      const { token } = response.data;
      localStorage.setItem('echoverse_admin_token', token);
      if (onLoginSuccess) onLoginSuccess();
      navigate('/admin/offbeat/dashboard');
    } catch (err) {
      setError(err.response?.data?.error || 'Invalid credentials. Please verify your administrator details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="min-h-screen bg-dark-950 flex flex-col lg:flex-row text-gray-200 select-none overflow-hidden">
        
        {/* LEFT COLUMN: ATMOSPHERIC HERO BRANDING & FEATURE CARDS */}
        <div className="relative flex-1 hidden lg:flex flex-col justify-between p-12 bg-black border-r border-white/10 overflow-hidden">
          
          {/* Background Stage Image with Dark Red Vignette */}
          <div className="absolute inset-0 z-0">
            <img
              src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?auto=format&fit=crop&w=1920&q=80"
              alt="TheOFFBeat Stage"
              className="w-full h-full object-cover filter brightness-[0.35] contrast-125"
            />
            {/* Red Glow Vignette Overlay */}
            <div className="absolute inset-0 bg-gradient-to-tr from-black via-black/80 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-red/15 blur-[160px] rounded-full pointer-events-none" />
          </div>

          {/* Top Logo */}
          <div className="relative z-10">
            <NavLink to="/" className="inline-flex items-center gap-1 group">
              <span className="font-heading font-black text-3xl tracking-wider text-white">The</span>
              <span className="font-heading italic font-black text-3xl text-brand-red group-hover:text-glow-red transition-all">OFFBeat</span>
              <span className="w-2 h-2 rounded-full bg-brand-red shadow-glow-red animate-pulse ml-0.5" />
            </NavLink>
          </div>

          {/* Middle Headline */}
          <div className="relative z-10 space-y-4 max-w-xl my-auto py-12">
            <h1 className="font-heading font-black text-5xl lg:text-6xl tracking-tight uppercase leading-[1.05] text-white">
              MANAGE THE SOUND.<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-red via-red-400 to-white">
                SHAPE THE STORY.
              </span>
            </h1>
            <div className="w-16 h-1 bg-brand-red rounded-full shadow-glow-red" />
            <p className="text-gray-300 text-sm font-heading leading-relaxed">
              Welcome to TheOFFBeat Admin Portal.<br />
              Create. Update. Inspire.
            </p>
          </div>

          {/* Bottom 4 Feature Cards */}
          <div className="relative z-10 grid grid-cols-4 gap-4 pt-6 border-t border-white/10">
            <div className="space-y-1.5 p-3 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
              <Music size={20} className="text-brand-red" />
              <h4 className="text-xs font-bold text-white uppercase">Manage Music</h4>
              <p className="text-[11px] text-gray-400 leading-tight">Add, edit and organize releases.</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
              <Video size={20} className="text-brand-red" />
              <h4 className="text-xs font-bold text-white uppercase">Showcase Reels</h4>
              <p className="text-[11px] text-gray-400 leading-tight">Upload and manage shorts & reels.</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
              <Users size={20} className="text-brand-red" />
              <h4 className="text-xs font-bold text-white uppercase">Grow Community</h4>
              <p className="text-[11px] text-gray-400 leading-tight">View subscribers & lyrics.</p>
            </div>

            <div className="space-y-1.5 p-3 rounded-2xl bg-black/40 border border-white/5 backdrop-blur-md">
              <BarChart3 size={20} className="text-brand-red" />
              <h4 className="text-xs font-bold text-white uppercase">Track Insights</h4>
              <p className="text-[11px] text-gray-400 leading-tight">Monitor reach & performance.</p>
            </div>
          </div>

        </div>


        {/* RIGHT COLUMN: LOGIN FORM CARD */}
        <div className="flex-1 flex items-center justify-center p-6 sm:p-12 relative">
          
          {/* Ambient Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-brand-red/10 blur-[150px] rounded-full pointer-events-none" />

          <div className="w-full max-w-md bg-dark-900/90 border border-brand-red/40 p-8 sm:p-10 rounded-3xl shadow-glow-red-lg backdrop-blur-2xl relative z-10 space-y-6">
            
            {/* Lock Icon Badge */}
            <div className="text-center space-y-3">
              <div className="w-14 h-14 rounded-2xl bg-dark-950 border border-brand-red/40 flex items-center justify-center text-brand-red mx-auto shadow-glow-red">
                <Lock size={26} />
              </div>
              <div>
                <span className="text-[11px] font-black uppercase tracking-widest text-brand-red font-mono block mb-1">
                  ADMIN PORTAL
                </span>
                <h2 className="text-3xl font-black font-heading text-white uppercase tracking-tight">
                  Welcome Back
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  Sign in to manage your music platform.
                </p>
              </div>
            </div>

            {/* Error Message */}
            {error && (
              <div className="p-4 rounded-2xl bg-red-950/90 border border-red-500/40 text-red-300 text-xs flex items-start gap-2.5 shadow-lg">
                <AlertCircle size={18} className="shrink-0 text-red-400 mt-0.5" />
                <span>{error}</span>
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} autoComplete="off" className="space-y-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-mono">
                  Email / Username
                </label>
                <div className="relative">
                  <input
                    type="email"
                    name="admin_secret_user"
                    autoComplete="new-password"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email or username"
                    className="w-full px-4 py-3.5 pl-11 bg-dark-950 border border-white/15 focus:border-brand-red rounded-xl text-white text-sm focus:outline-none transition-colors"
                  />
                  <Mail size={18} className="absolute left-3.5 top-4 text-gray-500" />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2 font-mono">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="admin_secret_pass"
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Enter your password"
                    className="w-full px-4 py-3.5 pl-11 pr-11 bg-dark-950 border border-white/15 focus:border-brand-red rounded-xl text-white text-sm focus:outline-none transition-colors"
                  />
                  <Lock size={18} className="absolute left-3.5 top-4 text-gray-500" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 top-4 text-gray-500 hover:text-white transition-colors cursor-pointer"
                    title={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full py-4 bg-brand-red hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-xl shadow-glow-red hover:shadow-glow-red-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>SIGNING IN...</span>
                  </>
                ) : (
                  <>
                    <span>SIGN IN</span>
                    <ArrowRight size={16} />
                  </>
                )}
              </button>
            </form>

            {/* Back to Website Link */}
            <div className="pt-4 border-t border-white/10 text-center space-y-3">
              <NavLink
                to="/"
                className="inline-flex items-center gap-2 text-xs font-bold text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft size={14} />
                <span>Back to Website</span>
              </NavLink>

              <p className="text-[11px] text-gray-500 font-mono">
                © {new Date().getFullYear()} TheOFFBeat. All rights reserved.
              </p>
            </div>

          </div>
        </div>

      </div>
    </PageTransition>
  );
}
