import { motion } from "motion/react";
import { ArrowUpRight, TrendingUp } from "lucide-react";
import { LAUNCH_URL } from "../constants";
import { BitcoinField } from "./BitcoinField";
import { LongIcon } from "./LongIcon";

export const Footer = () => (
  <footer className="relative overflow-hidden border-t-8 border-[#FA660F] bg-black px-4 py-16 text-center md:px-8">
    <BitcoinField count={3} tone="orange" seed={4} />
    <div className="pointer-events-none absolute inset-0 flex items-center justify-center opacity-10">
      <TrendingUp size={420} className="text-[#FA660F]" />
    </div>

    <div className="relative z-10 mx-auto flex max-w-5xl flex-col items-center gap-8">
      <motion.div
        animate={{ rotate: [-2, 2, -2] }}
        transition={{ repeat: Infinity, duration: 2.4 }}
        className="font-display text-3xl uppercase leading-none text-white drop-shadow-[4px_4px_0_rgba(250,102,15,1)] md:text-5xl lg:text-6xl"
      >
        We ride
        <br />
        BITCOIN (MSTR)
        <br />
        forever
      </motion.div>

      <div className="flex flex-col items-center justify-center gap-3 border-4 border-black bg-white px-6 py-4 font-mono text-sm font-bold uppercase tracking-widest text-black shadow-[8px_8px_0_0_rgba(250,102,15,1)] md:flex-row md:gap-6 md:text-base">
        <span>$BRCG × BITCOIN (MSTR)</span>
        <span aria-hidden className="hidden md:inline">
          🎢
        </span>
        <span>Inevitable</span>
      </div>

      <a
        href={LAUNCH_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group inline-flex items-center gap-3 border-2 border-black bg-[#CCFF00] px-5 py-3 font-display uppercase text-black transition-colors hover:bg-[#DFFF3F]"
      >
        <LongIcon invert className="h-5 w-5" />
        Launched on long.xyz
        <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>

      <p className="max-w-2xl font-mono text-xs uppercase leading-relaxed tracking-widest text-white/40">
        Disclaimer: $BRCG is a meme token built to ride BITCOIN (MSTR) —
        Strategy&apos;s Bitcoin stock — on the Robinhood network, launched fair
        on the long.xyz launchpad. No presale, no promises, no seatbelts.
        Charts go up, charts go down, we keep riding. Not financial advice.
      </p>
    </div>
  </footer>
);
