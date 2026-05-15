import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { Calendar, MessageCircle } from "lucide-react";

import { connectToDatabase } from "@/lib/mongodb";
import Event from "@/models/Event";
import { CountdownTimer } from "@/components/CountdownTimer";

export default async function LandingPage() {
  const session = await getServerSession(authOptions);
  
  await connectToDatabase();
  const nextEvent = await Event.findOne({ 
    isPublished: true, 
    startTime: { $gt: new Date() } 
  }).sort({ startTime: 1 });

  return (
    <div className="schedule-retro relative min-h-screen">
      {/* Animated Background Layers */}
      <div className="stars-container" />
      <div className="neon-grid" />
      <div className="synth-sun" />
      <div className="scanline-overlay" />
      
      {/* Floating Retro Icons (Decorative) */}
      
      <div className="main-shell flex flex-col items-center justify-center pt-20">
        <div className="hero animate-in fade-in slide-in-from-bottom-8 duration-1000">
          <div className="hero-logo mb-6">
            <Image 
              src="/mic-logo.png" 
              alt="MIC Logo" 
              width={100} 
              height={80} 
              className="object-contain"
            />
          </div>
          
          <h1 className="mb-4">
            MEET THE<br />FUTURE
          </h1>
          
          <div className="hero-rule mb-8" />
          
          {nextEvent && (
            <div className="mb-10 animate-pulse">
              <p className="text-[#79f2a1] text-xs font-black tracking-[0.4em] mb-2 uppercase">Next Transmission Starts In:</p>
              <div className="bg-black/40 border border-[#79f2a1]/20 rounded-xl px-6 py-4 backdrop-blur-md inline-block">
                 <div className="text-3xl font-black tracking-widest text-white font-mono">
                    <CountdownTimer target={nextEvent.startTime.toISOString()} />
                 </div>
                 <p className="text-arcade-muted text-[10px] mt-2 font-bold tracking-widest uppercase">{nextEvent.title}</p>
              </div>
            </div>
          )}

          <p className="max-w-2xl text-lg mb-10 leading-relaxed text-arcade-muted">
            Experience the next generation of collaboration. The Microsoft Innovations Club 
            Meet Portal brings together high-performance video conferencing and 
            seamless event scheduling in one retro-futuristic space.
          </p>

          <div className="flex flex-wrap items-center justify-center gap-6 mb-20">
            <Link href="/schedule">
              <Button size="lg" className="arcade-btn h-16 px-10 text-xl font-black tracking-widest hover:scale-105 transition-transform">
                ENTER PORTAL
              </Button>
            </Link>
            
            {!session && (
              <Link href="/api/auth/signin">
                <Button size="lg" variant="outline" className="h-16 px-10 text-xl font-bold border-2 border-[#ffafd5]/30 bg-black/40 backdrop-blur-md hover:bg-[#ffafd5]/10 text-[#ffafd5]">
                  IDENTIFY
                </Button>
              </Link>
            )}
          </div>
        </div>

        {/* Organizers Section */}
        <div className="event-section w-full animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-300">
          <div className="mx-auto max-w-5xl rounded-4xl border border-white/10 bg-black/25 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md sm:p-8">
            <div className="mb-8 flex flex-col gap-3 text-center">
              <h2 className="section-title">ORGANIZERS</h2>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-arcade-muted sm:text-base">
                The core team at Microsoft Innovations Club ensuring the smooth operation and high-quality content of all meet sessions.
              </p>
            </div>
            
            <div className="flex flex-wrap justify-center gap-6">
              {[
                { name: "Srijan", role: "President" },
                { name: "Sudeep", role: "SECRETARY" },
                { name: "Palak", role: "VICE-SECRETARY" }
              ].map((organizer, i) => (
                <div key={i} className="event-card max-w-70 group hover:border-[#ffafd5]/40 transition-all duration-300">
                  <div className="event-card__content">
                    <div className="event-card__topline">
                      <span className="tag tag-primary">{organizer.role}</span>
                    </div>
                    <div className="flex flex-col items-center gap-4 py-4">
                       <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-[#ffafd5]/30 bg-white/10 text-2xl font-black tracking-wider text-[#ffafd5] shadow-[0_0_20px_rgba(249,77,180,0.2)] group-hover:scale-110 transition-transform duration-300">
                         {organizer.name.slice(0, 2).toUpperCase()}
                       </div>
                       <span className="event-card__title text-center group-hover:text-[#ffafd5] transition-colors">{organizer.name.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sponsors Section */}
        <div className="event-section w-full mt-24 animate-in fade-in slide-in-from-bottom-12 duration-1000 delay-500">
          <div className="mx-auto max-w-5xl rounded-4xl border border-white/10 bg-black/25 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.28)] backdrop-blur-md sm:p-8">
            <div className="mb-8 flex flex-col gap-3 text-center">
              <h2 className="section-title">SPONSORS</h2>
              <p className="mx-auto max-w-2xl text-sm leading-relaxed text-arcade-muted sm:text-base">
                Partners supporting the event with tools, platforms, and visibility across the hackathon and session tracks.
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
              {[
                {
                  name: "HackerRank",
                  url: "https://h8z6stjynz.ufs.sh/f/nEev6VX4XfKEv3e6MOhWmy6tpuiexQX81z0fGaEJbT52MDPl",
                  accent: "from-emerald-400/20 via-emerald-400/5 to-transparent",
                },
                {
                  name: "GSSoc",
                  url: "https://h8z6stjynz.ufs.sh/f/nEev6VX4XfKEESHt6lrzHSbAfolN0Uc2Ti7Iud45D3KhyjMg",
                  accent: "from-cyan-400/20 via-cyan-400/5 to-transparent",
                },
                {
                  name: "Google Gemini",
                  url: "https://h8z6stjynz.ufs.sh/f/nEev6VX4XfKEFoJjaslA09oihcYfavCU8QVN7Oswmu3e6j14",
                  accent: "from-violet-400/20 via-violet-400/5 to-transparent",
                },
                {
                  name: "Unstop",
                  url: "https://h8z6stjynz.ufs.sh/f/nEev6VX4XfKEdI7htgFn631F9x5hwaSXEY2mNqbjRAi8ulfs",
                  accent: "from-sky-400/20 via-sky-400/5 to-transparent",
                },
              ].map((sponsor) => (
                <div key={sponsor.name} className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 transition-all duration-300 hover:-translate-y-1 hover:border-[#ffafd5]/30 hover:bg-white/10">
                  <div className={`absolute inset-0 bg-linear-to-br ${sponsor.accent}`} />
                  <div className="relative flex min-h-44 flex-col items-center justify-between gap-4">
                    <div className="flex h-24 w-full items-center justify-center rounded-xl bg-white/90 px-5 py-4 shadow-sm ring-1 ring-black/5 transition-transform duration-300 group-hover:scale-[1.02]">
                      <Image
                        src={sponsor.url}
                        alt={`${sponsor.name} logo`}
                        width={320}
                        height={120}
                        className="h-full w-full object-contain"
                      />
                    </div>
                    <div className="text-center">
                      <p className="text-sm font-black tracking-[0.3em] text-white/90">{sponsor.name.toUpperCase()}</p>
                      <p className="mt-2 text-xs uppercase tracking-[0.28em] text-arcade-muted">Official partner</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <footer className="mt-32 w-full border-t-2 border-[#ffafd5]/10 pt-16 pb-20">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-left">
            <div>
              <h3 className="text-primary font-black tracking-tighter text-xl mb-6">MEET PORTAL</h3>
              <p className="text-arcade-muted text-sm leading-relaxed">
                A specialized platform for the Microsoft Innovations Club to manage and host high-impact technical sessions and hackathons.
              </p>
            </div>
            <div>
              <h3 className="text-[#ffafd5] font-black tracking-tighter text-xl mb-6">QUICK LINKS</h3>
              <ul className="space-y-3 text-sm font-bold text-arcade-muted">
                <li><Link href="/schedule" className="hover:text-primary transition-colors">Schedule</Link></li>
                <li><Link href="/admin" className="hover:text-primary transition-colors">Admin Dashboard</Link></li>
                <li><Link href="/login" className="hover:text-primary transition-colors">Identification</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-blue-400 font-black tracking-tighter text-xl mb-6">CONNECT</h3>
              <div className="flex gap-4">
                <Link href="https://instagram.com/mic_vitc" target="_blank" className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 hover:text-pink-400 transition-all">
                   <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
                    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
                    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
                  </svg>
                </Link>
                <Link href="https://linkedin.com/company/mic-vitc" target="_blank" className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 hover:text-blue-400 transition-all">
                   <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="20"
                    height="20"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect x="2" y="9" width="4" height="12"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                </Link>
                <Link href="https://chat.whatsapp.com/..." target="_blank" className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 hover:text-green-400 transition-all">
                   <MessageCircle className="h-5 w-5" />
                </Link>
              </div>
            </div>
          </div>
          <div className="mt-20 text-center text-xs font-bold tracking-widest opacity-40">
            &copy; 2026 MICROSOFT INNOVATIONS CLUB | POWERED BY MIC DEV TEAM
          </div>
        </footer>
      </div>
    </div>
  );
}
