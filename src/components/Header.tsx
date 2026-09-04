import { motion } from "motion/react";
import { BarChart2, Send } from "lucide-react";

// TODO: ganti placeholder "#" dengan link komunitas asli
const TELEGRAM_URL = "https://t.me/BRCG_RBH";
const X_URL = "https://x.com/brcg_rbh?s=11";
const DEXSCREENER_URL = "#";

const TICKER_ITEMS = [
  "BITCOIN (MSTR) PUMP? BRCG PUMP",
  "$BRCG × BITCOIN (MSTR) — ON ROBINHOOD",
  "BUY ON LONG.XYZ",
  "RED DAY = SALE DAY",
  "WHEEEEEEEEEEE 🎢",
  "STRATEGY-APPROVED",
  "DIAMOND HANDS ONLY",
];

const XLogo = ({ className = "" }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="currentColor" className={className} aria-hidden="true">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231 5.45-6.231Zm-1.161 17.52h1.833L7.084 4.126H5.117l11.966 15.644Z" />
  </svg>
);

const SOCIAL_BTN =
  "flex h-9 w-9 items-center justify-center border-2 border-black shadow-[3px_3px_0_0_rgba(255,255,255,1)] transition-all hover:-translate-y-0.5 hover:shadow-[5px_5px_0_0_rgba(255,255,255,1)] sm:h-10 sm:w-10";

export const Header = () => (
  <header className="fixed left-0 right-0 top-0 z-50 mx-[10px] mt-[10px] border-2 border-[#FA660F] bg-[#0C0C0C] text-white shadow-[6px_6px_0_0_rgba(250,102,15,1)]">
    {/* Orange ticker tape */}
    <div className="overflow-hidden whitespace-nowrap border-b-2 border-black bg-[#FA660F] py-1.5 font-mono text-xs font-bold uppercase tracking-widest text-black">
      <motion.div
        animate={{ x: [0, "-50%"] }}
        transition={{ repeat: Infinity, duration: 24, ease: "linear" }}
        className="flex w-max items-center"
      >
        {[0, 1].map((half) => (
          <div key={half} className="flex items-center">
            {TICKER_ITEMS.map((item, i) => (
              <span key={i} className="flex items-center">
                <span className="px-4">{item}</span>
                <span aria-hidden>★</span>
              </span>
            ))}
          </div>
        ))}
      </motion.div>
    </div>

    <nav className="flex h-16 items-center justify-between gap-3 px-3 sm:px-5">
      <a href="#top" className="flex shrink-0 items-center gap-2 md:gap-3">
        <img
          src="/brcgrbh.png"
          alt="$BRCG logo"
          className="h-9 w-9 rounded-full border-2 border-[#CCFF00] object-cover md:h-11 md:w-11"
        />
        <span className="font-display text-xl uppercase tracking-tight sm:text-2xl">
          $BRCG
        </span>
        <span className="hidden rounded-full border border-[#FA660F] px-2 py-0.5 font-mono text-[10px] uppercase tracking-widest text-[#FA660F] xl:inline-block">
          BITCOIN (MSTR)
        </span>
      </a>

      <div className="mx-2 hidden font-mono text-xs font-bold uppercase tracking-[0.2em] text-white/70 md:flex md:gap-8">
        <a href="#about" className="transition-colors hover:text-[#FA660F]">
          About
        </a>
        <a href="#buy" className="transition-colors hover:text-[#FA660F]">
          How to buy
        </a>
        <a href="#tokenomics" className="transition-colors hover:text-[#FA660F]">
          Tokenomics
        </a>
      </div>

      {/* Socials — icon only */}
      <div className="flex shrink-0 items-center gap-2 sm:gap-3">
        <a
          href={TELEGRAM_URL}
          title="Telegram"
          aria-label="Telegram"
          className={`${SOCIAL_BTN} bg-[#2AABEE] text-black hover:bg-[#4FBCF2]`}
        >
          <Send className="h-4 w-4 sm:h-5 sm:w-5" />
        </a>
        <a
          href={X_URL}
          title="X (Twitter)"
          aria-label="X (Twitter)"
          className={`${SOCIAL_BTN} bg-white text-black`}
        >
          <XLogo className="h-4 w-4 sm:h-5 sm:w-5" />
        </a>
        <a
          href={DEXSCREENER_URL}
          title="Dexscreener"
          aria-label="Dexscreener"
          className={`${SOCIAL_BTN} bg-[#CCFF00] text-black hover:bg-[#DFFF3F]`}
        >
          <BarChart2 className="h-4 w-4 sm:h-5 sm:w-5" />
        </a>
      </div>
    </nav>
  </header>
);
