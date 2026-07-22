import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

export default function AboutPreview({ settings }) {
  const navigate = useNavigate();

  return (
    <section className="py-20 bg-dark-950 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-dark-900/60 border border-white/10 rounded-3xl p-8 sm:p-12 lg:p-16 relative overflow-hidden shadow-2xl">

          {/* Glowing background accent */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-brand-red/10 rounded-full filter blur-3xl pointer-events-none" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">

            {/* Left Info Column */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-brand-red/10 border border-brand-red/30 rounded-full">
                <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
                  ABOUT US
                </span>
              </div>

              <h2 className="text-4xl sm:text-5xl font-black font-heading tracking-tight text-white uppercase">
                {settings?.duo_name || "TheOFFBeat"}
              </h2>

              <p className="text-brand-red font-heading italic text-lg font-semibold">
                "{settings?.tagline || 'Dil se Likha, Beat pe Jeeya...'}"
              </p>

              <p className="text-gray-300 text-base leading-relaxed">
                {settings?.about_story || "TheOFFBeat is an independent music duo dedicated to pure emotion and rhythmic authenticity. From soulful romantic melodies to hard-hitting hip-hop beats, every track is crafted with deep passion."}
              </p>

              <div className="pt-2">
                <button
                  onClick={() => navigate('/about')}
                  className="px-8 py-3.5 border border-white/30 hover:border-brand-red bg-white/[0.04] hover:bg-brand-red hover:text-white text-white font-bold text-xs uppercase tracking-wider rounded-xl transition-all duration-300 flex items-center gap-3 shadow-glow-red"
                >
                  <span>KNOW MORE ABOUT US</span>
                  <ArrowRight size={16} />
                </button>
              </div>
            </motion.div>

            {/* Right Image Column */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-6 relative"
            >
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-white/10 shadow-glow-red-lg">
                <img
                  src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1200&q=80"
                  alt="TheOFFBeat Duo"
                  className="w-full h-full object-cover filter brightness-90 contrast-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-dark-950/90 via-transparent to-transparent" />
                <div className="absolute bottom-6 right-6 font-heading italic text-3xl font-black text-white/90 tracking-wider">
                  The<span className="text-brand-red">OFFBeat</span>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </section>
  );
}
