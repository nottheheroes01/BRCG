import { useMemo } from "react";
import { motion } from "motion/react";

// Bitcoin "B" logo (simple-icons path, viewBox 0 0 24 24)
const BITCOIN_PATH =
  "M23.638 14.904c-1.602 6.43-8.113 10.34-14.542 8.736C2.67 22.05-1.244 15.525.362 9.105 1.962 2.67 8.475-1.243 14.9.358c6.43 1.605 10.342 8.115 8.738 14.548v-.002zm-6.35-4.613c.24-1.59-.974-2.45-2.64-3.03l.54-2.153-1.315-.33-.525 2.107c-.345-.087-.705-.167-1.064-.25l.526-2.127-1.32-.33-.54 2.165c-.285-.067-.565-.132-.84-.2l-1.815-.45-.35 1.407s.975.225.955.236c.535.136.63.486.615.766l-1.477 5.92c-.065.165-.24.406-.614.314.015.02-.96-.24-.96-.24l-.66 1.51 1.71.426.93.242-.54 2.19 1.32.327.54-2.17c.36.1.705.19 1.05.273l-.51 2.154 1.32.33.545-2.19c2.24.427 3.93.257 4.64-1.774.57-1.637-.03-2.58-1.217-3.196.854-.193 1.5-.76 1.68-1.93h.01zm-3.01 4.22c-.404 1.64-3.157.75-4.05.53l.72-2.9c.896.23 3.757.67 3.33 2.37zm.41-4.24c-.37 1.49-2.662.735-3.405.55l.654-2.64c.744.18 3.137.524 2.75 2.084v.006z";

export const BitcoinIcon = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d={BITCOIN_PATH} />
  </svg>
);

type Tone = "orange" | "dark" | "white" | "lime";

const TONE_CLASS: Record<Tone, string> = {
  orange: "text-[#FA660F]",
  dark: "text-black",
  white: "text-white",
  lime: "text-[#CCFF00]",
};

// Deterministic PRNG supaya posisi stabil antar render (tidak melompat-lompat)
function mulberry32(a: number) {
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

type Item = {
  top: number;
  left: number;
  size: number;
  delay: number;
  duration: number;
  amp: number;
  rot: number;
  opacity: number;
};

export const BitcoinField = ({
  count = 5,
  tone = "orange",
  seed = 1,
  className = "",
}: {
  count?: number;
  tone?: Tone;
  seed?: number;
  className?: string;
}) => {
  const items = useMemo<Item[]>(() => {
    const rnd = mulberry32(seed * 100003 + 7);
    return Array.from({ length: count }, () => ({
      top: 2 + rnd() * 90,
      left: 1 + rnd() * 92,
      size: 12 + rnd() * 14, // 12–26 px
      delay: rnd() * 4,
      duration: 5 + rnd() * 6, // 5–11 s
      amp: 6 + rnd() * 10,
      rot: rnd() > 0.5 ? 12 : -12,
      opacity: 0.18 + rnd() * 0.2, // tipis, gak ngeganggu teks
    }));
  }, [count, seed]);

  return (
    <div
      aria-hidden
      className={`pointer-events-none absolute inset-0 z-[25] overflow-hidden ${className}`}
    >
      {items.map((it, i) => (
        <motion.span
          key={i}
          className={`absolute ${TONE_CLASS[tone]}`}
          style={{
            top: `${it.top}%`,
            left: `${it.left}%`,
            width: it.size,
            height: it.size,
            opacity: it.opacity,
          }}
          animate={{ y: [0, -it.amp, 0], rotate: [0, it.rot, -it.rot, 0] }}
          transition={{
            repeat: Infinity,
            duration: it.duration,
            delay: it.delay,
            ease: "easeInOut",
          }}
        >
          <BitcoinIcon className="h-full w-full" />
        </motion.span>
      ))}
    </div>
  );
};
