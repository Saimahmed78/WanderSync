import React from 'react';
import {
  XCircle,
  CheckCircle2,
  MessageSquare,
  LayoutGrid,
  CreditCard,
  Zap,
  Users,
  MapPin,
  ShieldCheck,
  Sparkles,
  ChevronRight,
  Menu,
  X,
  Smartphone,
  Globe
} from 'lucide-react';
import CtaButton from './CtaButton';

export function Hero() {

  return (
    <div className="min-h-screen bg-[#020617] font-sans text-slate-200 selection:bg-indigo-500/30">


      {/* --- 1. HERO SECTION --- */}
      <header className="relative pt-20 pb-32 px-6 overflow-hidden">
        {/* Animated Background Orbs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10">
          <div className="absolute top-[-10%] left-[10%] w-[300px] h-[300px] bg-indigo-600/20 blur-[120px] rounded-full" />
          <div className="absolute bottom-[10%] right-[10%] w-[400px] h-[400px] bg-blue-600/10 blur-[120px] rounded-full" />
        </div>

        <div className="max-w-5xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-slate-800/50 border border-slate-700 px-4 py-2 rounded-full text-indigo-300 text-sm font-bold mb-8 shadow-inner">
            <Sparkles size={16} className="text-indigo-400" /> 2026 Buildathon Edition
          </div>
          <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.05] mb-8 text-white">
            Sync Your Squad. <br />
            <span className="bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent">Split The Cost.</span> <br />
            See The World.
          </h1>
          <p className="text-xl text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
            Stop digging through 400 unread WhatsApp messages just to find the Airbnb link.
            WanderSync turns group travel chaos into a unified, real-time workspace.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-5">
            <CtaButton to="/register" className="w-full sm:w-auto px-10 py-5 bg-indigo-600 text-white rounded-2xl text-lg font-bold shadow-2xl shadow-indigo-900/40 hover:bg-indigo-500 transition-all hover:-translate-y-1 flex items-center justify-center gap-2">
              Start Planning for Free <ChevronRight size={20} />
            </CtaButton>
            <CtaButton to="/login" className="w-full sm:w-auto px-10 py-5 bg-slate-800/50 border border-slate-700 text-white rounded-2xl text-lg font-bold hover:bg-slate-700 transition-all">
              Login
            </CtaButton>
          </div>
        </div>
      </header>

      {/* --- 2. OLD WAY VS WANDERSYNC --- */}
      <section id="comparison" className="py-24 px-6 bg-[#020617]">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-2 gap-0 rounded-[2rem] overflow-hidden border border-slate-800 shadow-[0_0_50px_-12px_rgba(0,0,0,0.5)]">
            {/* The Old Way */}
            <div className="bg-[#0f172a]/50 p-8 md:p-14 border-b md:border-b-0 md:border-r border-slate-800">
              <div className="flex items-center gap-3 mb-10 text-slate-500">
                <XCircle className="w-8 h-8" />
                <span className="text-xl font-bold uppercase tracking-widest opacity-70">The Chaos Way</span>
              </div>
              <ul className="space-y-8">
                {[
                  { icon: <MessageSquare />, text: "Messy WhatsApp threads where links go to die." },
                  { icon: <LayoutGrid />, text: "Clunky Excel sheets that break on mobile." },
                  { icon: <CreditCard />, text: "Awkward 'who owes what' dinner math." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-5 opacity-40">
                    <div className="mt-1 p-2 bg-slate-800 rounded-xl text-slate-400">{item.icon}</div>
                    <p className="text-lg font-medium text-slate-300 line-through decoration-slate-500">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>

            {/* The WanderSync Way */}
            <div className="bg-gradient-to-br from-indigo-900/40 to-[#020617] p-8 md:p-14 relative group">
              <div className="absolute top-0 right-0 p-4">
                <Zap className="w-12 h-12 text-indigo-500/20 group-hover:text-indigo-500/40 transition-colors" />
              </div>
              <div className="flex items-center gap-3 mb-10 relative z-10">
                <CheckCircle2 className="w-8 h-8 text-indigo-400" />
                <span className="text-xl font-bold uppercase tracking-widest text-indigo-400">The WanderSync Way</span>
              </div>
              <ul className="space-y-8 relative z-10">
                {[
                  { icon: <Globe />, text: "Structured timelines with pinned locations." },
                  { icon: <Smartphone />, text: "Mobile-first design with offline access." },
                  { icon: <Zap />, text: "Real-time automated budgeting and splits." }
                ].map((item, i) => (
                  <li key={i} className="flex gap-5">
                    <div className="mt-1 p-2 bg-indigo-500/20 rounded-xl text-indigo-400 ring-1 ring-indigo-500/30">{item.icon}</div>
                    <p className="text-lg font-semibold text-white leading-snug">{item.text}</p>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* --- 3. CORE FEATURES --- */}
      <section id="features" className="py-24 px-6 max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-black text-white mb-4">Built for the Modern Squad</h2>
          <p className="text-slate-400">Features designed to keep the peace and enjoy the view.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              title: "Real-time Sync",
              desc: "Build the vibe together. Multiple friends can edit the itinerary simultaneously.",
              icon: <Users />
            },
            {
              title: "Budget Shield",
              desc: "Zero math. Integrated expense tracking that splits the bill the moment you book.",
              icon: <ShieldCheck />
            },
            {
              title: "Admin Control",
              desc: "Designated drivers for the plan. Lock down days once they are finalized.",
              icon: <LayoutGrid />
            },
            {
              title: "Smart Stays",
              desc: "Browsing that respects your budget ceiling and group size automatically.",
              icon: <MapPin />
            }
          ].map((feature, i) => (
            <div key={i} className="p-8 rounded-[2rem] bg-slate-900/40 border border-slate-800 hover:border-indigo-500/50 hover:bg-slate-900/60 transition-all group">
              <div className="w-14 h-14 bg-slate-800 rounded-2xl flex items-center justify-center mb-6 text-indigo-400 group-hover:scale-110 group-hover:bg-indigo-600 group-hover:text-white transition-all">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white">{feature.title}</h3>
              <p className="text-slate-400 leading-relaxed text-sm">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* --- 4. CLOSING SECTION --- */}
      <section className="px-6 py-28 relative overflow-hidden">
        <div className="max-w-5xl mx-auto bg-gradient-to-r from-indigo-600 to-blue-700 rounded-[3rem] p-12 md:p-24 text-center text-white shadow-[0_20px_50px_rgba(79,70,229,0.3)]">
          <div className="relative z-10">
            <h2 className="text-4xl md:text-6xl font-black mb-8 leading-tight">
              Don't let the group chat <br className="hidden md:block" /> kill the vibe.
            </h2>
            <p className="text-indigo-100 text-xl mb-12 max-w-xl mx-auto opacity-90">
              Your dream trip is currently dying in a spreadsheet. Bring it to life in under 60 seconds.
            </p>
            <button className="px-12 py-5 bg-white text-indigo-600 rounded-2xl text-xl font-black shadow-xl hover:scale-105 active:scale-95 transition-all">
              Sync Your Trip Now
            </button>
          </div>

          {/* Abstract background shapes for the CTA box */}
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-32 -mt-32" />
          <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-3xl -ml-32 -mb-32" />
        </div>
      </section>


    </div>
  );
}
