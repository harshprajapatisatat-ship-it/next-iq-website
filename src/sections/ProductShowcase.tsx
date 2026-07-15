'use client';

import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

export default function ProductShowcase() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const mockupRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const ctx = gsap.context(() => {
      gsap.fromTo(
        mockupRef.current,
        { scale: 0.65, borderRadius: '28px' },
        {
          scale: 1,
          borderRadius: '8px',
          ease: 'none',
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: 'top top',
            end: '+=150%',
            pin: true,
            scrub: 1.2,
            anticipatePin: 1,
          },
        }
      );
    });

    return () => ctx.revert();
  }, []);

  return (
    <div ref={wrapperRef} className="relative flex flex-col items-center justify-center min-h-screen bg-[#f4f4f5] px-6 overflow-hidden">

      <div className="text-center mb-10 max-w-[560px]">
        <p className="font-matter text-[12px] font-semibold text-[#a1a1aa] uppercase tracking-[0.14em] mb-3">
          Platform
        </p>
        <h2 className="font-season-mix font-normal text-[38px] leading-[1.1] tracking-[-0.025em] text-[#18181b]">
          Everything in one place
        </h2>
        <p className="font-matter text-[16px] text-[#71717a] mt-3 leading-[1.6]">
          Manage your entire ERPNext automation workflow from a single, intuitive dashboard.
        </p>
      </div>

      <div
        ref={mockupRef}
        style={{ transformOrigin: 'center center' }}
        className="w-full max-w-[960px] bg-[#09090b] overflow-hidden shadow-2xl"
      >
        <div className="h-[520px] flex flex-col">

          {/* Window titlebar */}
          <div className="flex items-center gap-2 px-4 py-3 border-b border-white/10 shrink-0">
            <span className="w-3 h-3 rounded-full bg-[#ff5f57]" />
            <span className="w-3 h-3 rounded-full bg-[#febc2e]" />
            <span className="w-3 h-3 rounded-full bg-[#28c840]" />
            <span className="ml-4 text-white/30 text-[12px] font-matter">nexiq.app / automations</span>
          </div>

          {/* App layout */}
          <div className="flex flex-1 overflow-hidden">

            {/* Sidebar */}
            <div className="w-[200px] border-r border-white/10 p-4 flex flex-col gap-1 shrink-0">
              {['Dashboard', 'Automations', 'Leads', 'Support', 'CRM', 'Analytics'].map((item) => (
                <div
                  key={item}
                  className={`px-3 py-2 rounded-lg text-[13px] font-matter transition-colors ${
                    item === 'Automations'
                      ? 'bg-white/10 text-white font-medium'
                      : 'text-white/40'
                  }`}
                >
                  {item}
                </div>
              ))}
            </div>

            {/* Main content */}
            <div className="flex-1 p-6 overflow-hidden">

              {/* Stats row */}
              <div className="grid grid-cols-3 gap-3 mb-5">
                {[
                  { label: 'Active Flows', value: '24' },
                  { label: 'Leads Captured', value: '1,284' },
                  { label: 'Time Saved', value: '38h' },
                ].map((stat) => (
                  <div key={stat.label} className="bg-white/5 rounded-xl p-4">
                    <p className="text-white/40 text-[11px] font-matter mb-1">{stat.label}</p>
                    <p className="text-white text-[24px] font-normal font-season-mix leading-none">{stat.value}</p>
                  </div>
                ))}
              </div>

              {/* Automation flows list */}
              <div className="flex flex-col gap-2">
                {[
                  { name: 'New Lead → CRM Entry', status: 'Active', runs: '245' },
                  { name: 'Support Ticket → Assignment', status: 'Active', runs: '189' },
                  { name: 'Sales Order → Invoice', status: 'Active', runs: '92' },
                  { name: 'Delivery Note → Stock Update', status: 'Paused', runs: '41' },
                ].map((flow) => (
                  <div
                    key={flow.name}
                    className="flex items-center justify-between bg-white/5 rounded-lg px-4 py-3"
                  >
                    <span className="text-white/80 text-[13px] font-matter">{flow.name}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-white/30 text-[12px] font-matter">{flow.runs} runs</span>
                      <span
                        className={`text-[11px] font-medium px-2 py-0.5 rounded-full font-matter ${
                          flow.status === 'Active'
                            ? 'bg-emerald-500/20 text-emerald-400'
                            : 'bg-white/10 text-white/40'
                        }`}
                      >
                        {flow.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

            </div>
          </div>
        </div>
      </div>

    </div>
  );
}
