import React from 'react';
import { NavLink } from 'react-router-dom';
import { ShieldAlert, ArrowLeft } from 'lucide-react';
import PageTransition from '../components/PageTransition';

export default function NotFound() {
  return (
    <PageTransition>
      <div className="min-h-screen bg-dark-950 flex items-center justify-center px-4 py-28 relative select-none">
        <div className="text-center space-y-6 max-w-md">
          <div className="w-20 h-20 rounded-full bg-brand-red/10 border border-brand-red/40 flex items-center justify-center text-brand-red mx-auto shadow-glow-red">
            <ShieldAlert size={40} />
          </div>

          <div className="space-y-2">
            <span className="text-xs font-mono font-black uppercase text-brand-red tracking-widest">
              ERROR 404
            </span>
            <h1 className="text-4xl sm:text-5xl font-black font-heading text-white uppercase tracking-tight">
              Page Not Found
            </h1>
            <p className="text-sm text-gray-400 leading-relaxed">
              The page you are looking for does not exist, has been removed, or is temporarily unavailable.
            </p>
          </div>

          <div className="pt-2">
            <NavLink
              to="/"
              className="inline-flex items-center gap-2 px-6 py-3 bg-brand-red hover:bg-red-600 text-white font-black text-xs uppercase tracking-wider rounded-full shadow-glow-red transition-all"
            >
              <ArrowLeft size={16} />
              <span>RETURN TO HOMEPAGE</span>
            </NavLink>
          </div>
        </div>
      </div>
    </PageTransition>
  );
}
