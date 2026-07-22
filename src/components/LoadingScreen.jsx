import React from 'react';

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-50 bg-dark-950 flex flex-col items-center justify-center space-y-4">
      <div className="flex items-center gap-1 font-heading font-black text-3xl tracking-wider text-white animate-pulse">
        <span>ECHO</span>
        <span className="italic text-brand-red">Verse</span>
      </div>
      <div className="w-48 h-1 bg-white/10 rounded-full overflow-hidden">
        <div className="w-full h-full bg-brand-red animate-pulse shadow-glow-red" />
      </div>
    </div>
  );
}
