import { motion } from "motion/react";
import {
  ArrowUpRight,
  BadgeDollarSign,
  Flame,
  Link2,
  Rocket,
  Skull,
  TrendingUp,
} from "lucide-react";
import { LAUNCH_URL } from "../constants";
import { BitcoinField } from "./BitcoinField";
import { LongIcon } from "./LongIcon";

const TILES = [
  {
    icon: Flame,
    label: "Total supply",
    value: "420,690,000,000",
    sub: "Enough chaos for everyone.",
    valueClass: "text-2xl md:text-3xl break-words",
    tone: "text-white",
  },
  {
    icon: BadgeDollarSign,
    label: "Tax",
    value: "0%",
    sub: "No buy/sell BS. Ever.",
    valueClass: "text-5xl md:text-6xl",
    tone: "text-[#FA660F]",
  },
  {
    icon: TrendingUp,
    label: "Network",
    value: "Robinhood",
    sub: "BITCOIN (MSTR), BTC & $BRCG — 24/7.",
    valueClass: "text-4xl md:text-5xl",
    tone: "text-white",
  },
  {
    icon: Link2,
    label: "Paired asset",
    value: "BITCOIN (MSTR)",
    sub: "Strategy — the biggest BTC stock.",
    valueClass: "text-2xl md:text-3xl",
    tone: "text-[#CCFF00]",
  },
  {
    icon: Skull,
    label: "Liquidity",
    value: "Burned",
    sub: "Toasted. Gone. Forever.",
    valueClass: "text-4xl md:text-5xl",
    tone: "text-red-500",
  },
  {
    icon: Rocket,
    label: "Launch",
    value: "long.xyz",
    sub: "Fair launch. No presale.",
    valueClass: "text-3xl md:text-4xl",
    tone: "text-white",
    launch: true,
  },
];

export const Tokenomics = () => {
  return (
    <section
      id="tokenomics"
      className="relative scroll-mt-[120px] overflow-hidden bg-black px-4 py-24 text-[#FA660F] md:px-8 md:py-36"
    >
      <BitcoinField count={6} tone="lime" seed={3} />
      {/* Giant BITCOIN (MSTR) watermark */}
      <div className="pointer-events-none absolute inset-0 z-0 flex flex-col items-center justify-center gap-2 leading-none">
        <span className="text-outline-acid select-none font-display text-[4.5rem] uppercase opacity-[0.13] md:text-[13rem]">
          BITCOIN
        </span>
        <span className="text-outline-acid select-none font-display text-[2rem] uppercase tracking-[0.3em] opacity-[0.13] md:text-[5rem]">
          (MSTR)
        </span>
      </div>

      {/* Scrolling background words */}
      <div className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-evenly overflow-hidden py-10 opacity-20 mix-blend-screen">
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 14, ease: "linear" }}
          className="font-display whitespace-nowrap text-[6rem] uppercase leading-none text-red-600 md:text-[11rem]"
        >
          GREEN DAY? PARTY 📈
        </motion.div>
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="font-display whitespace-nowrap text-[6rem] uppercase leading-none text-[#FA660F] md:text-[11rem]"
        >
          RED DAY? LOAD UP 🎢
        </motion.div>
      </div>

      {/* Floating GIFs — z-index di depan konten biar selalu kelihatan */}
      <motion.div
        animate={{ y: [0, -30, 0], rotate: [-5, 5, -5] }}
        transition={{ repeat: Infinity, duration: 4 }}
        className="pointer-events-none absolute top-10 right-4 z-30 w-28 border-4 border-[#FA660F] shadow-[8px_8px_0_0_rgba(255,255,255,1)] md:right-16 md:w-52"
      >
        <img src="/brcg01.gif" alt="Crazy meme 1" className="h-auto w-full" />
      </motion.div>

      <motion.div
        animate={{ x: [0, 40, 0], scale: [1, 1.1, 1], rotate: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 5 }}
        className="pointer-events-none absolute bottom-20 left-4 z-30 w-28 border-4 border-red-500 bg-black shadow-[8px_8px_0_0_rgba(255,255,0,1)] md:left-16 md:w-60"
      >
        <img src="/brcg02.gif" alt="Crazy meme 2" className="h-auto w-full" />
      </motion.div>

      <div className="relative z-20 mx-auto max-w-6xl">
        <div className="mb-14 flex flex-col items-center text-center md:mb-20">
          <p className="font-mono text-xs uppercase tracking-[0.3em] text-[#FA660F]/60">
            Figures a guy on a rollercoaster can understand
          </p>
          <motion.h2
            animate={{ scale: [1, 1.03, 1], rotate: [-1, 1, -1] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="mt-4 border-4 border-white bg-black/60 px-6 py-3 font-display text-5xl uppercase tracking-tight text-white drop-shadow-[6px_6px_0px_rgba(250,102,15,1)] backdrop-blur-sm md:px-10 md:py-5 md:text-8xl"
          >
            Tokenomics
          </motion.h2>
        </div>

        {/* Stat tiles */}
        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {TILES.map((t, i) => (
            <motion.div
              key={t.label}
              whileHover={{ y: -6, rotate: 0 }}
              className={`border-2 border-[#FA660F] bg-[#0E0E0E] p-6 shadow-[10px_10px_0_0_rgba(250,102,15,1)] transition-transform md:p-8 ${
                i % 2 ? "md:rotate-[0.5deg]" : "md:-rotate-[0.5deg]"
              }`}
            >
              <div className="mb-5 flex h-12 w-12 items-center justify-center border-2 border-black bg-[#FA660F] text-black shadow-[3px_3px_0_0_rgba(255,255,255,0.9)]">
                <t.icon className="h-6 w-6" />
              </div>
              <p className="font-mono text-[11px] font-bold uppercase tracking-[0.3em] text-[#FA660F]/70 md:text-xs">
                {t.label}
              </p>
              <p
                className={`mt-2 flex flex-wrap items-center gap-2 font-display uppercase leading-none tracking-tight ${t.valueClass} ${t.tone}`}
              >
                {t.launch && <LongIcon className="h-7 w-7" />}
                {t.value}
              </p>
              <p className="mt-3 font-mono text-[11px] uppercase tracking-wider text-white/40">
                {t.sub}
              </p>
            </motion.div>
          ))}
        </div>

        {/* Launchpad CTA panel (bitcoin orange) */}
        <motion.div
          whileHover={{ rotate: 0 }}
          className="mt-16 flex flex-col items-center justify-between gap-6 border-4 border-black bg-[#FA660F] p-6 text-black shadow-[10px_10px_0_0_rgba(255,255,255,1)] md:mt-20 md:rotate-[0.5deg] md:flex-row md:p-10"
        >
          <div className="flex items-center gap-4">
            <LongIcon invert className="h-12 w-12 shrink-0 md:h-14 md:w-14" />
            <div>
              <h3 className="font-display text-3xl uppercase leading-none tracking-tight md:text-5xl">
                Launched on long.xyz
              </h3>
              <p className="mt-2 font-mono text-[11px] uppercase tracking-[0.2em] opacity-70 md:text-xs">
                Fair launch · no presale · no whitelist · no team bags
              </p>
            </div>
          </div>
          <a
            href={LAUNCH_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="group flex shrink-0 items-center gap-3 border-4 border-black bg-[#CCFF00] px-6 py-4 font-display text-base uppercase tracking-wide text-black transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 md:text-lg"
          >
            <LongIcon invert className="h-6 w-6" />
            Go to launchpad
            <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
          </a>
        </motion.div>
      </div>
    </section>
  );
};
