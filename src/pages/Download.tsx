import React, { useEffect, useState } from "react";
import { AiFillStar, AiOutlineCloud, AiOutlineInfoCircle, AiOutlineMinusCircle, AiOutlineRight, AiOutlineShareAlt } from "react-icons/ai";
import { GoQuestion } from "react-icons/go";
import { IoSearch } from "react-icons/io5";

type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed"; platform: string }>;
};

export default function App() {
  return <DownloadPage />;
}

const screenshots = [
  "https://play-lh.googleusercontent.com/wfApoRjPxKhhKuBLMNKyGqXMCde59XvXoFkGqL9-9cVhJg2A7hPZw0RuMpBjygrTxA=w1052-h592-rw",
  "https://play-lh.googleusercontent.com/w7t7oDpZ7j8si9kVFXAJ1m-c8dIzk39nwwoEfSDhyTM1VB9sNrnmCV1SjXcRaOnjFwmf=w1052-h592-rw",
  "https://play-lh.googleusercontent.com/dH3r-h7Y92TzWCFdrThJjpnpFAuU8BjuiBDB_QPerMfVJB9Mu1Pjoq-qoVKIjdHe2A=w1052-h592-rw",
  "https://play-lh.googleusercontent.com/CyFt8L70EPL2eVCGPVElXrwNBSasoPJg3PutiY9dMd_w2knLEbyQeouk_NFsH1SpIqk=w1052-h592-rw",
  "https://play-lh.googleusercontent.com/NNFACRz1Rmo0gjKmup8l7jJaWuBnauANWGNQMJ1Cee534N5hruBbg79gFtgT8IH1dY8=w1052-h592-rw",
];

const DownloadPage: React.FC = () => {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null);
  const [installed, setInstalled] = useState(false);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    const onBIP = (e: Event) => {
      e.preventDefault();
      setDeferred(e as BeforeInstallPromptEvent);
    };
    const onInstalled = () => {
      setInstalled(true);
      setDeferred(null);
    };
    window.addEventListener("beforeinstallprompt", onBIP);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("beforeinstallprompt", onBIP);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  const handleInstall = async () => {
    if (!deferred || busy) return;
    try {
      setBusy(true);
      await deferred.prompt();
      const choice = await deferred.userChoice;
      if (choice.outcome === "accepted") {
        setDeferred(null);
      }
    } finally {
      setBusy(false);
    }
  };

  const canInstall = !!deferred && !installed;

  return (
    <main className="min-h-screen bg-white max-w-md mx-auto">
      <header className="p-3 flex justify-between items-center">
        <div className="flex justify-between items-center gap-3">
          <img src="https://freelogopng.com/images/all_img/1664285914google-play-logo-png.png" alt="" className="w-8" />
          <span className="text-xl text-gray-600 font-medium">Google Play</span>
        </div>
        <div className="flex gap-4 text-2xl">
          <IoSearch />
          <GoQuestion />
        </div>
      </header>

      <section className="max-w-md mx-auto px-4 py-5">
        <div className="flex items-center gap-4">
          <img
            src="/chartr-logo.png"
            alt="App icon"
            className="w-20 h-20 rounded-2xl ring-1 ring-black/10 object-contain bg-gray-50"
          />
          <div className="flex-1">
            <h1 className="text-2xl font-semibold leading-snug">Chartr</h1>
            <button className="text-emerald-700 font-medium mt-1 hover:underline">Chartr Mobility</button>
          </div>
        </div>

        <div className="max-w-md mx-auto mt-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-center gap-1 text-[15px] font-semibold text-gray-900">
                <span>4.2</span>
                <AiFillStar className="w-4 h-4" aria-hidden />
              </div>
              <div className="text-[13px] text-gray-500">35.2K reviews</div>
            </div>
            <div className="mx-3 h-8 w-px bg-gray-200" />
            <div className="flex-1 flex flex-col items-center">
              <div className="text-[15px] font-semibold text-gray-900">10L+</div>
              <div className="text-[13px] text-gray-500">Downloads</div>
            </div>
            <div className="mx-3 h-8 w-px bg-gray-200" />
            <div className="flex-1 flex flex-col items-center">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center justify-center border border-black text-[13px] font-semibold rounded-[4px] h-6 min-w-[24px] px-1">3+</span>
                <AiOutlineInfoCircle className="w-4 h-4 text-gray-600" aria-hidden />
              </div>
              <div className="text-[13px] text-gray-500">Rated for 3+</div>
            </div>
          </div>
        </div>

        <button
          onClick={handleInstall}
          disabled={!canInstall}
          className={`mt-5 w-full cursor-pointer rounded-lg h-12 font-semibold transition ${
            canInstall ? "bg-emerald-700 text-white hover:bg-emerald-800 active:bg-emerald-900" : "bg-gray-200 text-gray-500 cursor-not-allowed"
          }`}
        >
          {installed ? "Installed" : busy ? "Opening…" : canInstall ? "Install" : "Install (not available)"}
        </button>

        <div className="mt-4 flex items-center gap-3">
          <Share className="w-6 h-6" />
          <button className="text-emerald-700 font-medium hover:underline">Share</button>
        </div>

        <div className="mt-5 flex items-start gap-3 text-gray-700">
          <Devices className="w-6 h-6" />
          <p>This app is available for all of your devices</p>
        </div>
      </section>

      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory scroll-smooth pb-2 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
        {screenshots.map((src, i) => (
          <img
            key={i}
            src={src}
            alt={`Screenshot ${i + 1}`}
            loading="lazy"
            className="w-[140px] aspect-[9/16] object-cover rounded-2xl border border-gray-200 shadow-sm snap-start select-none"
          />
        ))}
      </div>

      <div className="max-w-md mx-auto px-4 py-6 space-y-6 text-gray-900">
        <section>
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">What&apos;s new</h2>
          </div>
          <div className="mt-2 text-[15px] leading-6 text-gray-700">
            <p>Introducing new Home Page for easy usage.</p>
            <p>Added shared ride data - 1st app to show shared public transport data. (E-ricks, Gramin sewa, Shared Auto)</p>
            <p>Added metro station information.</p>
          </div>
        </section>

        <section className="pt-2">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold">Data safety</h2>
          </div>
          <p className="mt-3 text-[15px] leading-6 text-gray-700">
            Safety starts with understanding how developers collect and share your data. Data privacy and security
            practices may vary based on your use, region and age. The developer provided this information and may
            update it over time.
          </p>

          <div className="mt-4 rounded-xl border border-gray-200 bg-white">
            <div className="p-4 space-y-4">
              <div className="flex items-start gap-3">
                <AiOutlineShareAlt className="w-5 h-5 mt-0.5 text-gray-600" aria-hidden />
                <div className="flex-1">
                  <div className="text-[15px] text-gray-900">No data shared with third parties</div>
                  <button className="text-[13px] text-emerald-700 hover:underline">
                    Learn more <span className="text-gray-500">about how developers declare sharing</span>
                  </button>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AiOutlineCloud className="w-5 h-5 mt-0.5 text-gray-600" aria-hidden />
                <div className="flex-1">
                  <div className="text-[15px] text-gray-900">This app may collect these data types</div>
                  <div className="text-[13px] text-gray-500">Personal info</div>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <AiOutlineMinusCircle className="w-5 h-5 mt-0.5 text-gray-600" aria-hidden />
                <div className="text-[15px] text-gray-900">Data isn’t encrypted</div>
              </div>

              <div className="flex items-start gap-3">
                <AiOutlineMinusCircle className="w-5 h-5 mt-0.5 text-gray-600" aria-hidden />
                <div className="text-[15px] text-gray-900">Data can’t be deleted</div>
              </div>
            </div>

            <button className="w-full text-left px-4 py-3 rounded-b-xl text-emerald-700 font-medium hover:bg-emerald-50">
              See details
            </button>
          </div>
        </section>
      </div>
    </main>
  );
};

const Star: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" fill="currentColor" />
  </svg>
);

const Share: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M15 8a3 3 0 102.83 2H20l-4-4-4 4h2.17A3 3 0 0015 8zM5 11v7a2 2 0 002 2h10a2 2 0 002-2v-3h-2v3H7v-7H5z" fill="currentColor" />
  </svg>
);

const Devices: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
    <path d="M4 6h12a2 2 0 012 2v6H2V8a2 2 0 012-2zm-2 10h20v2H2v-2zm16-8H4v6h12V8zm2 0h2a2 2 0 012 2v6h-4V8z" fill="currentColor" />
  </svg>
);

const GooglePlayMark: React.FC<{ className?: string }> = ({ className }) => (
  <svg viewBox="0 0 512 512" className={className} aria-hidden="true">
    <defs>
      <linearGradient id="g1" x1="0" x2="1"><stop offset="0" stopColor="#3bccff" /><stop offset="1" stopColor="#0aa9ff" /></linearGradient>
      <linearGradient id="g2" x1="0" x2="1"><stop offset="0" stopColor="#22c55e" /><stop offset="1" stopColor="#16a34a" /></linearGradient>
      <linearGradient id="g3" x1="0" x2="1"><stop offset="0" stopColor="#f59e0b" /><stop offset="1" stopColor="#ef4444" /></linearGradient>
    </defs>
    <path d="M48 64l240 192L48 448z" fill="url(#g1)" />
    <path d="M288 256L384 352 80 464z" fill="url(#g2)" />
    <path d="M288 256L384 160 80 48z" fill="url(#g3)" />
  </svg>
);
