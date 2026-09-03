import { useState } from "react";
import { motion } from "motion/react";
import { Skull, TrendingDown, TrendingUp, Volume2, VolumeX } from "lucide-react";

const PAIR_CHAIN = [
  "STRATEGY BUYS BITCOIN — LIKE, A LOT OF IT",
  "BITCOIN (MSTR) = THE WILDEST BTC TICKER ON ROBINHOOD",
  "$BRCG RIDES EVERY BITCOIN (MSTR) LOOP",
  "RED DAY? LAUGH. GREEN DAY? PARTY. EITHER WAY: WHEEE",
];

export const About = () => {
  const [isMuted, setIsMuted] = useState(true);

  return (
    <section
      id="about"
      className="relative scroll-mt-[120px] overflow-hidden border-b-4 border-black bg-[#FA660F] px-4 py-24 text-black md:px-8 md:py-36"
    >
      {/* Scrolling background words */}
      <div className="pointer-events-none absolute inset-0 z-0 flex flex-col justify-between overflow-hidden py-14 opacity-[0.09]">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
          className="font-display whitespace-nowrap text-[9rem] uppercase leading-none md:text-[16rem]"
        >
          PAIRED · PAIRED · PAIRED ·
        </motion.div>
        <motion.div
          animate={{ x: ["100%", "-100%"] }}
          transition={{ repeat: Infinity, duration: 28, ease: "linear" }}
          className="font-display whitespace-nowrap text-[9rem] uppercase leading-none md:text-[16rem]"
        >
          BITCOIN · BITCOIN · BITCOIN ·
        </motion.div>
      </div>

      {/* Spinning decorations */}
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 40, ease: "linear" }}
        className="pointer-events-none absolute -top-10 -right-10 z-0 text-white opacity-40"
      >
        <TrendingUp size={380} />
      </motion.div>
      <motion.div
        animate={{ rotate: -360 }}
        transition={{ repeat: Infinity, duration: 34, ease: "linear" }}
        className="pointer-events-none absolute -bottom-20 -left-20 z-0 text-black opacity-20"
      >
        <TrendingDown size={280} />
      </motion.div>

      <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-16 lg:grid-cols-2">
        {/* Left column */}
        <div className="space-y-8">
          <motion.div
            animate={{ y: [-6, 6, -6], rotate: [-3, 3, -3] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="inline-block -rotate-3 border-4 border-black bg-black px-4 py-2 font-display text-xl uppercase text-[#FA660F] shadow-[4px_4px_0_0_rgba(0,0,0,1)] md:text-2xl"
          >
            What&apos;s a pair??
          </motion.div>

          <h2 className="font-display text-6xl uppercase leading-[0.9] tracking-tighter text-black drop-shadow-[5px_5px_0_rgba(255,255,255,1)] md:text-8xl">
            Pair
            <br />
            lore
          </h2>

          <motion.div
            whileHover={{ scale: 1.02, rotate: 0 }}
            className="rotate-1 border-4 border-black bg-white p-6 shadow-[10px_10px_0_0_rgba(0,0,0,1)] transition-transform"
          >
            <p className="font-display text-2xl uppercase leading-tight md:text-3xl">
              <span className="text-red-600">
                The first BITCOIN (MSTR)-paired meme coin.
              </span>
            </p>
            <p className="mt-4 border-l-8 border-black pl-4 text-base font-medium leading-relaxed md:text-lg">
              Every crypto bro knows the legend: the guy who laughs while the
              chart bleeds. Now he has a ride.{" "}
              <strong>Strategy</strong> — the company behind{" "}
              <strong>BITCOIN (MSTR)</strong> — owns the biggest Bitcoin bag on
              the planet, and $BRCG is strapped into that exact seat, looping
              every BITCOIN (MSTR) candle on the Robinhood network.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.02, rotate: 0 }}
            className="-rotate-1 border-4 border-white bg-[#0D0D0D] p-6 text-[#FA660F] shadow-[10px_10px_0_0_rgba(255,255,255,1)] transition-transform"
          >
            <p className="mb-4 font-mono text-xs uppercase tracking-[0.25em] text-white/50">
              How the pairing works
            </p>
            <ul className="space-y-3 font-mono text-sm font-bold uppercase leading-snug md:text-base">
              {PAIR_CHAIN.map((line, i) => (
                <li key={line} className="flex gap-3">
                  <span className="text-[#FA660F]">{i + 1}→</span>
                  <span className="text-white">{line}</span>
                </li>
              ))}
            </ul>
          </motion.div>

          <div className="flex flex-wrap gap-3">
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="rotate-2 cursor-pointer border-4 border-black bg-black px-4 py-2 font-display text-lg uppercase text-[#FA660F] shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            >
              #BTCPAIR
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="-rotate-2 cursor-pointer border-4 border-black bg-white px-4 py-2 font-display text-lg uppercase text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            >
              #LONGXYZ
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="rotate-3 cursor-pointer border-4 border-black bg-[#8B5CF6] px-4 py-2 font-display text-lg uppercase text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            >
              #HODL
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="-rotate-3 cursor-pointer border-4 border-black bg-red-600 px-4 py-2 font-display text-lg uppercase text-white shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            >
              #BTFD
            </motion.span>
            <motion.span
              whileHover={{ scale: 1.1 }}
              className="rotate-6 cursor-pointer border-4 border-black bg-[#CCFF00] px-4 py-2 font-display text-lg uppercase text-black shadow-[4px_4px_0_0_rgba(0,0,0,1)]"
            >
              #RBH
            </motion.span>
          </div>
        </div>

        {/* Right column: the man himself */}
        <div className="relative mt-10 w-full lg:mt-0">
          <motion.div
            animate={{ y: [-12, 12, -12] }}
            transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
            className="group relative z-10 -skew-y-2 border-8 border-black bg-white p-4 shadow-[16px_16px_0_0_rgba(0,0,0,1)]"
          >
            <div className="absolute -top-6 -right-4 z-20 rotate-[12deg] cursor-pointer border-4 border-black bg-[#CCFF00] px-3 py-2 font-display text-lg uppercase text-black shadow-[5px_5px_0px_0px_rgba(0,0,0,1)] transition-transform group-hover:rotate-[18deg] group-hover:scale-110 md:-right-6 md:px-4 md:text-xl">
              Bitcoin (MSTR) season 🚨
            </div>

            <div className="relative mx-auto w-full max-w-md">
              <video
                src="/brcgvid.mp4"
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full border-4 border-black"
              />
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="absolute bottom-4 right-4 z-30 border-4 border-black bg-yellow-300 p-2 shadow-[4px_4px_0_0_rgba(0,0,0,1)] transition-all hover:translate-x-0.5 hover:translate-y-0.5 hover:scale-110 hover:shadow-[2px_2px_0_0_rgba(0,0,0,1)]"
              >
                {isMuted ? <VolumeX size={32} /> : <Volume2 size={32} />}
              </button>
            </div>

            <motion.div
              animate={{ rotate: [0, 15, -15, 0] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="absolute -bottom-10 -left-6 z-20 text-[4rem] drop-shadow-[4px_4px_0_rgba(0,0,0,1)] md:-left-10 md:text-[6rem]"
            >
              📈
            </motion.div>
            <motion.div
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ repeat: Infinity, duration: 0.5 }}
              className="absolute -right-4 -bottom-8 z-20 text-[3rem] drop-shadow-[4px_4px_0_rgba(0,0,0,1)] md:-right-8 md:text-[5rem]"
            >
              💎
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
