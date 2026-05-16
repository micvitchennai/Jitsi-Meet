import Image from "next/image";
import Link from "next/link";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { Button } from "@/components/ui/button";
import { MessageCircle } from "lucide-react";

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
            MICROCRAFT
          </h1>
          
          <div className="hero-rule mb-8" />
          
          {nextEvent && (
            <div className="mb-16">
              <div className="flex flex-col items-center">
                <p className="text-primary text-sm font-black tracking-[0.6em] mb-10 uppercase drop-shadow-[0_0_15px_rgba(121,242,161,0.4)] animate-pulse">
                  Next Transmission Starts In
                </p>
                <div className="mb-8">
                  <CountdownTimer target={nextEvent.startTime.toISOString()} />
                </div>
                <div className="inline-block px-8 py-2.5 bg-primary/5 border border-primary/20 rounded-full backdrop-blur-md relative overflow-hidden group">
                  <div className="absolute inset-0 bg-primary/10 translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-1000" />
                  <p className="relative text-primary text-sm font-black tracking-[0.3em] uppercase italic">
                    {nextEvent.title}
                  </p>
                </div>
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
                <li><Link href="/login" className="hover:text-primary transition-colors">Login</Link></li>
                <li><Link href="/schedule" className="hover:text-primary transition-colors">Schedule</Link></li>
                <li><Link href="https://meet.microsoftinnovations.club" className="hover:text-primary transition-colors">Microsoft Innovations Meet</Link></li>
              </ul>
            </div>
            <div>
              <h3 className="text-blue-400 font-black tracking-tighter text-xl mb-6">CONNECT</h3>
              <div className="flex gap-4">
                <Link href="https://www.linkedin.com/company/microsoft-innovations-club-vitc" target="_blank" className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 hover:text-pink-400 transition-all">
                    <svg width="800px" height="800px" viewBox="0 0 3364.7 3364.7" xmlns="http://www.w3.org/2000/svg"><defs><radialGradient id="0" cx="217.76" cy="3290.99" r="4271.92" gradientUnits="userSpaceOnUse"><stop offset=".09" stop-color="#fa8f21"/><stop offset=".78" stop-color="#d82d7e"/></radialGradient><radialGradient id="1" cx="2330.61" cy="3182.95" r="3759.33" gradientUnits="userSpaceOnUse"><stop offset=".64" stop-color="#8c3aaa" stopOpacity="0"/><stop offset="1" stop-color="#8c3aaa"/></radialGradient></defs><path d="M853.2,3352.8c-200.1-9.1-308.8-42.4-381.1-70.6-95.8-37.3-164.1-81.7-236-153.5S119.7,2988.6,82.6,2892.8c-28.2-72.3-61.5-181-70.6-381.1C2,2295.4,0,2230.5,0,1682.5s2.2-612.8,11.9-829.3C21,653.1,54.5,544.6,82.5,472.1,119.8,376.3,164.3,308,236,236c71.8-71.8,140.1-116.4,236-153.5C544.3,54.3,653,21,853.1,11.9,1069.5,2,1134.5,0,1682.3,0c548,0,612.8,2.2,829.3,11.9,200.1,9.1,308.6,42.6,381.1,70.6,95.8,37.1,164.1,81.7,236,153.5s116.2,140.2,153.5,236c28.2,72.3,61.5,181,70.6,381.1,9.9,216.5,11.9,281.3,11.9,829.3,0,547.8-2,612.8-11.9,829.3-9.1,200.1-42.6,308.8-70.6,381.1-37.3,95.8-81.7,164.1-153.5,235.9s-140.2,116.2-236,153.5c-72.3,28.2-181,61.5-381.1,70.6-216.3,9.9-281.3,11.9-829.3,11.9-547.8,0-612.8-1.9-829.1-11.9" fill="url(#0)"/><path d="M853.2,3352.8c-200.1-9.1-308.8-42.4-381.1-70.6-95.8-37.3-164.1-81.7-236-153.5S119.7,2988.6,82.6,2892.8c-28.2-72.3-61.5-181-70.6-381.1C2,2295.4,0,2230.5,0,1682.5s2.2-612.8,11.9-829.3C21,653.1,54.5,544.6,82.5,472.1,119.8,376.3,164.3,308,236,236c71.8-71.8,140.1-116.4,236-153.5C544.3,54.3,653,21,853.1,11.9,1069.5,2,1134.5,0,1682.3,0c548,0,612.8,2.2,829.3,11.9,200.1,9.1,308.6,42.6,381.1,70.6,95.8,37.1,164.1,81.7,236,153.5s116.2,140.2,153.5,236c28.2,72.3,61.5,181,70.6,381.1,9.9,216.5,11.9,281.3,11.9,829.3,0,547.8-2,612.8-11.9,829.3-9.1,200.1-42.6,308.8-70.6,381.1-37.3,95.8-81.7,164.1-153.5,235.9s-140.2,116.2-236,153.5c-72.3,28.2-181,61.5-381.1,70.6-216.3,9.9-281.3,11.9-829.3,11.9-547.8,0-612.8-1.9-829.1-11.9" fill="url(#1)"/><path d="M1269.25,1689.52c0-230.11,186.49-416.7,416.6-416.7s416.7,186.59,416.7,416.7-186.59,416.7-416.7,416.7-416.6-186.59-416.6-416.7m-225.26,0c0,354.5,287.36,641.86,641.86,641.86s641.86-287.36,641.86-641.86-287.36-641.86-641.86-641.86S1044,1335,1044,1689.52m1159.13-667.31a150,150,0,1,0,150.06-149.94h-0.06a150.07,150.07,0,0,0-150,149.94M1180.85,2707c-121.87-5.55-188.11-25.85-232.13-43-58.36-22.72-100-49.78-143.78-93.5s-70.88-85.32-93.5-143.68c-17.16-44-37.46-110.26-43-232.13-6.06-131.76-7.27-171.34-7.27-505.15s1.31-373.28,7.27-505.15c5.55-121.87,26-188,43-232.13,22.72-58.36,49.78-100,93.5-143.78s85.32-70.88,143.78-93.5c44-17.16,110.26-37.46,232.13-43,131.76-6.06,171.34-7.27,505-7.27S2059.13,666,2191,672c121.87,5.55,188,26,232.13,43,58.36,22.62,100,49.78,143.78,93.5s70.78,85.42,93.5,143.78c17.16,44,37.46,110.26,43,232.13,6.06,131.87,7.27,171.34,7.27,505.15s-1.21,373.28-7.27,505.15c-5.55,121.87-25.95,188.11-43,232.13-22.72,58.36-49.78,100-93.5,143.68s-85.42,70.78-143.78,93.5c-44,17.16-110.26,37.46-232.13,43-131.76,6.06-171.34,7.27-505.15,7.27s-373.28-1.21-505-7.27M1170.5,447.09c-133.07,6.06-224,27.16-303.41,58.06-82.19,31.91-151.86,74.72-221.43,144.18S533.39,788.47,501.48,870.76c-30.9,79.46-52,170.34-58.06,303.41-6.16,133.28-7.57,175.89-7.57,515.35s1.41,382.07,7.57,515.35c6.06,133.08,27.16,223.95,58.06,303.41,31.91,82.19,74.62,152,144.18,221.43s139.14,112.18,221.43,144.18c79.56,30.9,170.34,52,303.41,58.06,133.35,6.06,175.89,7.57,515.35,7.57s382.07-1.41,515.35-7.57c133.08-6.06,223.95-27.16,303.41-58.06,82.19-32,151.86-74.72,221.43-144.18s112.18-139.24,144.18-221.43c30.9-79.46,52.1-170.34,58.06-303.41,6.06-133.38,7.47-175.89,7.47-515.35s-1.41-382.07-7.47-515.35c-6.06-133.08-27.16-224-58.06-303.41-32-82.19-74.72-151.86-144.18-221.43S2586.8,537.06,2504.71,505.15c-79.56-30.9-170.44-52.1-303.41-58.06C2068,441,2025.41,439.52,1686,439.52s-382.1,1.41-515.45,7.57" fill="#ffffff"/></svg>
                </Link>
                <Link href="https://linkedin.com/company/mic-vitc" target="_blank" className="h-10 w-10 bg-white/5 flex items-center justify-center hover:bg-white/10 hover:text-blue-400 transition-all">
                    <svg width="800px" height="800px" viewBox="0 0 16 16" xmlns="http://www.w3.org/2000/svg" fill="none"><path fill="#0A66C2" d="M12.225 12.225h-1.778V9.44c0-.664-.012-1.519-.925-1.519-.926 0-1.068.724-1.068 1.47v2.834H6.676V6.498h1.707v.783h.024c.348-.594.996-.95 1.684-.925 1.802 0 2.135 1.185 2.135 2.728l-.001 3.14zM4.67 5.715a1.037 1.037 0 01-1.032-1.031c0-.566.466-1.032 1.032-1.032.566 0 1.031.466 1.032 1.032 0 .566-.466 1.032-1.032 1.032zm.889 6.51h-1.78V6.498h1.78v5.727zM13.11 2H2.885A.88.88 0 002 2.866v10.268a.88.88 0 00.885.866h10.226a.882.882 0 00.889-.866V2.865a.88.88 0 00-.889-.864z"/></svg>
                </Link>
                <Link href="https://chat.whatsapp.com/..." target="_blank" className="h-10 w-10 bg-white/5 rounded-lg flex items-center justify-center hover:bg-white/10 hover:text-green-400 transition-all">
                    <svg width="800px" height="800px" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16 31C23.732 31 30 24.732 30 17C30 9.26801 23.732 3 16 3C8.26801 3 2 9.26801 2 17C2 19.5109 2.661 21.8674 3.81847 23.905L2 31L9.31486 29.3038C11.3014 30.3854 13.5789 31 16 31ZM16 28.8462C22.5425 28.8462 27.8462 23.5425 27.8462 17C27.8462 10.4576 22.5425 5.15385 16 5.15385C9.45755 5.15385 4.15385 10.4576 4.15385 17C4.15385 19.5261 4.9445 21.8675 6.29184 23.7902L5.23077 27.7692L9.27993 26.7569C11.1894 28.0746 13.5046 28.8462 16 28.8462Z" fill="#BFC8D0"/>
                    <path d="M28 16C28 22.6274 22.6274 28 16 28C13.4722 28 11.1269 27.2184 9.19266 25.8837L5.09091 26.9091L6.16576 22.8784C4.80092 20.9307 4 18.5589 4 16C4 9.37258 9.37258 4 16 4C22.6274 4 28 9.37258 28 16Z" fill="url(#paint0_linear_87_7264)"/>
                    <path fill-rule="evenodd" clip-rule="evenodd" d="M16 30C23.732 30 30 23.732 30 16C30 8.26801 23.732 2 16 2C8.26801 2 2 8.26801 2 16C2 18.5109 2.661 20.8674 3.81847 22.905L2 30L9.31486 28.3038C11.3014 29.3854 13.5789 30 16 30ZM16 27.8462C22.5425 27.8462 27.8462 22.5425 27.8462 16C27.8462 9.45755 22.5425 4.15385 16 4.15385C9.45755 4.15385 4.15385 9.45755 4.15385 16C4.15385 18.5261 4.9445 20.8675 6.29184 22.7902L5.23077 26.7692L9.27993 25.7569C11.1894 27.0746 13.5046 27.8462 16 27.8462Z" fill="white"/>
                    <path d="M12.5 9.49989C12.1672 8.83131 11.6565 8.8905 11.1407 8.8905C10.2188 8.8905 8.78125 9.99478 8.78125 12.05C8.78125 13.7343 9.52345 15.578 12.0244 18.3361C14.438 20.9979 17.6094 22.3748 20.2422 22.3279C22.875 22.2811 23.4167 20.0154 23.4167 19.2503C23.4167 18.9112 23.2062 18.742 23.0613 18.696C22.1641 18.2654 20.5093 17.4631 20.1328 17.3124C19.7563 17.1617 19.5597 17.3656 19.4375 17.4765C19.0961 17.8018 18.4193 18.7608 18.1875 18.9765C17.9558 19.1922 17.6103 19.083 17.4665 19.0015C16.9374 18.7892 15.5029 18.1511 14.3595 17.0426C12.9453 15.6718 12.8623 15.2001 12.5959 14.7803C12.3828 14.4444 12.5392 14.2384 12.6172 14.1483C12.9219 13.7968 13.3426 13.254 13.5313 12.9843C13.7199 12.7145 13.5702 12.305 13.4803 12.05C13.0938 10.953 12.7663 10.0347 12.5 9.49989Z" fill="white"/>
                    </svg>
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
