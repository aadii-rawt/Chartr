import { Link } from "react-router-dom";

export default function TransportHomeCards() {
  const tiles = [
    { title: 'Metro Tickets', subtitle: 'bol kar ticket', img: "/metro.png", link :"/metroPassForm"  },
    { title: 'Daily Pass', subtitle: 'in just a tap', img: "/day.png", link :"/dailyPassForm" },
    { title: 'Route Info', subtitle: 'buses on route', img: "/route.png", link :"/nearby" },
    { title: 'Bookings', subtitle: 'tickets & passes', img: "/booking.png", link :"/booking" },
    { title: 'Month Pass', subtitle: 'unlimited rides', img: "/month.png", link :"/passForm" },
    { title: 'All Services', subtitle: 'explore', img: "/auto.png", link :"/" },
  ];

  return (
    <div className="w-full max-w-[880px] mx-auto">
      <div className="grid grid-cols-2 gap-2 md:gap-4">
        {/* Big left card */}
        <Link to="busQRScanner" className="row-span-2 relative">
          <div className="relative h-full rounded-xl bg-white border border-zinc-200 shadow-sm overflow-hidden">
            <div className="px-3 py-2">
              <h1 className="font-bold text-sm">Bus Tickets</h1>
              <p className="text-xs text-gray-500">easy booking</p>
              <div className="text-[13px] px-2 py-0.5 mt-2 bg-blue-50  inline-block text-blue-700 font-medium rounded-2xl">10% off</div>
            </div>
            <div className="flex justify-end -mt-10">
              <img src="/bus.png" alt="" className="w-1/2 right-0" />
            </div>
          </div>
        </Link>


        {/* Right small cards */}
        {tiles.map((t, i) => (
          <SmallTile key={i} title={t.title} subtitle={t.subtitle} img={t.img} link={t.link} />
        ))}
      </div>
    </div>
  );
}

function SmallTile({ title, subtitle, img,link }) {
  return (
    <Link to={link} className="group flex items-center justify-between gap-3 py-2 rounded-xl bg-white border border-zinc-200 shadow-sm  hover:shadow-md transition-shadow text-left">
      <div className="flex w-full items-center justify-between py-1">
        <div className="pl-3">
          <div className="flex items-center gap-2">
            <p className="font-bold text-sm text-zinc-900 truncate">{title}</p>
          </div>
          <p className="text-xs text-zinc-500 mt-0.5 truncate">{subtitle}</p>
        </div>
        <img src={img} alt="" className="w-10" />
      </div>
    </Link >
  );
}

/* --------- Vector placeholders (swap with PNGs for pixel-perfect) --------- */
function ArrowRight(props) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={props.className}>
      <path d="M5 12h14" /><path d="m13 5 7 7-7 7" />
    </svg>
  );
}

function Bus3D({ className }) {
  return (
    <svg viewBox="0 0 256 128" className={className}>
      <defs>
        <linearGradient id="g" x1="0" x2="1"><stop offset="0%" stopColor="#2A6AF4" /><stop offset="100%" stopColor="#5B8CFF" /></linearGradient>
      </defs>
      <g transform="translate(6,18)">
        <rect x="0" y="16" width="204" height="64" rx="14" fill="url(#g)" />
        <rect x="16" y="28" width="126" height="26" rx="6" fill="#fff" />
        <circle cx="52" cy="92" r="12" fill="#0F172A" />
        <circle cx="158" cy="92" r="12" fill="#0F172A" />
      </g>
    </svg>
  );
}

function MetroImg(props) {
  return (
    <svg viewBox="0 0 48 48" className={props.className}>
      <rect x="10" y="10" width="28" height="20" rx="4" fill="#2A6AF4" />
      <rect x="13" y="14" width="22" height="8" rx="2" fill="#fff" />
    </svg>
  );
}
function DayPassImg(props) {
  return (
    <svg viewBox="0 0 48 48" className={props.className}>
      <rect x="10" y="12" width="28" height="20" rx="4" fill="#2A6AF4" />
      <rect x="14" y="16" width="20" height="4" rx="2" fill="#fff" />
      <rect x="14" y="22" width="12" height="4" rx="2" fill="#fff" />
    </svg>
  );
}
function RouteImg(props) {
  return (
    <svg viewBox="0 0 48 48" className={props.className}>
      <path d="M12 36c6 0 6-8 12-8s6 8 12 8" stroke="#2A6AF4" strokeWidth="3" strokeLinecap="round" fill="none" />
      <circle cx="12" cy="36" r="3" fill="#2A6AF4" />
      <circle cx="24" cy="28" r="3" fill="#2A6AF4" />
      <circle cx="36" cy="36" r="3" fill="#2A6AF4" />
    </svg>
  );
}
function TicketsImg(props) {
  return (
    <svg viewBox="0 0 48 48" className={props.className}>
      <path d="M10 18a4 4 0 014-4h20a4 4 0 014 4v4a4 4 0 010 8v4a4 4 0 01-4 4H14a4 4 0 01-4-4v-4a4 4 0 010-8v-4z" fill="#2A6AF4" />
      <path d="M24 14v20" stroke="#fff" strokeWidth="2" strokeDasharray="3 3" />
    </svg>
  );
}
function MonthPassImg(props) {
  return (
    <svg viewBox="0 0 48 48" className={props.className}>
      <rect x="10" y="12" width="28" height="24" rx="4" fill="#2A6AF4" />
      <path d="M10 20h28" stroke="#fff" strokeWidth="2" />
      <rect x="14" y="24" width="6" height="6" rx="1" fill="#fff" />
      <rect x="22" y="24" width="6" height="6" rx="1" fill="#fff" />
      <rect x="30" y="24" width="6" height="6" rx="1" fill="#fff" />
    </svg>
  );
}
function AutoImg(props) {
  return (
    <svg viewBox="0 0 48 48" className={props.className}>
      <path d="M8 30h32l-3-7a4 4 0 00-3.7-2.5H18.5a4 4 0 00-3.6 2.2L8 30z" fill="#2A6AF4" />
      <circle cx="16" cy="34" r="3" fill="#0F172A" />
      <circle cx="32" cy="34" r="3" fill="#0F172A" />
    </svg>
  );
}
