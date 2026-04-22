import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

const pageStyles = `
  .legal-shell { min-height: 100dvh; background:#08090d; color:#e7eaf6; padding:48px 20px; }
  .legal-wrap { max-width:780px; margin:0 auto; }
  .legal-kicker { font:600 12px/1.2 var(--font-mono, monospace); letter-spacing:.14em; text-transform:uppercase; color:#7aa2ff; margin:0 0 14px; }
  .legal-title { font-size:clamp(2rem,5vw,3.25rem); line-height:1.05; margin:0 0 12px; }
  .legal-copy { color:#9fa8c7; line-height:1.75; margin:0 0 16px; }
  .legal-card { border:1px solid rgba(255,255,255,.09); background:rgba(255,255,255,.02); border-radius:16px; padding:18px; margin-top:16px; }
  .legal-card h2 { margin:0 0 10px; font-size:1.05rem; }
  .legal-card p, .legal-card li { color:#c6cee7; line-height:1.75; }
  .legal-links { display:flex; flex-wrap:wrap; gap:12px; margin-top:24px; }
  .legal-link { color:#9fd6ff; text-decoration:none; }
`;

export default component$(() => {
  return (
    <main class="legal-shell">
      <style dangerouslySetInnerHTML={pageStyles} />
      <div class="legal-wrap">
        <p class="legal-kicker">Shadow AI</p>
        <h1 class="legal-title">Privacy</h1>
        <p class="legal-copy">
          Shadow AI stores the minimum account and workspace data needed to run
          the product: your social sign-in identity, conversations, artifacts,
          saved bots, and quota counters.
        </p>

        <section class="legal-card">
          <h2>What we store</h2>
          <ul>
            <li>OAuth profile basics such as name, email, and avatar URL.</li>
            <li>
              Conversation content, generated artifacts, canvas workspaces, and
              saved bot personas.
            </li>
            <li>
              Daily usage counters and limited event logs for abuse prevention
              and product health.
            </li>
          </ul>
        </section>

        <section class="legal-card">
          <h2>How to control your data</h2>
          <ul>
            <li>You can delete individual conversations from the sidebar.</li>
            <li>
              You can export your stored account data from the account menu.
            </li>
            <li>
              You can permanently delete your account and user-owned records
              from the account menu.
            </li>
          </ul>
        </section>

        <section class="legal-card">
          <h2>Third-party services</h2>
          <p>
            Shadow AI currently relies on Google and GitHub for sign-in,
            OpenRouter and Workers AI for generation, and Cloudflare
            infrastructure for hosting and abuse protection.
          </p>
        </section>

        <div class="legal-links">
          <a class="legal-link" href="/chat?auth=1">
            Open workspace
          </a>
          <a class="legal-link" href="/help/">
            Help
          </a>
          <a class="legal-link" href="/terms/">
            Terms
          </a>
        </div>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Privacy | Shadow AI",
  meta: [
    {
      name: "description",
      content:
        "Privacy summary for Shadow AI covering stored account data, conversations, and export/delete controls.",
    },
  ],
};
