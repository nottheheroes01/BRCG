import { ArrowUpRight } from "lucide-react";
import { LAUNCH_URL } from "../constants";
import { BitcoinField } from "./BitcoinField";
import { LongIcon } from "./LongIcon";

const STEPS = ["OPEN LONG.XYZ", "CONNECT ROBINHOOD WALLET", "SWAP FOR $BRCG"];

export const LaunchBar = () => (
  <section
    id="buy"
    className="relative z-10 scroll-mt-[120px] border-y-4 border-black bg-[#FA660F] text-black"
  >
    <BitcoinField count={3} tone="dark" seed={5} />
    <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-8 md:px-8 lg:flex-row lg:items-center lg:justify-between lg:gap-10">
      <div>
        <p className="font-mono text-[11px] font-bold uppercase tracking-[0.25em] opacity-70 md:text-xs">
          No contract address · no presale · no bs
        </p>
        <h2 className="mt-2 font-display text-3xl uppercase leading-none tracking-tight md:text-5xl">
          How to buy $BRCG
        </h2>
        <div className="mt-4 flex flex-wrap items-center gap-x-3 gap-y-2 font-mono text-xs font-bold uppercase md:text-sm">
          {STEPS.map((s, i) => (
            <span key={s} className="flex items-center gap-3">
              <span className="border-2 border-black bg-white px-3 py-1.5 shadow-[3px_3px_0_0_rgba(0,0,0,1)]">
                <span className="mr-1.5 text-black/50">{i + 1}.</span>
                {s}
              </span>
              {i < STEPS.length - 1 && (
                <ArrowUpRight className="h-4 w-4 text-black/60" />
              )}
            </span>
          ))}
        </div>
      </div>

      <a
        href={LAUNCH_URL}
        target="_blank"
        rel="noopener noreferrer"
        className="group flex shrink-0 items-center gap-3 self-start border-4 border-black bg-[#CCFF00] px-6 py-4 font-display text-base uppercase tracking-wide text-black shadow-[6px_6px_0_0_rgba(255,255,255,1)] transition-all hover:-translate-x-0.5 hover:-translate-y-0.5 hover:shadow-[10px_10px_0_0_rgba(255,255,255,1)] md:text-lg lg:self-center"
      >
        <LongIcon invert className="h-6 w-6" />
        Open launchpad
        <ArrowUpRight className="h-5 w-5 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
      </a>
    </div>
  </section>
);
