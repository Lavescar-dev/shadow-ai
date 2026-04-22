import type {
  CanvasArtifactData,
  CanvasTemplate,
  CanvasWorkspaceData,
} from "./types";
import { CANVAS_PREVIEW_SOURCE } from "../../shared/branding";

export interface CanvasPreviewEvent {
  type: "log" | "error";
  level?: string;
  message: string;
}

export const CANVAS_LOCAL_KEY = "nx-canvas-local";
const CANVAS_PREVIEW_IMAGE_PLACEHOLDER =
  "https://images.unsplash.com/photo-1517849845537-4d257902454a?auto=format&fit=crop&w=1600&q=80";

const DEFAULT_REACT_FILES: Record<string, string> = {
  "App.tsx": `export default function App() {
  const features = [
    { n: "01", title: "Real-time signals", body: "Stream every event and get structured insight before the window closes. No polling, no lag." },
    { n: "02", title: "Smart grouping", body: "PRISM clusters related events automatically so you focus on causes — not on symptoms and noise." },
    { n: "03", title: "Team alerts", body: "Route the right signal to the right person with zero manual triage. Slack, email, or webhook." },
  ];

  return (
    <main className="page">
      <header className="topbar">
        <div className="brand">
          <span className="brandMark">◈</span>
          <span className="brandName">PRISM</span>
        </div>
        <nav className="nav">
          <a href="#features">Features</a>
          <a href="#results">Results</a>
          <a href="#pricing">Pricing</a>
        </nav>
        <button className="navCta">Start free trial</button>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <div className="tag">Real-time Analytics</div>
          <h1>Turn noise<br /><em>into signal.</em></h1>
          <p className="sub">PRISM surfaces the patterns your team actually needs — in real time, without the dashboard sprawl.</p>
          <div className="heroActions">
            <button className="btnPrimary">Start for free</button>
            <button className="btnGhost">See a demo →</button>
          </div>
          <div className="trust">
            <span className="trustDot" />
            <span>Trusted by 4,200+ product teams worldwide</span>
          </div>
        </div>
        <div className="terminal">
          <div className="termBar">
            <span className="termDot tdR" />
            <span className="termDot tdY" />
            <span className="termDot tdG" />
            <span className="termTitle">prism — live feed</span>
          </div>
          <div className="termBody">
            <div className="termRow"><span className="ts">09:14:02</span><span className="ev evOk">✓ checkout.complete</span><span className="ms">12ms</span></div>
            <div className="termRow"><span className="ts">09:14:03</span><span className="ev evWarn">⚠ payment.retry</span><span className="ms">340ms</span></div>
            <div className="termRow"><span className="ts">09:14:05</span><span className="ev evOk">✓ user.signup</span><span className="ms">8ms</span></div>
            <div className="termRow"><span className="ts">09:14:07</span><span className="ev evOk">✓ report.generated</span><span className="ms">55ms</span></div>
            <div className="termRow"><span className="ts">09:14:09</span><span className="ev evErr">✕ pipeline.stalled</span><span className="ms">—</span></div>
            <div className="termRow termLive"><span className="ts">09:14:11</span><span className="ev evOk">✓ alert.dispatched</span><span className="ms">2ms</span></div>
          </div>
          <div className="termFooter">
            <span className="liveBadge">● LIVE</span>
            <span className="termStat">94% accuracy · 2.8× faster signals</span>
          </div>
        </div>
      </section>

      <div className="rule" />

      <div className="logoBand">
        {["Figma", "Notion", "Slack", "Linear", "GitHub"].map((n) => (
          <span key={n}>{n}</span>
        ))}
      </div>

      <div className="rule" />

      <section className="features" id="features">
        <div className="featHead">
          <p className="eyebrow">Platform</p>
          <h2>Built for people<br />who act on data.</h2>
        </div>
        <div className="featList">
          {features.map((f) => (
            <div className="featRow" key={f.n}>
              <span className="featNum">{f.n}</span>
              <div className="featContent">
                <h3>{f.title}</h3>
                <p>{f.body}</p>
              </div>
              <span className="featArrow">→</span>
            </div>
          ))}
        </div>
      </section>

      <div className="rule" />

      <section className="stats">
        <div className="statItem"><strong>40<em>%</em></strong><span>faster delivery</span></div>
        <div className="statLine" />
        <div className="statItem"><strong>14<em>×</em></strong><span>fewer dashboards</span></div>
        <div className="statLine" />
        <div className="statItem"><strong>2<em> min</em></strong><span>avg. time-to-insight</span></div>
      </section>

      <div className="rule" />

      <section className="quoteSection" id="results">
        <blockquote className="blockQ">
          <span className="qMark">"</span>
          <p>We deprecated 14 dashboards after the first month. The team actually reads the alerts now.</p>
          <cite>Sarah L. — Head of Data, Meridian</cite>
        </blockquote>
      </section>

      <div className="rule" />

      <section className="ctaBand" id="pricing">
        <h2>Start making sense of your data.</h2>
        <p>14-day trial · No credit card · Full access</p>
        <div className="heroActions">
          <button className="btnPrimary">Get started free</button>
          <button className="btnGhost">Talk to sales</button>
        </div>
      </section>
    </main>
  );
}
`,
  "styles.css": `:root {
  color-scheme: dark;
  --bg: #05070e;
  --s0: rgba(10, 13, 22, 0.92);
  --s1: rgba(15, 19, 32, 0.96);
  --b0: rgba(148, 163, 184, 0.09);
  --b1: rgba(148, 163, 184, 0.16);
  --text: #eef2ff;
  --muted: #7a8aaa;
  --dim: #3a4a62;
  --c1: #6ee7ff;
  --c2: #a78bfa;
  --ok: #4ade80;
  --warn: #fbbf24;
  --err: #f87171;
  --glow: rgba(110, 231, 255, 0.18);
  --t: 140ms ease;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body, #root { min-height: 100%; }
body {
  font-family: Inter, system-ui, sans-serif;
  background:
    radial-gradient(ellipse 90% 55% at 5% -5%, rgba(110, 231, 255, 0.11) 0%, transparent 55%),
    radial-gradient(ellipse 60% 45% at 95% 8%, rgba(167, 139, 250, 0.09) 0%, transparent 55%),
    #05070e;
  color: var(--text);
  line-height: 1.6;
}
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; border: none; }

.page { padding: 0 32px 100px; max-width: 1160px; margin: 0 auto; }

/* RULE — gradient separator line */
.rule {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--b1) 20%, var(--b1) 80%, transparent);
}

/* TOPBAR */
.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 0; border-bottom: 1px solid var(--b0); margin-bottom: 64px;
}
.brand { display: flex; align-items: center; gap: 8px; }
.brandMark { font-size: 18px; color: var(--c1); line-height: 1; }
.brandName { font-weight: 900; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; }
.nav { display: flex; gap: 32px; font-size: 13px; color: var(--muted); }
.nav a { transition: color var(--t); }
.nav a:hover { color: var(--text); }
.navCta {
  height: 34px; padding: 0 14px; background: var(--s1); color: var(--text);
  border: 1px solid var(--b1); border-radius: 4px; font-size: 12px; font-weight: 600;
  transition: all var(--t);
}
.navCta:hover { border-color: var(--c1); color: var(--c1); }

/* HERO */
.hero {
  display: grid;
  grid-template-columns: 1fr minmax(300px, 440px);
  gap: 52px; align-items: center; padding: 52px 0 72px;
}
.tag {
  display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.22em;
  text-transform: uppercase; color: var(--c1);
  border: 1px solid rgba(110, 231, 255, 0.25); padding: 4px 10px;
  border-radius: 2px; margin-bottom: 20px;
}
.heroCopy h1 {
  font-size: clamp(48px, 7.5vw, 86px); font-weight: 900;
  letter-spacing: -0.055em; line-height: 0.9; margin-bottom: 20px;
}
.heroCopy h1 em {
  font-style: normal;
  background: linear-gradient(135deg, var(--c1), var(--c2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.sub {
  font-size: 16px; line-height: 1.75; color: var(--muted);
  max-width: 46ch; margin-bottom: 32px;
}
.heroActions { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
.btnPrimary {
  height: 44px; padding: 0 22px; border-radius: 4px;
  background: linear-gradient(135deg, var(--c1), var(--c2));
  color: #040710; font-weight: 800; font-size: 13px; transition: all var(--t);
}
.btnPrimary:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 6px 20px var(--glow); }
.btnGhost {
  height: 44px; padding: 0 22px; border-radius: 4px;
  border: 1px solid var(--b1); background: transparent;
  color: var(--muted); font-size: 13px; transition: all var(--t);
}
.btnGhost:hover { border-color: var(--c1); color: var(--c1); }
.trust { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--dim); }
.trustDot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--ok); box-shadow: 0 0 6px var(--ok); flex-shrink: 0;
}

/* TERMINAL */
.terminal {
  background: var(--s0); border: 1px solid var(--b1); border-radius: 8px;
  overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.03);
}
.termBar {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 14px; background: var(--s1); border-bottom: 1px solid var(--b0);
}
.termDot { width: 10px; height: 10px; border-radius: 50%; }
.tdR { background: #ff5f57; }
.tdY { background: #ffbd2e; }
.tdG { background: #28c840; }
.termTitle {
  margin: 0 auto; font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 10px; color: var(--dim);
}
.termBody { padding: 10px 0; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 11px; }
.termRow {
  display: flex; align-items: center; gap: 10px; padding: 5px 14px;
  transition: background var(--t);
}
.termRow:hover { background: rgba(255,255,255,0.025); }
.ts { color: var(--dim); min-width: 60px; }
.ev { flex: 1; }
.evOk { color: var(--ok); }
.evWarn { color: var(--warn); }
.evErr { color: var(--err); }
.ms { color: var(--dim); text-align: right; min-width: 44px; }
.termLive { background: rgba(110, 231, 255, 0.05); }
.termLive .ev { color: var(--c1); }
.termFooter {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-top: 1px solid var(--b0); background: var(--s1);
}
.liveBadge {
  font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
  color: var(--ok); font-family: 'SF Mono', 'Fira Code', monospace;
  animation: blink 1.4s ease-in-out infinite;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.termStat { font-size: 10px; color: var(--dim); font-family: 'SF Mono', 'Fira Code', monospace; }

/* LOGO BAND */
.logoBand {
  display: flex; justify-content: space-between; align-items: center; padding: 20px 0;
}
.logoBand span {
  font-weight: 800; font-size: 10px; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--dim); transition: color var(--t);
}
.logoBand span:hover { color: var(--muted); }

/* FEATURES — numbered list, no cards */
.features { padding: 64px 0; }
.featHead { margin-bottom: 36px; }
.eyebrow {
  font-size: 10px; font-weight: 700; letter-spacing: 0.24em;
  text-transform: uppercase; color: var(--c1); margin-bottom: 12px;
}
.featHead h2 {
  font-size: clamp(30px, 4vw, 50px); font-weight: 900;
  letter-spacing: -0.045em; line-height: 1.0;
}
.featList { display: flex; flex-direction: column; }
.featRow {
  display: flex; align-items: center; gap: 24px;
  padding: 22px 0; border-bottom: 1px solid var(--b0); cursor: default;
  transition: padding-left var(--t);
}
.featRow:first-of-type { border-top: 1px solid var(--b0); }
.featRow:hover { padding-left: 10px; }
.featRow:hover .featNum { color: var(--c1); }
.featRow:hover .featArrow { color: var(--c1); transform: translateX(4px); }
.featNum {
  font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: var(--dim);
  min-width: 24px; transition: color var(--t); font-family: 'SF Mono', 'Fira Code', monospace;
}
.featContent { flex: 1; }
.featContent h3 { font-size: 16px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 3px; }
.featContent p { font-size: 13px; color: var(--muted); line-height: 1.6; }
.featArrow { font-size: 14px; color: var(--dim); transition: all var(--t); }

/* STATS — bare gradient numbers, no card containers */
.stats {
  display: flex; align-items: center; padding: 64px 0;
}
.statItem { flex: 1; text-align: center; padding: 0 24px; }
.statItem strong {
  display: block; font-size: clamp(56px, 8vw, 88px); font-weight: 900;
  letter-spacing: -0.06em; line-height: 1;
  background: linear-gradient(135deg, var(--c1), var(--c2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: 6px;
}
.statItem strong em { font-style: normal; font-size: 0.45em; vertical-align: super; }
.statItem span {
  font-size: 11px; color: var(--muted); letter-spacing: 0.06em;
  text-transform: uppercase; font-weight: 600;
}
.statLine { width: 1px; height: 64px; background: var(--b1); flex-shrink: 0; }

/* BLOCKQUOTE — editorial, no card wrapper */
.quoteSection { padding: 64px 0; max-width: 820px; }
.blockQ { position: relative; padding-left: 28px; border-left: 2px solid var(--c1); }
.qMark {
  position: absolute; top: -12px; left: -6px;
  font-size: 72px; line-height: 0.75; color: var(--c1);
  font-family: Georgia, 'Times New Roman', serif; opacity: 0.2; pointer-events: none;
}
.blockQ p {
  font-size: clamp(19px, 2.4vw, 26px); font-weight: 600;
  letter-spacing: -0.02em; line-height: 1.45; margin-bottom: 14px;
}
.blockQ cite { font-size: 11px; color: var(--dim); font-style: normal; letter-spacing: 0.06em; }

/* CTA BAND */
.ctaBand { padding: 72px 0; text-align: center; border-top: 1px solid var(--b0); }
.ctaBand h2 {
  font-size: clamp(30px, 5vw, 54px); font-weight: 900;
  letter-spacing: -0.05em; margin-bottom: 10px;
}
.ctaBand p { font-size: 14px; color: var(--muted); margin-bottom: 32px; letter-spacing: 0.02em; }

/* RESPONSIVE */
@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; gap: 36px; padding: 36px 0 52px; }
  .stats { flex-direction: column; gap: 32px; }
  .statLine { width: 60%; height: 1px; }
  .logoBand { flex-wrap: wrap; gap: 16px; justify-content: center; }
  .page { padding: 0 20px 80px; }
}
`,
  "index.html": `<div id="root"></div>`,
};

const DEFAULT_HTML_FILES: Record<string, string> = {
  "index.html": `<main class="page">
  <header class="topbar">
    <div class="brand">
      <span class="brandMark">◈</span>
      <span class="brandName">PRISM</span>
    </div>
    <nav class="nav">
      <a href="#features">Features</a>
      <a href="#results">Results</a>
      <a href="#pricing">Pricing</a>
    </nav>
    <button class="navCta">Start free trial</button>
  </header>

  <section class="hero">
    <div class="heroCopy">
      <div class="tag">Real-time Analytics</div>
      <h1>Turn noise<br><em>into signal.</em></h1>
      <p class="sub">PRISM surfaces the patterns your team actually needs — in real time, without the dashboard sprawl.</p>
      <div class="heroActions">
        <button class="btnPrimary">Start for free</button>
        <button class="btnGhost">See a demo →</button>
      </div>
      <div class="trust">
        <span class="trustDot"></span>
        <span>Trusted by 4,200+ product teams worldwide</span>
      </div>
    </div>
    <div class="terminal">
      <div class="termBar">
        <span class="termDot tdR"></span>
        <span class="termDot tdY"></span>
        <span class="termDot tdG"></span>
        <span class="termTitle">prism — live feed</span>
      </div>
      <div class="termBody">
        <div class="termRow"><span class="ts">09:14:02</span><span class="ev evOk">✓ checkout.complete</span><span class="ms">12ms</span></div>
        <div class="termRow"><span class="ts">09:14:03</span><span class="ev evWarn">⚠ payment.retry</span><span class="ms">340ms</span></div>
        <div class="termRow"><span class="ts">09:14:05</span><span class="ev evOk">✓ user.signup</span><span class="ms">8ms</span></div>
        <div class="termRow"><span class="ts">09:14:07</span><span class="ev evOk">✓ report.generated</span><span class="ms">55ms</span></div>
        <div class="termRow"><span class="ts">09:14:09</span><span class="ev evErr">✕ pipeline.stalled</span><span class="ms">—</span></div>
        <div class="termRow termLive"><span class="ts">09:14:11</span><span class="ev evOk">✓ alert.dispatched</span><span class="ms">2ms</span></div>
      </div>
      <div class="termFooter">
        <span class="liveBadge">● LIVE</span>
        <span class="termStat">94% accuracy · 2.8× faster signals</span>
      </div>
    </div>
  </section>

  <div class="rule"></div>

  <div class="logoBand">
    <span>Figma</span>
    <span>Notion</span>
    <span>Slack</span>
    <span>Linear</span>
    <span>GitHub</span>
  </div>

  <div class="rule"></div>

  <section class="features" id="features">
    <div class="featHead">
      <p class="eyebrow">Platform</p>
      <h2>Built for people<br>who act on data.</h2>
    </div>
    <div class="featList">
      <div class="featRow">
        <span class="featNum">01</span>
        <div class="featContent">
          <h3>Real-time signals</h3>
          <p>Stream every event and get structured insight before the window closes. No polling, no lag.</p>
        </div>
        <span class="featArrow">→</span>
      </div>
      <div class="featRow">
        <span class="featNum">02</span>
        <div class="featContent">
          <h3>Smart grouping</h3>
          <p>PRISM clusters related events automatically so you focus on causes — not on symptoms and noise.</p>
        </div>
        <span class="featArrow">→</span>
      </div>
      <div class="featRow">
        <span class="featNum">03</span>
        <div class="featContent">
          <h3>Team alerts</h3>
          <p>Route the right signal to the right person with zero manual triage. Slack, email, or webhook.</p>
        </div>
        <span class="featArrow">→</span>
      </div>
    </div>
  </section>

  <div class="rule"></div>

  <section class="stats">
    <div class="statItem"><strong>40<em>%</em></strong><span>faster delivery</span></div>
    <div class="statLine"></div>
    <div class="statItem"><strong>14<em>×</em></strong><span>fewer dashboards</span></div>
    <div class="statLine"></div>
    <div class="statItem"><strong>2<em> min</em></strong><span>avg. time-to-insight</span></div>
  </section>

  <div class="rule"></div>

  <section class="quoteSection" id="results">
    <blockquote class="blockQ">
      <span class="qMark">"</span>
      <p>We deprecated 14 dashboards after the first month. The team actually reads the alerts now.</p>
      <cite>Sarah L. — Head of Data, Meridian</cite>
    </blockquote>
  </section>

  <div class="rule"></div>

  <section class="ctaBand" id="pricing">
    <h2>Start making sense of your data.</h2>
    <p>14-day trial · No credit card · Full access</p>
    <div class="heroActions">
      <button class="btnPrimary">Get started free</button>
      <button class="btnGhost">Talk to sales</button>
    </div>
  </section>
</main>
`,
  "styles.css": `:root {
  color-scheme: dark;
  --bg: #05070e;
  --s0: rgba(10, 13, 22, 0.92);
  --s1: rgba(15, 19, 32, 0.96);
  --b0: rgba(148, 163, 184, 0.09);
  --b1: rgba(148, 163, 184, 0.16);
  --text: #eef2ff;
  --muted: #7a8aaa;
  --dim: #3a4a62;
  --c1: #6ee7ff;
  --c2: #a78bfa;
  --ok: #4ade80;
  --warn: #fbbf24;
  --err: #f87171;
  --glow: rgba(110, 231, 255, 0.18);
  --t: 140ms ease;
}
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
html, body { min-height: 100%; }
body {
  font-family: Inter, system-ui, sans-serif;
  background:
    radial-gradient(ellipse 90% 55% at 5% -5%, rgba(110, 231, 255, 0.11) 0%, transparent 55%),
    radial-gradient(ellipse 60% 45% at 95% 8%, rgba(167, 139, 250, 0.09) 0%, transparent 55%),
    #05070e;
  color: var(--text);
  line-height: 1.6;
}
a { color: inherit; text-decoration: none; }
button { font: inherit; cursor: pointer; border: none; }

.page { padding: 0 32px 100px; max-width: 1160px; margin: 0 auto; }

.rule {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--b1) 20%, var(--b1) 80%, transparent);
}

.topbar {
  display: flex; align-items: center; justify-content: space-between;
  padding: 22px 0; border-bottom: 1px solid var(--b0); margin-bottom: 64px;
}
.brand { display: flex; align-items: center; gap: 8px; }
.brandMark { font-size: 18px; color: var(--c1); line-height: 1; }
.brandName { font-weight: 900; font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; }
.nav { display: flex; gap: 32px; font-size: 13px; color: var(--muted); }
.nav a { transition: color var(--t); }
.nav a:hover { color: var(--text); }
.navCta {
  height: 34px; padding: 0 14px; background: var(--s1); color: var(--text);
  border: 1px solid var(--b1); border-radius: 4px; font-size: 12px; font-weight: 600;
  transition: all var(--t);
}
.navCta:hover { border-color: var(--c1); color: var(--c1); }

.hero {
  display: grid;
  grid-template-columns: 1fr minmax(300px, 440px);
  gap: 52px; align-items: center; padding: 52px 0 72px;
}
.tag {
  display: inline-block; font-size: 10px; font-weight: 700; letter-spacing: 0.22em;
  text-transform: uppercase; color: var(--c1);
  border: 1px solid rgba(110, 231, 255, 0.25); padding: 4px 10px;
  border-radius: 2px; margin-bottom: 20px;
}
.heroCopy h1 {
  font-size: clamp(48px, 7.5vw, 86px); font-weight: 900;
  letter-spacing: -0.055em; line-height: 0.9; margin-bottom: 20px;
}
.heroCopy h1 em {
  font-style: normal;
  background: linear-gradient(135deg, var(--c1), var(--c2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
}
.sub {
  font-size: 16px; line-height: 1.75; color: var(--muted);
  max-width: 46ch; margin-bottom: 32px;
}
.heroActions { display: flex; flex-wrap: wrap; gap: 10px; margin-bottom: 28px; }
.btnPrimary {
  height: 44px; padding: 0 22px; border-radius: 4px;
  background: linear-gradient(135deg, var(--c1), var(--c2));
  color: #040710; font-weight: 800; font-size: 13px; transition: all var(--t);
}
.btnPrimary:hover { opacity: 0.88; transform: translateY(-1px); box-shadow: 0 6px 20px var(--glow); }
.btnGhost {
  height: 44px; padding: 0 22px; border-radius: 4px;
  border: 1px solid var(--b1); background: transparent;
  color: var(--muted); font-size: 13px; transition: all var(--t);
}
.btnGhost:hover { border-color: var(--c1); color: var(--c1); }
.trust { display: flex; align-items: center; gap: 8px; font-size: 12px; color: var(--dim); }
.trustDot {
  width: 6px; height: 6px; border-radius: 50%;
  background: var(--ok); box-shadow: 0 0 6px var(--ok); flex-shrink: 0;
}

.terminal {
  background: var(--s0); border: 1px solid var(--b1); border-radius: 8px;
  overflow: hidden; box-shadow: 0 32px 80px rgba(0,0,0,0.55), inset 0 1px 0 rgba(255,255,255,0.03);
}
.termBar {
  display: flex; align-items: center; gap: 6px;
  padding: 10px 14px; background: var(--s1); border-bottom: 1px solid var(--b0);
}
.termDot { width: 10px; height: 10px; border-radius: 50%; }
.tdR { background: #ff5f57; }
.tdY { background: #ffbd2e; }
.tdG { background: #28c840; }
.termTitle {
  margin: 0 auto; font-family: 'SF Mono', 'Fira Code', monospace;
  font-size: 10px; color: var(--dim);
}
.termBody { padding: 10px 0; font-family: 'SF Mono', 'Fira Code', monospace; font-size: 11px; }
.termRow {
  display: flex; align-items: center; gap: 10px; padding: 5px 14px;
  transition: background var(--t);
}
.termRow:hover { background: rgba(255,255,255,0.025); }
.ts { color: var(--dim); min-width: 60px; }
.ev { flex: 1; }
.evOk { color: var(--ok); }
.evWarn { color: var(--warn); }
.evErr { color: var(--err); }
.ms { color: var(--dim); text-align: right; min-width: 44px; }
.termLive { background: rgba(110, 231, 255, 0.05); }
.termLive .ev { color: var(--c1); }
.termFooter {
  display: flex; align-items: center; gap: 12px;
  padding: 10px 14px; border-top: 1px solid var(--b0); background: var(--s1);
}
.liveBadge {
  font-size: 9px; font-weight: 700; letter-spacing: 0.1em;
  color: var(--ok); font-family: 'SF Mono', 'Fira Code', monospace;
  animation: blink 1.4s ease-in-out infinite;
}
@keyframes blink { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }
.termStat { font-size: 10px; color: var(--dim); font-family: 'SF Mono', 'Fira Code', monospace; }

.logoBand {
  display: flex; justify-content: space-between; align-items: center; padding: 20px 0;
}
.logoBand span {
  font-weight: 800; font-size: 10px; letter-spacing: 0.2em;
  text-transform: uppercase; color: var(--dim); transition: color var(--t);
}
.logoBand span:hover { color: var(--muted); }

.features { padding: 64px 0; }
.featHead { margin-bottom: 36px; }
.eyebrow {
  font-size: 10px; font-weight: 700; letter-spacing: 0.24em;
  text-transform: uppercase; color: var(--c1); margin-bottom: 12px;
}
.featHead h2 {
  font-size: clamp(30px, 4vw, 50px); font-weight: 900;
  letter-spacing: -0.045em; line-height: 1.0;
}
.featList { display: flex; flex-direction: column; }
.featRow {
  display: flex; align-items: center; gap: 24px;
  padding: 22px 0; border-bottom: 1px solid var(--b0); cursor: default;
  transition: padding-left var(--t);
}
.featRow:first-child { border-top: 1px solid var(--b0); }
.featRow:hover { padding-left: 10px; }
.featRow:hover .featNum { color: var(--c1); }
.featRow:hover .featArrow { color: var(--c1); transform: translateX(4px); }
.featNum {
  font-size: 10px; font-weight: 800; letter-spacing: 0.14em; color: var(--dim);
  min-width: 24px; transition: color var(--t); font-family: 'SF Mono', 'Fira Code', monospace;
}
.featContent { flex: 1; }
.featContent h3 { font-size: 16px; font-weight: 700; letter-spacing: -0.02em; margin-bottom: 3px; }
.featContent p { font-size: 13px; color: var(--muted); line-height: 1.6; }
.featArrow { font-size: 14px; color: var(--dim); transition: all var(--t); }

.stats { display: flex; align-items: center; padding: 64px 0; }
.statItem { flex: 1; text-align: center; padding: 0 24px; }
.statItem strong {
  display: block; font-size: clamp(56px, 8vw, 88px); font-weight: 900;
  letter-spacing: -0.06em; line-height: 1;
  background: linear-gradient(135deg, var(--c1), var(--c2));
  -webkit-background-clip: text; -webkit-text-fill-color: transparent; background-clip: text;
  margin-bottom: 6px;
}
.statItem strong em { font-style: normal; font-size: 0.45em; vertical-align: super; }
.statItem span {
  font-size: 11px; color: var(--muted); letter-spacing: 0.06em;
  text-transform: uppercase; font-weight: 600;
}
.statLine { width: 1px; height: 64px; background: var(--b1); flex-shrink: 0; }

.quoteSection { padding: 64px 0; max-width: 820px; }
.blockQ { position: relative; padding-left: 28px; border-left: 2px solid var(--c1); }
.qMark {
  position: absolute; top: -12px; left: -6px;
  font-size: 72px; line-height: 0.75; color: var(--c1);
  font-family: Georgia, 'Times New Roman', serif; opacity: 0.2; pointer-events: none;
}
.blockQ p {
  font-size: clamp(19px, 2.4vw, 26px); font-weight: 600;
  letter-spacing: -0.02em; line-height: 1.45; margin-bottom: 14px;
}
.blockQ cite { font-size: 11px; color: var(--dim); font-style: normal; letter-spacing: 0.06em; }

.ctaBand { padding: 72px 0; text-align: center; border-top: 1px solid var(--b0); }
.ctaBand h2 {
  font-size: clamp(30px, 5vw, 54px); font-weight: 900;
  letter-spacing: -0.05em; margin-bottom: 10px;
}
.ctaBand p { font-size: 14px; color: var(--muted); margin-bottom: 32px; letter-spacing: 0.02em; }

@media (max-width: 860px) {
  .hero { grid-template-columns: 1fr; gap: 36px; padding: 36px 0 52px; }
  .stats { flex-direction: column; gap: 32px; }
  .statLine { width: 60%; height: 1px; }
  .logoBand { flex-wrap: wrap; gap: 16px; justify-content: center; }
  .page { padding: 0 20px 80px; }
}
`,
  "script.js": `// Stagger terminal rows into view
var rows = document.querySelectorAll('.termRow');
rows.forEach(function(row, i) {
  row.style.opacity = '0';
  row.style.transform = 'translateX(-6px)';
  row.style.transition = 'opacity 280ms ease ' + (60 + i * 90) + 'ms, transform 280ms ease ' + (60 + i * 90) + 'ms';
  requestAnimationFrame(function() {
    requestAnimationFrame(function() {
      row.style.opacity = '1';
      row.style.transform = '';
    });
  });
});
`,
};

const ALLOWED_FILES: Record<CanvasTemplate, string[]> = {
  react: ["App.tsx", "styles.css", "index.html"],
  html: ["index.html", "styles.css", "script.js"],
};

export function createDefaultCanvasWorkspace(
  template: CanvasTemplate = "react",
): CanvasWorkspaceData {
  return {
    template,
    files:
      template === "html"
        ? { ...DEFAULT_HTML_FILES }
        : { ...DEFAULT_REACT_FILES },
    activeFile: template === "html" ? "index.html" : "App.tsx",
    updatedAt: Date.now(),
  };
}

export function normalizeCanvasWorkspace(
  value: unknown,
  fallbackTemplate: CanvasTemplate = "react",
): CanvasWorkspaceData {
  const fallback = createDefaultCanvasWorkspace(fallbackTemplate);
  if (!isRecord(value)) {
    return fallback;
  }

  const template = value.template === "html" ? "html" : "react";
  const defaultFiles =
    template === "html" ? DEFAULT_HTML_FILES : DEFAULT_REACT_FILES;
  const files: Record<string, string> = {};
  const sourceFiles = isRecord(value.files) ? value.files : {};

  for (const path of ALLOWED_FILES[template]) {
    const next = sourceFiles[path];
    files[path] =
      typeof next === "string" ? next : defaultFiles[path] ?? "";
  }

  const activeFile =
    typeof value.activeFile === "string" &&
    ALLOWED_FILES[template].includes(value.activeFile)
      ? value.activeFile
      : ALLOWED_FILES[template][0];

  return {
    template,
    files,
    activeFile,
    updatedAt:
      typeof value.updatedAt === "number" ? value.updatedAt : Date.now(),
  };
}

export function upgradeLegacyCanvasWorkspace(workspace: CanvasWorkspaceData): {
  workspace: CanvasWorkspaceData;
  upgraded: boolean;
} {
  const source = Object.values(workspace.files).join("\n");
  const legacyStarter =
    source.includes("Build full-page concepts, not just isolated cards.") &&
    source.includes("Canvas Mode");
  const legacyGenericFallback =
    (source.includes("SHADOW STUDIO") || source.includes("SIGNAL STUDIO")) &&
    (source.includes("Tam sayfa landing page") ||
      source.includes("Full-page landing page") ||
      source.includes("Dijital urun landing page") ||
      source.includes("Digital product landing page"));

  if (!legacyStarter && !legacyGenericFallback) {
    return { workspace, upgraded: false };
  }

  return {
    workspace: createDefaultCanvasWorkspace(workspace.template),
    upgraded: true,
  };
}

export function workspaceFiles(template: CanvasTemplate) {
  return [...ALLOWED_FILES[template]];
}

export function canvasFileLanguage(path: string) {
  if (path.endsWith(".tsx")) {
    return "tsx";
  }
  if (path.endsWith(".css")) {
    return "css";
  }
  if (path.endsWith(".html")) {
    return "html";
  }
  return "javascript";
}

export function applyCanvasArtifactToWorkspace(
  workspace: CanvasWorkspaceData,
  artifact: CanvasArtifactData,
): CanvasWorkspaceData {
  const next = normalizeCanvasWorkspace(
    {
      template: artifact.template || workspace.template,
      files: { ...workspace.files },
      activeFile: workspace.activeFile,
      updatedAt: Date.now(),
    },
    artifact.template || workspace.template,
  );

  for (const change of artifact.changes) {
    if (!workspaceFiles(next.template).includes(change.path)) {
      continue;
    }

    if (change.operation === "delete") {
      next.files[change.path] = "";
      continue;
    }

    if (typeof change.content === "string") {
      next.files[change.path] = change.content;
    }
  }

  const preferredFile = artifact.changedFiles.find((path) =>
    workspaceFiles(next.template).includes(path),
  );
  next.activeFile = preferredFile ?? next.activeFile;
  next.updatedAt = Date.now();
  return next;
}

export function diffWorkspaceLines(
  prev: CanvasWorkspaceData,
  next: CanvasWorkspaceData,
): Record<string, number[]> {
  const result: Record<string, number[]> = {};
  for (const path of Object.keys(next.files)) {
    const a = (prev.files[path] ?? "").split("\n");
    const b = (next.files[path] ?? "").split("\n");
    const changed: number[] = [];
    const len = Math.max(a.length, b.length);
    for (let i = 0; i < len; i++) {
      if (a[i] !== b[i]) changed.push(i);
    }
    if (changed.length) result[path] = changed;
  }
  return result;
}

export function buildCanvasPreviewDocument(workspace: CanvasWorkspaceData) {
  return workspace.template === "html"
    ? buildHtmlPreviewDocument(workspace)
    : buildReactPreviewDocument(workspace);
}

export function localCanvasStorageKey(conversationId?: string | null) {
  return `${CANVAS_LOCAL_KEY}:${conversationId || "local"}`;
}

export function seedCanvasWorkspaceFromMessage(
  content: string,
): CanvasWorkspaceData | null {
  const blocks = extractCodeBlocks(content);
  const reactBlock = blocks.find((block) =>
    ["tsx", "jsx", "react"].includes(block.language),
  );
  const htmlBlock = blocks.find((block) =>
    ["html", "htm", "xml"].includes(block.language),
  );
  const cssBlock = blocks.find((block) =>
    ["css", "scss", "sass"].includes(block.language),
  );
  const scriptBlock = blocks.find((block) =>
    ["js", "javascript", "ts", "typescript"].includes(block.language),
  );

  if (
    reactBlock ||
    (!htmlBlock &&
      blocks.some((block) => looksLikeReactComponent(block.code)) &&
      blocks.length)
  ) {
    const workspace = createDefaultCanvasWorkspace("react");
    workspace.files["App.tsx"] =
      reactBlock?.code ??
      blocks.find((block) => looksLikeReactComponent(block.code))?.code ??
      workspace.files["App.tsx"];
    if (cssBlock) {
      workspace.files["styles.css"] = cssBlock.code;
    }
    return workspace;
  }

  const htmlCandidate =
    htmlBlock?.code ?? extractHtmlCandidateFromText(content) ?? null;
  if (htmlCandidate || cssBlock || scriptBlock) {
    const workspace = createDefaultCanvasWorkspace("html");
    if (htmlCandidate) {
      const extracted = splitHtmlDocument(htmlCandidate);
      workspace.files["index.html"] = extracted.html || workspace.files["index.html"];
      if (extracted.css) {
        workspace.files["styles.css"] = extracted.css;
      }
      if (extracted.js) {
        workspace.files["script.js"] = extracted.js;
      }
    }
    if (cssBlock) {
      workspace.files["styles.css"] = cssBlock.code;
    }
    if (scriptBlock) {
      workspace.files["script.js"] = scriptBlock.code;
    }
    return workspace;
  }

  return null;
}

function buildReactPreviewDocument(workspace: CanvasWorkspaceData) {
  const bodyMarkup = workspace.files["index.html"] || `<div id="root"></div>`;
  const styles = sanitizeForStyle(workspace.files["styles.css"] || "");
  const appSource = prepareReactSource(workspace.files["App.tsx"] || "");

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${styles}</style>
  </head>
  <body>
    ${bodyMarkup}
    <script>${previewBridgeScript()}</script>
    <script crossorigin src="https://unpkg.com/react@18/umd/react.development.js"></script>
    <script crossorigin src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>
    <script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>
    <script type="text/babel" data-presets="typescript,react">
      ${sanitizeForInlineScript(appSource)}

      if (typeof App === "undefined") {
        throw new Error("Canvas React preview expects an App component.");
      }

      const mountNode = document.getElementById("root");
      if (!mountNode) {
        throw new Error("Missing #root element in index.html.");
      }

      const root = ReactDOM.createRoot(mountNode);
      root.render(React.createElement(App));
    </script>
  </body>
</html>`;
}

function buildHtmlPreviewDocument(workspace: CanvasWorkspaceData) {
  const styles = workspace.files["styles.css"] || "";
  const script = workspace.files["script.js"] || "";
  const source = workspace.files["index.html"] || "";
  const fullDocument = /<html[\s>]/i.test(source) || /<!doctype/i.test(source);

  if (fullDocument) {
    return injectIntoHtmlDocument(source, styles, script);
  }

  return `<!doctype html>
<html>
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <style>${sanitizeForStyle(styles)}</style>
  </head>
  <body>
    ${source}
    <script>${previewBridgeScript()}</script>
    <script>${sanitizeForInlineScript(script)}</script>
  </body>
</html>`;
}

function injectIntoHtmlDocument(
  source: string,
  styles: string,
  script: string,
) {
  const styleTag = `<style>${sanitizeForStyle(styles)}</style>`;
  const bridgeTag = `<script>${previewBridgeScript()}</script>`;
  const scriptTag = `<script>${sanitizeForInlineScript(script)}</script>`;

  if (/<\/head>/i.test(source)) {
    source = source.replace(/<\/head>/i, `${styleTag}</head>`);
  } else {
    source = source.replace(/<html[^>]*>/i, (match) => `${match}<head>${styleTag}</head>`);
  }

  if (/<\/body>/i.test(source)) {
    return source.replace(/<\/body>/i, `${bridgeTag}${scriptTag}</body>`);
  }

  return `${source}${bridgeTag}${scriptTag}`;
}

function prepareReactSource(source: string) {
  let next = source.trim();
  if (!next) {
    next = DEFAULT_REACT_FILES["App.tsx"];
  }

  const removedImports = new Set<string>();

  next = next
    .replace(/import\s+React\s*,\s*\{([^}]+)\}\s+from\s+["']react["'];?\s*/g, "const {$1} = React;\n")
    .replace(/import\s+\{([^}]+)\}\s+from\s+["']react["'];?\s*/g, "const {$1} = React;\n")
    .replace(/import\s+React\s+from\s+["']react["'];?\s*/g, "")
    .replace(/import\s+\{?\s*createRoot\s*\}?\s+from\s+["']react-dom\/client["'];?\s*/g, "")
    .replace(
      /^\s*import\s+([^;]+?)\s+from\s+["']([^"']+)["'];?\s*$/gm,
      (_full, clause: string, importSource: string) => {
        removedImports.add(importSource);
        return createCanvasImportStub(clause, importSource);
      },
    )
    .replace(/^\s*import\s+["']([^"']+)["'];?\s*$/gm, (_full, importSource: string) => {
      removedImports.add(importSource);
      return "";
    })
    .replace(/export\s+default\s+function\s+[A-Za-z_$][\w$]*/g, "function App")
    .replace(/export\s+function\s+App/g, "function App")
    .replace(/export\s+default\s+class\s+[A-Za-z_$][\w$]*/g, "class App")
    .replace(/export\s+default\s+([A-Za-z_$][\w$]*)\s*;?/g, "const App = $1;")
    .replace(/export\s+default\s+/g, "const App = ")
    .replace(/^\s*export\s+(const|let|var|class)\s+/gm, "$1 ")
    .replace(/^\s*export\s+\{[^}]+\};?\s*$/gm, "");

  if (
    !/function\s+App\b/.test(next) &&
    !/const\s+App\s*=/.test(next) &&
    !/class\s+App\b/.test(next)
  ) {
    const candidateComponent =
      next.match(/function\s+([A-Z][A-Za-z0-9_$]*)\b/)?.[1] ||
      next.match(/const\s+([A-Z][A-Za-z0-9_$]*)\s*=\s*(?:\([^)]*\)\s*=>|function)/)?.[1] ||
      next.match(/class\s+([A-Z][A-Za-z0-9_$]*)\b/)?.[1];

    next = candidateComponent
      ? `${next}\n\nconst App = ${candidateComponent};\n`
      : `function App() {\n  return (\n    ${next}\n  );\n}\n`;
  }

  if (removedImports.size > 0) {
    next = `console.warn("Canvas preview normalized unsupported imports: ${Array.from(removedImports).join(", ")}");\n${next}`;
  }

  return next;
}

function createCanvasImportStub(clause: string, importSource: string) {
  const trimmedClause = clause.trim();
  const statements: string[] = [];
  const isAssetImport = /\.(png|jpe?g|gif|webp|svg|avif)$/i.test(importSource);

  const defaultMatch = trimmedClause.match(/^([A-Za-z_$][\w$]*)/);
  if (defaultMatch && !trimmedClause.startsWith("{") && !trimmedClause.startsWith("*")) {
    const defaultName = defaultMatch[1];
    statements.push(
      `const ${defaultName} = ${
        isAssetImport ? JSON.stringify(CANVAS_PREVIEW_IMAGE_PLACEHOLDER) : "() => null"
      };`,
    );
  }

  const namedMatch = trimmedClause.match(/\{([^}]+)\}/);
  if (namedMatch) {
    for (const entry of namedMatch[1].split(",")) {
      const cleaned = entry.trim();
      if (!cleaned) {
        continue;
      }
      const aliasMatch = cleaned.match(
        /^([A-Za-z_$][\w$]*)(?:\s+as\s+([A-Za-z_$][\w$]*))?$/,
      );
      const localName = aliasMatch?.[2] || aliasMatch?.[1];
      if (!localName) {
        continue;
      }
      statements.push(`const ${localName} = () => null;`);
    }
  }

  const namespaceMatch = trimmedClause.match(/\*\s+as\s+([A-Za-z_$][\w$]*)/);
  if (namespaceMatch) {
    statements.push(`const ${namespaceMatch[1]} = {};`);
  }

  return statements.length
    ? `${statements.join("\n")}\n`
    : `/* canvas preview removed unsupported import from "${importSource}" */\n`;
}

function previewBridgeScript() {
  return sanitizeForInlineScript(`
    (function () {
      const source = ${JSON.stringify(CANVAS_PREVIEW_SOURCE)};
      const send = function (payload) {
        try {
          parent.postMessage({ source, ...payload }, "*");
        } catch (error) {
          console.warn(error);
        }
      };

      const originalLog = console.log.bind(console);
      const originalWarn = console.warn.bind(console);
      const originalError = console.error.bind(console);

      console.log = function (...args) {
        send({ type: "log", level: "log", message: args.map(String).join(" ") });
        originalLog(...args);
      };

      console.warn = function (...args) {
        send({ type: "log", level: "warn", message: args.map(String).join(" ") });
        originalWarn(...args);
      };

      console.error = function (...args) {
        send({ type: "error", level: "error", message: args.map(String).join(" ") });
        originalError(...args);
      };

      window.addEventListener("error", function (event) {
        send({ type: "error", level: "error", message: event.message || "Unknown preview error" });
      });

      window.addEventListener("unhandledrejection", function (event) {
        const message = event.reason && event.reason.message ? event.reason.message : String(event.reason || "Unhandled rejection");
        send({ type: "error", level: "error", message });
      });
    })();
  `);
}

function sanitizeForInlineScript(value: string) {
  return value
    .replace(/<\/script/gi, "<\\/script")
    .replace(/\u2028/g, "\\u2028")
    .replace(/\u2029/g, "\\u2029");
}

function sanitizeForStyle(value: string) {
  return value.replace(/<\/style/gi, "<\\/style");
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function extractCodeBlocks(content: string) {
  const blocks: Array<{ language: string; code: string }> = [];
  const pattern = /```([a-zA-Z0-9_-]+)?\n([\s\S]*?)```/g;
  let match: RegExpExecArray | null;

  while ((match = pattern.exec(content))) {
    blocks.push({
      language: (match[1] || "").trim().toLowerCase(),
      code: match[2].trim(),
    });
  }

  return blocks;
}

function looksLikeReactComponent(code: string) {
  return (
    /function\s+App\b/.test(code) ||
    /export\s+default\s+function\b/.test(code) ||
    /className=/.test(code) ||
    /return\s*\(\s*</.test(code)
  );
}

function extractHtmlCandidateFromText(content: string) {
  if (!/<(main|section|div|canvas|button|script|style|body|html)\b/i.test(content)) {
    return null;
  }

  const lines = content.split("\n");
  const selected: string[] = [];
  let inScript = false;
  let inStyle = false;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      if (inScript || inStyle || selected.length) {
        selected.push("");
      }
      continue;
    }

    if (/^<style\b/i.test(trimmed)) {
      inStyle = true;
      selected.push(trimmed);
      if (/<\/style>/i.test(trimmed)) {
        inStyle = false;
      }
      continue;
    }

    if (/^<script\b/i.test(trimmed)) {
      inScript = true;
      selected.push(trimmed);
      if (/<\/script>/i.test(trimmed)) {
        inScript = false;
      }
      continue;
    }

    if (inStyle) {
      selected.push(line);
      if (/<\/style>/i.test(trimmed)) {
        inStyle = false;
      }
      continue;
    }

    if (inScript) {
      selected.push(line);
      if (/<\/script>/i.test(trimmed)) {
        inScript = false;
      }
      continue;
    }

    if (
      /^<\/?(main|section|div|canvas|button|p|h1|h2|h3|span|ul|li|body|html)\b/i.test(
        trimmed,
      ) ||
      /^<(meta|link)\b/i.test(trimmed)
    ) {
      selected.push(line);
    }
  }

  return selected.length ? selected.join("\n").trim() : null;
}

function splitHtmlDocument(content: string) {
  const cssMatches = Array.from(content.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi));
  const jsMatches = Array.from(content.matchAll(/<script(?:\s[^>]*)?>([\s\S]*?)<\/script>/gi));
  const css = cssMatches.map((match) => match[1].trim()).filter(Boolean).join("\n\n");
  const js = jsMatches.map((match) => match[1].trim()).filter(Boolean).join("\n\n");

  let html = content
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<script(?:\s[^>]*)?>[\s\S]*?<\/script>/gi, "")
    .trim();

  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) {
    html = bodyMatch[1].trim();
  }

  return { html, css, js };
}
