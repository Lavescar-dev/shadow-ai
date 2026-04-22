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
        <h1 class="legal-title">Help and support</h1>
        <p class="legal-copy">
          Shadow AI is a free beta workspace. Google or GitHub sign-in is
          required for synced conversations, saved bots, canvas persistence, and
          daily quota tracking.
        </p>

        <section class="legal-card">
          <h2>What works today</h2>
          <ul>
            <li>
              Chat, structured modes, resume PDF export, and real image
              generation.
            </li>
            <li>
              Canvas beta with live preview and conversation-scoped workspace
              save.
            </li>
            <li>
              Account export, conversation deletion, and full account deletion.
            </li>
          </ul>
        </section>

        <section class="legal-card">
          <h2>Current beta limits</h2>
          <ul>
            <li>
              Daily chat, structured-mode, image, and resume PDF quotas are
              enforced server-side.
            </li>
            <li>
              Some providers may still rate-limit free traffic before your daily
              quota is exhausted.
            </li>
            <li>
              Canvas remains beta and is intentionally more limited than a full
              npm dev server.
            </li>
          </ul>
        </section>

        <section class="legal-card">
          <h2>Need help?</h2>
          <p>
            Contact{" "}
            <a class="legal-link" href="mailto:support@lavescar.com.tr">
              support@lavescar.com.tr
            </a>
            . Include the mode you used, the time, and if possible the
            conversation title or a screenshot.
          </p>
        </section>

        <div class="legal-links">
          <a class="legal-link" href="/chat?auth=1">
            Open workspace
          </a>
          <a class="legal-link" href="/privacy/">
            Privacy
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
  title: "Help | Shadow AI",
  meta: [
    {
      name: "description",
      content:
        "Help, support expectations, and beta limitations for the Shadow AI workspace.",
    },
  ],
};
