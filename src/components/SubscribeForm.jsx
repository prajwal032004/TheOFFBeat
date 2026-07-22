import React, { useState } from 'react';
import { subscribeNewsletter } from '../services/api';
import { Mail, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SubscribeForm() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setToast({ type: 'error', message: 'Please enter a valid email address.' });
      return;
    }

    setLoading(true);
    setToast(null);

    try {
      const response = await subscribeNewsletter(email);
      setToast({ type: 'success', message: response.data.message || 'Successfully subscribed!' });
      setEmail('');
    } catch (err) {
      const errorMsg = err.response?.data?.error || err.response?.data?.message || 'Failed to subscribe. Please try again.';
      setToast({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <section id="newsletter-section" className="py-20 bg-dark-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-white/10 rounded-3xl p-8 sm:p-12 relative overflow-hidden shadow-2xl">

          {/* Red Glow Background Effect */}
          <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-brand-red/15 rounded-full filter blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">

            {/* Left Content & Form */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
                SUBSCRIBE
              </span>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black font-heading tracking-tight text-white uppercase">
                Stay Updated
              </h2>

              <p className="text-gray-300 text-sm sm:text-base max-w-lg leading-relaxed">
                Subscribe to our newsletter and never miss our new releases, tour updates, behind-the-scenes content, and exclusive merch drops.
              </p>

              {/* Form Input */}
              <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md pt-2">
                <div className="relative flex-grow">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter your email"
                    required
                    className="w-full px-4 py-3.5 bg-dark-950/80 border border-white/15 focus:border-brand-red text-white text-sm rounded-xl focus:outline-none focus:ring-1 focus:ring-brand-red transition-all"
                  />
                </div>
                <button
                  type="submit"
                  disabled={loading}
                  className="px-8 py-3.5 bg-brand-red hover:bg-brand-redHover text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-glow-red hover:shadow-glow-red-lg transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <span>SUBSCRIBE</span>
                  )}
                </button>
              </form>

              {/* Toast Feedback */}
              <AnimatePresence>
                {toast && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`p-4 rounded-xl flex items-center gap-3 text-sm max-w-md ${
                      toast.type === 'success'
                        ? 'bg-green-950/80 border border-green-500/30 text-green-300'
                        : 'bg-red-950/80 border border-red-500/30 text-red-300'
                    }`}
                  >
                    {toast.type === 'success' ? (
                      <CheckCircle2 size={20} className="text-green-400 flex-shrink-0" />
                    ) : (
                      <AlertCircle size={20} className="text-red-400 flex-shrink-0" />
                    )}
                    <span>{toast.message}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Right Graphic matching reference 3D envelope & music note artwork */}
            <div className="lg:col-span-5 hidden lg:flex justify-center items-center">
              <div className="relative w-64 h-64 bg-dark-950/80 border border-white/10 rounded-3xl p-8 flex items-center justify-center shadow-glow-red-lg transform rotate-3 hover:rotate-0 transition-transform duration-500">
                <div className="absolute inset-0 bg-brand-red/10 rounded-3xl filter blur-xl" />
                <div className="relative flex flex-col items-center gap-3">
                  <div className="p-6 rounded-2xl bg-dark-900 border border-brand-red/40 text-brand-red shadow-glow-red">
                    <Mail size={56} className="text-brand-red" />
                  </div>
                  <div className="flex items-center gap-2 text-xs font-mono text-gray-400 tracking-wider">
                    <span className="w-2 h-2 rounded-full bg-brand-red animate-ping" />
                    <span>THEOFFBEAT VIP CLUB</span>

                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}
