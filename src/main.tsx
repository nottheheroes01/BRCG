import {StrictMode, lazy, Suspense} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import './index.css';

const RidePage = lazy(() => import('./v2/RidePage'));
// The 3D ride is the main site now: it owns "/" (and the old "/v2" link still works).
// The original page moved to "/classic".
const path = (window.location.pathname.replace(/\/+$/, '') || '/').toLowerCase();
// /classic serves the original page. /#classic (or /?classic) works too, so the
// classic site stays reachable on hosts that don't rewrite unknown paths to index.html.
const isClassic = path === '/classic' || path === '/classic.html' || /classic/.test(window.location.hash + window.location.search);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Suspense fallback={<div style={{minHeight: "100vh", background: "#f2eee5", display: "grid", placeItems: "center", color: "#252920"}}>Loading the ride…</div>}>{isClassic ? <App /> : <RidePage />}</Suspense>
  </StrictMode>,
);
