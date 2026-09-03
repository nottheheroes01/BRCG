import { useState } from "react";
import { motion } from "motion/react";
import { ArrowUpRight, Check, Copy, TrendingDown, TrendingUp } from "lucide-react";
import { LAUNCH_URL } from "../constants";
import { LongIcon } from "./LongIcon";

const FEED = [
  { label: "$BRCG", value: "+∞%", up: true },
  { label: "BITCOIN (MSTR)", value: "+312.4%", up: true },
  { label: "BTC", value: "+69.4%", up: true },
  { label: "BOREDOM", value: "-100%", up: false },
];

const TerminalCard = ({ className = "" }: { className?: string }) => (
  <motion.div
    animate={{ y: [0, -14, 0], rotate: [1, -1, 1] }}
    transition={{ repeat: Infinity, duration: 6, ease: "easeInOut" }}
    className={`relative ${className}`}
  >
    <div className="absolute -top-5 -left-3 z-20 -rotate-6 border-4 border-black bg-[#CCFF00] px-3 py-1.5 font-display text-sm uppercase tracking-wide text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)] md:-left-6">
      Buckle up 🎢
    </div>

    <div className="overflow-hidden border-2 border-[#FA660F] bg-[#101010] shadow-[12px_12px_0_0_rgba(250,102,15,1)]">
      <div className="flex items-center justify-between gap-2 border-b-2 border-[#FA660F] bg-[#FA660F] px-3 py-2 font-mono text-[9px] font-bold uppercase tracking-widest text-black sm:text-[11px]">
        <span className="truncate">$BRCG × BITCOIN (MSTR) · RBH NETWORK</span>
        <span className="flex shrink-0 items-center gap-1.5">
          <span className="h-2 w-2 animate-pulse rounded-full bg-black" />
          LIVE
        </span>
      </div>

      <img
        src="/brcghero.gif"
        alt="Roller coaster guy riding Bitcoin (MSTR)"
        className="block h-auto w-full border-b-2 border-[#FA660F] object-cover"
      />

      <div className="p-1.5">
        {FEED.map((row) => (
          <div
            key={row.label}
            className="flex items-center justify-between border-b border-dashed border-white/10 px-3 py-2 font-mono text-xs font-bold sm:text-sm [&:last-child]:border-0"
          >
            <span className="text-white/60">{row.label}</span>
            <span
              className={
                row.up
                  ? "flex items-center gap-1.5 text-[#CCFF00]"
                  : "flex items-center gap-1.5 text-red-500"
              }
            >
              {row.up ? (
                <TrendingUp className="h-4 w-4" />
              ) : (
                <TrendingDown className="h-4 w-4" />
              )}
              {row.value}
            </span>
          </div>
        ))}
      </div>

      <div className="flex items-center justify-between border-t-2 border-[#FA660F] bg-[#FA660F] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-black sm:text-[11px]">
        <span>Next stop: long.xyz launchpad</span>
        <span aria-hidden>🎢</span>
      </div>
    </div>
  </motion.div>
);

const CONTRACT_PLACEHOLDER = "WILL BE LAUNCHED SOON";

const ContractBox = () => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(CONTRACT_PLACEHOLDER);
    } catch {
      /* clipboard unavailable */
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mt-6 flex max-w-xl flex-col gap-2 sm:flex-row sm:items-center">
      <span className="shrink-0 font-mono text-xs font-bold uppercase tracking-[0.25em] text-[#FA660F]">
        $BRCG contract:
      </span>
      <div className="flex flex-1 items-stretch overflow-hidden border-2 border-dashed border-[#FA660F] bg-[#101010]">
        <span className="flex-1 truncate px-3 py-2 font-mono text-xs font-bold tracking-widest text-[#FA660F] sm:text-sm">
          {CONTRACT_PLACEHOLDER}
        </span>
        <button
          onClick={handleCopy}
          className="flex shrink-0 items-center gap-1.5 border-l-2 border-dashed border-[#FA660F] bg-[#CCFF00] px-3 py-2 font-mono text-[10px] font-bold uppercase tracking-widest text-black transition-colors hover:bg-[#DFFF3F]"
          title="Copy contract address"
        >
          {copied ? <Check size={14} /> : <Copy size={14} />}
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
    </div>
  );
};

export const Hero = () => (
  <section id="top" className="relative overflow-hidden bg-black pt-8 md:pt-12">
    {/* Background layers */}
    <div aria-hidden className="bg-grid absolute inset-0 z-0" />
    <div
      aria-hidden
      className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,rgba(0,0,0,0.85)_80%)]"
    />
    <motion.span
      aria-hidden
      animate={{ y: [0, -16, 0] }}
      transition={{ repeat: Infinity, duration: 7, ease: "easeInOut" }}
      className="text-outline-acid pointer-events-none absolute right-0 top-20 z-0 hidden select-none flex-col items-end gap-2 pr-2 font-display uppercase leading-none md:flex"
    >
      <span className="text-[5.5rem] opacity-40 lg:text-[8rem]">BITCOIN</span>
      <span className="text-[1.6rem] tracking-[0.3em] opacity-40 lg:text-[2.6rem]">
        (MSTR)
      </span>
    </motion.span>

    <div className="relative z-10 mx-auto grid max-w-7xl items-center gap-12 px-4 pb-14 pt-8 md:px-8 md:pb-24 md:pt-12 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
      {/* Left: copy + CTA */}
      <div>
        <div className="mb-6 flex flex-wrap items-center gap-3">
          <motion.span
            animate={{ rotate: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="-rotate-2 border-2 border-black bg-[#FA660F] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-black shadow-[3px_3px_0_0_rgba(255,255,255,1)]"
          >
            Paired with BITCOIN (MSTR)
          </motion.span>
          <span className="border border-[#CCFF00] px-3 py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-[#CCFF00]">
            Live on Robinhood network
          </span>
        </div>

        <h1 className="font-display text-6xl uppercase leading-[0.88] tracking-tighter text-white sm:text-7xl md:text-8xl xl:text-[7rem]">
          Ride the
          <br />
          <span className="text-[#FA660F] drop-shadow-[4px_4px_0_rgba(0,0,0,1)]">
            Bitcoin
          </span>
          <br />
          <span className="block text-[0.26em] leading-[2.4] tracking-[0.4em] text-[#CCFF00]">
            (MSTR)
          </span>
          <br />
          <span className="text-outline-white">Coaster</span>
        </h1>

        {/* GIF card on mobile, directly below the heading */}
        <div className="mt-6 lg:hidden">
          <TerminalCard />
        </div>

        <p className="mt-8 max-w-xl border-l-4 border-[#FA660F] bg-white/5 p-4 text-sm font-medium leading-relaxed text-white/85 backdrop-blur-sm md:text-lg">
          The only meme coin hard-paired to{" "}
          <strong className="text-[#FA660F]">BITCOIN (MSTR)</strong> —
          Strategy&apos;s Bitcoin stock — trading 24/7 on the Robinhood
          network. Green day or red day, we ride it like a rollercoaster…
          because it is one.
        </p>

        <div className="mt-8 flex flex-wrap items-center gap-5">
          <a
            href={LAUNCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex items-center gap-3 border-4 border-white bg-[#CCFF00] px-6 py-4 font-display text-lg uppercase tracking-wide text-black shadow-[6px_6px_0_0_rgba(255,255,255,1)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0_0_rgba(255,255,255,1)] md:text-xl"
          >
            <LongIcon invert className="h-6 w-6" />
            Buy $BRCG on long.xyz
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
          <a
            href="#buy"
            className="font-mono text-sm font-bold uppercase tracking-widest text-[#FA660F] underline decoration-dashed underline-offset-8 transition-colors hover:text-white"
          >
            How to buy ↓
          </a>
        </div>

        <ContractBox />

        <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
          No presale · no whitelist · fair launch via long.xyz
        </p>
      </div>

      {/* Right: BITCOIN (MSTR) "terminal" card (desktop only) */}
      <div className="hidden lg:block">
        <TerminalCard />
      </div>
    </div>
  </section>
);
