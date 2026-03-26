import { Zap } from 'lucide-react';

export function Footer() {
  return (
   <footer className="py-12 text-center text-slate-600 text-sm border-t border-slate-900">
        <div className="flex justify-center items-center gap-2 mb-4">
          <Zap size={18} />
          <span className="font-bold text-slate-400 tracking-widest uppercase text-xs">WanderSync 2026</span>
        </div>
        <p>© Built for the Buildathon. No more spreadsheets. Ever.</p>
      </footer>
  );
}
