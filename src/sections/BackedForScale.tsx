function ERPNextExpertsIcon() {
  return (
    <svg width="38" height="33" viewBox="0 0 38 33" fill="none" aria-hidden="true">
      <rect x="0.75" y="0.75" width="36.5" height="31.5" rx="1.75" stroke="#888" strokeWidth="1.5" />
      <line x1="0.75"  y1="9.75"  x2="37.25" y2="9.75"  stroke="#888" strokeWidth="1.5" />
      <line x1="0.75"  y1="19.25" x2="37.25" y2="19.25" stroke="#888" strokeWidth="1.5" />
      <line x1="12.75" y1="9.75"  x2="12.75" y2="32.25" stroke="#888" strokeWidth="1.5" />
      <line x1="25.25" y1="9.75"  x2="25.25" y2="32.25" stroke="#888" strokeWidth="1.5" />
    </svg>
  );
}

function AIAutomationIcon() {
  return (
    <svg width="44" height="26" viewBox="0 0 44 26" fill="none" aria-hidden="true">
      <circle cx="6.5"  cy="13"   r="5.5" fill="#888" />
      <circle cx="22"   cy="4.5"  r="5.5" fill="#888" />
      <circle cx="22"   cy="21.5" r="5.5" fill="#888" />
      <circle cx="37.5" cy="13"   r="5.5" fill="#888" />
      <line x1="11.8" y1="10.6" x2="16.7" y2="7.4"  stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="11.8" y1="15.4" x2="16.7" y2="18.6" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="27.3" y1="7.4"  x2="32.2" y2="10.6" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
      <line x1="27.3" y1="18.6" x2="32.2" y2="15.4" stroke="#888" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

function TrustedEcosystemIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden="true">
      <circle cx="18" cy="18" r="15.25" stroke="#888" strokeWidth="1.5" />
      <path
        d="M18 2.75C15 7 12.5 12 12.5 18C12.5 24 15 29 18 33.25
           M18 2.75C21 7 23.5 12 23.5 18C23.5 24 21 29 18 33.25"
        stroke="#888" strokeWidth="1.5"
      />
      <line x1="2.75" y1="18"   x2="33.25" y2="18"   stroke="#888" strokeWidth="1.5" />
      <line x1="5"    y1="11.5" x2="31"    y2="11.5" stroke="#888" strokeWidth="1.5" />
      <line x1="5"    y1="24.5" x2="31"    y2="24.5" stroke="#888" strokeWidth="1.5" />
    </svg>
  );
}

const INVESTORS = [
  { name: "ERPNext Experts",           icon: <ERPNextExpertsIcon />   },
  { name: "AI Automation Specialists", icon: <AIAutomationIcon />     },
  { name: "Trusted ERPNext Ecosystem", icon: <TrustedEcosystemIcon /> },
] as const;

export default function BackedForScale() {
  return (
    <section className="w-full bg-[#ffffff]  border-[#e0e0e0]">
      <div className="max-w-[1400px] mx-auto px-4 md:px-24">
        <div className="grid grid-cols-1 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-[#e0e0e0]">

          <div className="flex flex-col items-start py-10 lg:py-14 pr-8 gap-4">
            <h2 className="font-season-mix font-normal text-[30px] leading-[1.1] text-[#1a1a1a]">
              Backed for scale
            </h2>
            <p className="font-matter text-[13px] leading-[1.6] text-[#666666] max-w-[260px]">
              Trusted by ERPNext businesses, backed by the experts who define the ecosystem.
            </p>
            <button className="font-matter text-[12px] text-[#1a1a1a] rounded-full px-[16px] py-[7px] border border-[#c8c8c8] bg-transparent hover:bg-[#ebebeb] transition-colors duration-150 cursor-pointer">
              Read full story
            </button>
          </div>

          {INVESTORS.map((investor) => (
            <div key={investor.name} className="flex flex-col items-start pl-8 py-10 lg:py-14 gap-3">
              {investor.icon}
              <span className="font-matter text-[13px] text-[#999999]">
                {investor.name}
              </span>
            </div>
          ))}

        </div>
      </div>
    </section>
  );
}
