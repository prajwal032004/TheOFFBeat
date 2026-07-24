import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getMembers } from '../services/api';
import PageTransition from '../components/PageTransition';
import { ArrowRight, Mic2, Disc, Sliders } from 'lucide-react';
import { motion } from 'framer-motion';

export default function About({ settings }) {
  const navigate = useNavigate();
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);

  const instagramUrl = settings?.instagram_url || "https://www.instagram.com/theoffbeat_original?utm_source=qr";
  const youtubeUrl = settings?.youtube_url || "https://www.youtube.com/@theoffbeat_original";

  useEffect(() => {
    async function fetchMembers() {
      try {
        const res = await getMembers();
        setMembers(res.data || []);
      } catch (err) {
        console.error('Error fetching members:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchMembers();
  }, []);

  return (
    <PageTransition>
      <div className="bg-dark-950 min-h-screen pt-28 pb-20">

        {/* HERO BANNER SECTION */}
        <section className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-20">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 shadow-2xl min-h-[50vh] flex items-end p-8 sm:p-14 bg-dark-900">
            {/* Background image */}
            <img
              src="https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=1920&q=80"
              alt="TheOFFBeat Duo"
              className="absolute inset-0 w-full h-full object-cover filter brightness-40 contrast-125"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-dark-950/60 to-transparent" />

            <div className="relative z-10 space-y-4 max-w-3xl">
              <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
                OUR STORY & VISION
              </span>
              <h1 className="text-4xl sm:text-6xl font-black font-heading tracking-tight text-white uppercase leading-none">
                {settings?.about_headline || "Dil se Likha, Beat pe Jeeya..."}
              </h1>
              <p className="text-gray-300 text-base sm:text-lg leading-relaxed">
                {settings?.about_story || "TheOFFBeat is an independent music duo dedicated to pure emotion and rhythmic authenticity. From soulful romantic melodies to hard-hitting hip-hop beats, every track is crafted with deep passion."}
              </p>
            </div>
          </div>
        </section>

        {/* OUR STORY & JOURNEY SECTION */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

            <div className="bg-dark-900/60 border border-white/10 rounded-2xl p-8 space-y-4 hover:border-brand-red/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center">
                <Disc size={24} />
              </div>
              <h3 className="text-xl font-bold font-heading uppercase text-white">Dil Se Likha</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Writing authentic lyrics straight from the heart. Expressing stories of love, emotion, nostalgia, and introspection.
              </p>
            </div>

            <div className="bg-dark-900/60 border border-white/10 rounded-2xl p-8 space-y-4 hover:border-brand-red/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center">
                <Mic2 size={24} />
              </div>
              <h3 className="text-xl font-bold font-heading uppercase text-white">Beat Pe Jeeya</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Designing signature beats that pulse with life — blending acoustic guitar hooks, modern hip-hop drums, and rich vocal arrangements.
              </p>
            </div>

            <div className="bg-dark-900/60 border border-white/10 rounded-2xl p-8 space-y-4 hover:border-brand-red/40 transition-colors">
              <div className="w-12 h-12 rounded-xl bg-brand-red/10 text-brand-red flex items-center justify-center">
                <Sliders size={24} />
              </div>
              <h3 className="text-xl font-bold font-heading uppercase text-white">Our Vision</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                To connect with listeners worldwide through genuine music, high-quality music videos, and engaging Reels content.
              </p>
            </div>

          </div>
        </section>

        {/* INDIVIDUAL MEMBER PROFILES */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-24">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <span className="text-xs font-bold uppercase tracking-widest text-brand-red">
              THE DUO
            </span>
            <h2 className="text-3xl sm:text-5xl font-black font-heading tracking-tight text-white uppercase">
              Meet The OFFBeat Duo
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {members.map((member) => (
              <motion.div
                key={member.id}
                whileHover={{ y: -8 }}
                transition={{ duration: 0.3 }}
                className="bg-dark-900/80 border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col group h-full"
              >
                <div className="relative aspect-[4/3] w-full overflow-hidden bg-dark-950">
                  <img
                    src={member.image_url}
                    alt={member.name}
                    className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-700 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark-950 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-6">
                    <span className="px-3 py-1 bg-brand-red/90 text-white text-xs font-bold uppercase tracking-wider rounded-md shadow-md">
                      {member.role}
                    </span>
                  </div>
                </div>

                <div className="p-6 sm:p-8 space-y-4 flex-grow flex flex-col justify-between">
                  <div>
                    <h3 className="text-xl sm:text-2xl font-bold font-heading uppercase text-white group-hover:text-brand-red transition-colors">
                      {member.name}
                    </h3>
                    <p className="text-gray-400 text-sm leading-relaxed mt-3">
                      {member.bio}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* CTA BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-r from-dark-900 via-dark-850 to-dark-900 border border-white/10 rounded-3xl p-12 space-y-6 shadow-glow-red-lg">
            <h2 className="text-3xl sm:text-4xl font-black font-heading tracking-tight text-white uppercase">
              Listen To Our Latest Releases
            </h2>
            <p className="text-gray-400 text-base max-w-xl mx-auto">
              Watch "EK TAAREEF" and "KHAMOSHI MEIN MAAFI" now on YouTube!
            </p>
            <button
              onClick={() => navigate('/music')}
              className="inline-flex items-center gap-3 px-8 py-3.5 bg-brand-red hover:bg-brand-redHover text-white font-bold text-sm uppercase tracking-wider rounded-full shadow-glow-red hover:shadow-glow-red-lg transition-all duration-300"
            >
              <span>EXPLORE MUSIC</span>
              <ArrowRight size={18} />
            </button>
          </div>
        </section>

      </div>
    </PageTransition>
  );
}
