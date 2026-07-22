import React, { useState } from 'react';
import { sendContactMessage } from '../services/api';
import PageTransition from '../components/PageTransition';
import { Mail, Instagram, Youtube, Send, CheckCircle2, AlertCircle, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Contact({ settings }) {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);

  const instagramUrl = settings?.instagram_url || "https://www.instagram.com/theoffbeat_original?utm_source=qr";
  const youtubeUrl = settings?.youtube_url || "https://www.youtube.com/@theoffbeat_original";
  const contactEmail = settings?.contact_email || "management@theoffbeat.com";

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setToast(null);

    try {
      const response = await sendContactMessage(formData);
      setToast({ type: 'success', message: response.data.message });
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      const errorMsg = err.response?.data?.error || 'Failed to send message. Please try again.';
      setToast({ type: 'error', message: errorMsg });
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageTransition>
      <div className="bg-dark-950 min-h-screen pt-28 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          {/* Header */}
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-4">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
              GET IN TOUCH
            </span>
            <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight text-white uppercase">
              Contact TheOFFBeat
            </h1>
            <p className="text-gray-400 text-base leading-relaxed font-heading italic">
              "Dil se Likha, Beat pe Jeeya..." — Send us booking, performance, or fan messages below.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">

            {/* Left Info Panel */}
            <div className="lg:col-span-5 space-y-8 bg-dark-900/60 border border-white/10 p-8 sm:p-10 rounded-3xl h-fit">
              <div>
                <h3 className="text-2xl font-bold font-heading uppercase text-white mb-2">
                  Direct Inquiries
                </h3>
                <p className="text-gray-400 text-sm">
                  We respond to all genuine inquiries within 24-48 hours.
                </p>
              </div>

              <div className="space-y-6 pt-2">
                <div className="flex items-start gap-4">
                  <div className="p-3 bg-brand-red/10 border border-brand-red/30 rounded-xl text-brand-red">
                    <Mail size={22} />
                  </div>
                  <div>
                    <span className="text-xs font-bold uppercase text-gray-400">Business Email</span>
                    <p className="text-white font-medium text-sm mt-0.5 font-mono">
                      <a href={`mailto:${contactEmail}`} className="hover:text-brand-red transition-colors">
                        {contactEmail}
                      </a>
                    </p>
                  </div>
                </div>

                <div className="pt-6 border-t border-white/10">
                  <span className="text-xs font-bold uppercase tracking-wider text-gray-400 block mb-4">
                    Official Social Channels
                  </span>
                  <div className="flex items-center space-x-4">
                    <a
                      href={instagramUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white/[0.04] border border-white/10 hover:border-brand-red rounded-xl text-white hover:bg-brand-red transition-all"
                      aria-label="Instagram"
                      title="Follow on Instagram"
                    >
                      <Instagram size={20} />
                    </a>
                    <a
                      href={youtubeUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="p-3 bg-white/[0.04] border border-white/10 hover:border-brand-red rounded-xl text-white hover:bg-brand-red transition-all"
                      aria-label="YouTube"
                      title="Subscribe on YouTube"
                    >
                      <Youtube size={20} />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7 bg-dark-900/80 border border-white/10 p-8 sm:p-10 rounded-3xl shadow-2xl">
              <form onSubmit={handleSubmit} className="space-y-6">

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-2">
                      Your Name *
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      placeholder="e.g. Rahul Sharma"
                      className="w-full px-4 py-3 bg-dark-950 border border-white/15 focus:border-brand-red rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-red transition-all"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold uppercase text-gray-300 mb-2">
                      Your Email *
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      placeholder="name@example.com"
                      className="w-full px-4 py-3 bg-dark-950 border border-white/15 focus:border-brand-red rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-red transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    name="subject"
                    value={formData.subject}
                    onChange={handleChange}
                    placeholder="e.g. Performance / Music Inquiry"
                    className="w-full px-4 py-3 bg-dark-950 border border-white/15 focus:border-brand-red rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-red transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-gray-300 mb-2">
                    Message *
                  </label>
                  <textarea
                    name="message"
                    rows="5"
                    value={formData.message}
                    onChange={handleChange}
                    required
                    placeholder="Type your message here..."
                    className="w-full px-4 py-3 bg-dark-950 border border-white/15 focus:border-brand-red rounded-xl text-white text-sm focus:outline-none focus:ring-1 focus:ring-brand-red transition-all resize-none"
                  />
                </div>

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-4 bg-brand-red hover:bg-brand-redHover text-white font-bold text-sm uppercase tracking-wider rounded-xl shadow-glow-red hover:shadow-glow-red-lg transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 cursor-pointer"
                >
                  {loading ? (
                    <Loader2 size={18} className="animate-spin" />
                  ) : (
                    <>
                      <span>SEND MESSAGE</span>
                      <Send size={18} />
                    </>
                  )}
                </button>

                {/* Toast alert feedback */}
                <AnimatePresence>
                  {toast && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className={`p-4 rounded-xl flex items-center gap-3 text-sm ${
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

              </form>
            </div>

          </div>

        </div>
      </div>
    </PageTransition>
  );
}
