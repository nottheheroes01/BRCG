import { useEffect, useRef, useState } from 'react';
import { ArrowDown, ArrowDownRight, ArrowRight, ArrowUpRight, BarChart2, Play, Pause, RotateCcw, MoveDown, Sparkles, Send, Copy, Check, X } from 'lucide-react';
import { CONTRACT_ADDRESS, DEXSCREENER_URL, LAUNCH_URL } from '../constants';
import { CoasterScene } from './CoasterScene';
import './ride.css';

const TELEGRAM_URL = 'https://t.me/BRCG_RBH';
const X_URL = 'https://x.com/brcg_rbh?s=11';
const XIcon = () => <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M18.9 2h3.3l-7.2 8.3L23.5 22h-6.7l-5.2-6.9L5.6 22H2.3l7.8-8.9L1.5 2h6.9l4.7 6.2L18.9 2Zm-1.2 18h1.8L7.4 3.9H5.5L17.7 20Z"/></svg>;
// Bitcoin mark for the headline accent, drawn as SVG (not the "₿" glyph) so it
// renders identically everywhere, inherits the orange through currentColor, and
// can never be swapped for an emoji font by mobile browsers.
const BitcoinMark = () => <svg viewBox="0 0 24 24" width=".8em" height=".8em" fill="none" stroke="currentColor" strokeWidth={1.9} strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{display:'block'}}><path d="M6.6 4.4v15.2M6.6 4.4h5.6a3.8 3.8 0 0 1 0 7.6H6.6M6.6 12h7.3a3.8 3.8 0 0 1 0 7.6H6.6M10.6 1.8v2.6M13.6 1.8v2.6M10.6 19.6v2.6M13.6 19.6v2.6"/></svg>;
const SocialLinks = () => <div className="ride-social-links"><a href={TELEGRAM_URL} target="_blank" rel="noreferrer" aria-label="Telegram"><Send size={17}/></a><a href={X_URL} target="_blank" rel="noreferrer" aria-label="X (Twitter)"><XIcon/></a><a href={DEXSCREENER_URL} target="_blank" rel="noreferrer" aria-label="Dexscreener chart" title="$BRCG chart on Dexscreener"><BarChart2 size={18}/></a></div>;
const stops = ['The ride', 'The lore', 'The ups & downs', 'Tokenomics', 'Get on board'];
const stopLabels = ['ALL ABOARD', 'THE FIRST CLIMB', 'HOLD ON TIGHT', 'KNOW YOUR RIDE', 'NEXT STOP: YOU'];
// One lap is 5.4 screens of scroll; the rest of the scroll space is a "seam" that
// already shows the opening of the next lap, so chapter 5 flows straight back into
// chapter 1 and the journey loops forever instead of stopping at the end.
const LAP = 5.4 / 6.4;
export default function RidePage() {
  const progress = useRef(0);
  // How many full laps of the journey we have scrolled through. Keeping a count
  // (instead of wrapping the value) means the ride only ever moves forward, so the
  // coaster keeps circling the whole track instead of running backwards at the seam.
  const laps = useRef(0);
  const [position, setPosition] = useState(0);
  const [auto, setAuto] = useState(() => !window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const [speed, setSpeed] = useState(1);
  const [videoOpen, setVideoOpen] = useState(false);
  const dialog = useRef<HTMLDialogElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [copyStatus, setCopyStatus] = useState('');
  const copyTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const copyContract = async () => {
    try { await navigator.clipboard.writeText(CONTRACT_ADDRESS); setCopyStatus('Copied'); }
    catch { setCopyStatus('Copy unavailable — select the text'); }
    clearTimeout(copyTimer.current); copyTimer.current = setTimeout(() => setCopyStatus(''), 2500);
  };
  useEffect(() => () => clearTimeout(copyTimer.current), []);
  useEffect(() => {
    if (videoOpen) { dialog.current?.showModal(); video.current?.play().catch(() => {}); }
    else { video.current?.pause(); dialog.current?.close(); }
  }, [videoOpen]);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(() => window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  const stage = Math.min(4, Math.floor(position * 4 + .32));
  useEffect(() => {
    // Title, description and Open Graph tags are inherited unchanged from V1 in index.html.
    const media=window.matchMedia('(prefers-reduced-motion: reduce)');
    const onMotion=()=>{setReduced(media.matches);if(media.matches)setAuto(false);};media.addEventListener('change',onMotion);
    const onScroll=()=>{
      const max=document.documentElement.scrollHeight-window.innerHeight;
      if(max<=0){progress.current=0;setPosition(0);return;}
      const lap=max*LAP;let y=Math.max(0,window.scrollY);
      // Bottomed out: hop back exactly one lap. The seam already shows the next lap's
      // opening, so the hop is invisible and the sequence just keeps rolling.
      if(y>=max-1){y-=lap;laps.current+=1;window.scrollTo({top:y,behavior:'instant'});}
      progress.current=y/lap+laps.current;setPosition(progress.current%1);
    };
    window.addEventListener('scroll',onScroll,{passive:true});window.addEventListener('resize',onScroll);onScroll();
    return()=>{window.removeEventListener('scroll',onScroll);window.removeEventListener('resize',onScroll);media.removeEventListener('change',onMotion);};
  }, []);
  useEffect(()=>{
    if(!auto||paused||reduced||videoOpen)return;
    let raf=0, previous=0, warmup=0;
    const tick=(time:number)=>{
      if(previous && !document.hidden){
        const delta=Math.min(time-previous,50);
        warmup+=delta;
        if(warmup>2000){
          const max=document.documentElement.scrollHeight-window.innerHeight;
          const step=delta*speed/24000*max;
          // Nudge the page forward every frame; the scroll handler hops back a lap at
          // the end, so the auto ride loops on forever instead of stopping.
          window.scrollTo({top:Math.min(window.scrollY+step,max),behavior:'instant'});
        }
      }
      previous=time;raf=requestAnimationFrame(tick);
    };raf=requestAnimationFrame(tick);
    const stop=()=>setAuto(false);
    const key=(e:KeyboardEvent)=>{if(['ArrowDown','ArrowUp','PageDown','PageUp','Home','End',' '].includes(e.key))stop();};
    window.addEventListener('wheel',stop,{passive:true});window.addEventListener('touchstart',stop,{passive:true});window.addEventListener('keydown',key);
    return()=>{cancelAnimationFrame(raf);window.removeEventListener('wheel',stop);window.removeEventListener('touchstart',stop);window.removeEventListener('keydown',key);};
  },[auto,paused,reduced,videoOpen,speed]);
  const go=(i:number)=>{setAuto(false);const max=document.documentElement.scrollHeight-window.innerHeight;window.scrollTo({top:max*LAP*i/4,behavior:reduced?'instant':'smooth'});};
  const start=()=>{if(reduced)setReduced(false);if(position>.99)window.scrollTo({top:0,behavior:'instant'});setPaused(false);setAuto(true);};
  return <div className={`ride-page ${reduced?'ride-reduced':''}`}>
    <a className="ride-skip" href="#ride-content">Skip to content</a>
    <div className="ride-viewport">
      <header className="ride-header">
        <a className="ride-brand" href="/" aria-label="$BRCG — home of the ride"><img className="ride-logo ride-logo-image" src="/brcgstocklogo2.jpg" alt="Bitcoin Roller Coaster Guy"/><span>$BRCG<small>BITCOIN ROLLER COASTER GUY</small></span></a>
        {/* Nav links (lore / tokenomics / community) intentionally dropped: the journey
            nav in the dashboard covers them. */}
        <div className="ride-header-tools"><SocialLinks/><a className="ride-header-cta" href={LAUNCH_URL} target="_blank" rel="noreferrer">Buy on launchpad <ArrowUpRight size={16}/></a></div>
      </header>
      <div className="ride-world" aria-hidden="true"><div className="ride-sun"/><span className="ride-world-word">WHEEEE!</span><CoasterScene progress={progress} paused={paused||videoOpen} reduced={reduced}/></div>
      <main id="ride-content" className={`ride-copy ride-copy-stage-${stage}`} tabIndex={-1}>
        <div className="ride-eyebrow"><span/> BITCOIN-PAIRED. COMMUNITY-POWERED.</div>
        <div key={stage} className="ride-chapter">
          <p className="ride-chapter-id">0{stage+1} / {stopLabels[stage]}</p>
          {stage===0&&<>
            <h1>Life’s a ride.<br/>Make it <em>wild.</em><span className="ride-spark" aria-hidden="true"><BitcoinMark/></span></h1>
            <p className="ride-description">One Bitcoin. Infinite ups and downs.<br/>Meet $BRCG — the guy who never stops riding.</p>
            <div className="ride-actions"><button className="ride-primary" onClick={start}>Let’s ride <ArrowRight size={20}/></button><button className="ride-text-button" onClick={()=>go(1)}>Discover the story <ArrowDown size={15}/></button></div>
            <div className="ride-contract"><span>CONTRACT ADDRESS</span><div><code>{CONTRACT_ADDRESS}</code><button onClick={copyContract} aria-label="Copy contract address">{copyStatus==='Copied'?<Check size={14}/>:<Copy size={14}/>} {copyStatus==='Copied'?'Copied':'Copy'}</button></div><small role="status">{copyStatus}</small></div>
          </>}
          {stage===1&&<><h1>One small GIF.<br/>One giant <em>ride.</em></h1><p className="ride-description">In 2013, Marcus Connor drew a Bitcoin on a roller coaster. The internet took it for a ride. Through every peak and every dip, the guy kept smiling.</p><div className="ride-lore-card"><img src="/brcgstocklogo2.jpg" alt="The Bitcoin coaster guy artwork"/><div><span>EST. 2013</span><strong>The chart changes.<br/>The spirit doesn’t.</strong><a href="https://bitcoincoaster.com" target="_blank" rel="noreferrer">Meet the original <ArrowUpRight size={13}/></a><button className="ride-watch" onClick={()=>setVideoOpen(true)}><Play size={13}/> Watch the coaster</button></div></div></>}
          {stage===2&&<><h1>Up. Down.<br/>Still <em>wheeee!</em></h1><p className="ride-description">Bitcoin is the original roller coaster. $BRCG brings that energy to the Robinhood network. A community for everyone who enjoys the ride.</p><div className="ride-manifesto"><div><span><ArrowUpRight size={26} strokeWidth={2.4}/></span><p>GREEN DAY<strong>Hands up.</strong></p></div><div><span><ArrowDownRight size={26} strokeWidth={2.4}/></span><p>RED DAY<strong>Hands still up.</strong></p></div></div><span className="ride-small-note">NO PRICE PREDICTIONS. JUST ROLLER COASTER ENERGY.</span></>}
          {stage===3&&<><h1>Big thrills.<br/><em>Simple numbers.</em></h1><div className="ride-stats"><div><span>TOTAL SUPPLY</span><strong>1<span>B</span></strong></div><div><span>BUY / SELL TAX</span><strong>2<span>%</span></strong></div><div><span>PAIRED ASSET</span><b>Bitcoin<ArrowUpRight size={14} strokeWidth={2.6} style={{display:'inline-block',verticalAlign:'-1px',marginLeft:4}}/></b></div><div><span>NETWORK</span><b>Robinhood</b></div></div><p className="ride-small-note">PROJECT TOKENOMICS · FAIR LAUNCH VIA PONS</p></>}
          {stage===4&&<><h1>Your seat.<br/><em>Your ride.</em></h1><p className="ride-description">The best part of the roller coaster?<br/>The people screaming next to you.</p><div className="ride-actions"><a className="ride-primary" href={TELEGRAM_URL} target="_blank" rel="noreferrer"><Send size={17}/> Join the community</a><a className="ride-x-button" href={X_URL} target="_blank" rel="noreferrer"><XIcon/> Follow on X</a></div><div className="ride-launch"><span>THE NEXT ADVENTURE</span><a href={LAUNCH_URL} target="_blank" rel="noreferrer">Trade on pons <ArrowUpRight size={17}/></a><a href={DEXSCREENER_URL} target="_blank" rel="noreferrer">View chart <BarChart2 size={17}/></a><p>Contract <button className="ride-ca" onClick={copyContract} title="Copy contract address" aria-label="Copy contract address">{CONTRACT_ADDRESS}{copyStatus==='Copied'?<Check size={12}/>:<Copy size={12}/>}</button></p></div><p className="ride-disclaimer">$BRCG is a meme token. No promises of returns. Not financial advice.</p></>}
        </div>
      </main>
      <div className="ride-stamp"><span>₿</span><p>POWERED BY<br/><strong>THE UPS & DOWNS</strong></p><Sparkles size={18}/></div>
      <div className="ride-scene-caption"><span className="ride-caption-dot"/><span>{['THE ADVENTURE STARTS HERE','CLIMBING INTO THE LORE','ENJOY EVERY TWIST','A LITTLE CLARITY AT THE TOP','THERE’S ALWAYS ANOTHER RIDE'][stage]}</span><span style={{display:'block'}}><ArrowUpRight size={17} strokeWidth={2.4}/></span></div>
      <div className="ride-scroll-hint"><MoveDown size={16}/><span>SCROLL TO RIDE</span><span className="ride-hint-line"/></div>
      <footer className="ride-dashboard">
        <div className="ride-journey-title"><span>THE JOURNEY</span><strong>Enjoy every turn.</strong></div>
        <nav className="ride-route" aria-label="Journey stops"><div className="ride-route-line"><div style={{width:`${position*100}%`}}/></div>{stops.map((s,i)=><button key={s} onClick={()=>go(i)} aria-current={stage===i?'step':undefined}><span className="ride-stop-dot">{stage===i?'₿':`0${i+1}`}</span><span>{s}</span></button>)}</nav>
        <div className="ride-controls"><button title={paused?'Resume animation':'Pause animation'} aria-label={paused?'Resume animation':'Pause animation'} aria-pressed={paused} onClick={()=>setPaused(!paused)}>{paused?<Play size={17}/>:<Pause size={17}/>}</button><button title="Restart journey" aria-label="Restart journey" onClick={()=>go(0)}><RotateCcw size={16}/></button><span>{String(Math.round(position*100)).padStart(2,'0')}<small>%</small></span></div>
      </footer>
      <div className="ride-bottom"><span>© {new Date().getFullYear()} $BRCG · BUILT FOR THE RIDE</span><button className="ride-motion" onClick={()=>{setReduced(!reduced);setAuto(false);}}>{reduced?'Motion: reduced':'Motion: full'}</button><button className="ride-ca" onClick={copyContract} title="Copy contract address" aria-label="Copy contract address">{CONTRACT_ADDRESS}{copyStatus==='Copied'?<Check size={12}/>:<Copy size={12}/>}</button></div>
      <div className="ride-playback"><button className="ride-autoplay" aria-label={auto&&!paused?'Stop auto ride':'Start auto ride'} onClick={()=>auto&&!paused?setAuto(false):start()}>{auto&&!paused?<Pause size={12}/>:<Play size={12}/>} {auto&&!paused?'Auto ride · loop on':'Start auto ride'}</button><button className="ride-speed" onClick={()=>setSpeed(speed===1?2:1)} aria-label={`Ride speed ${speed}x. Click to change`}>{speed}×</button></div>
    </div>
    <div className="ride-scroll-space" aria-hidden="true"/>
    <dialog ref={dialog} className="ride-video-dialog" aria-labelledby="ride-video-title" onCancel={()=>setVideoOpen(false)} onClose={()=>setVideoOpen(false)} onClick={e=>{if(e.target===e.currentTarget)setVideoOpen(false);}}><div className="ride-video-panel"><header><h2 id="ride-video-title">The original roller coaster energy.</h2><button autoFocus onClick={()=>setVideoOpen(false)} aria-label="Close video"><X size={22}/></button></header><video ref={video} src="/brcgvid.mp4" controls playsInline preload="none"/><p>Green day or red day. We keep riding.</p></div></dialog>
  </div>;
}
