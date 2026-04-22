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
        <h1 class="legal-title">Terms</h1>
        <p class="legal-copy">
          Shadow AI is provided as a free beta. Availability, limits, supported
          providers, and feature behavior may change while the product is still
          stabilizing.
        </p>

        <section class="legal-card">
          <h2>Acceptable use</h2>
          <ul>
            <li>
              Do not abuse free quotas, automate attacks, or attempt to bypass
              rate limits.
            </li>
            <li>
              Do not use the product for unlawful, deceptive, or
              rights-violating activity.
            </li>
            <li>
              Generated output remains your responsibility to review before
              production use.
            </li>
          </ul>
        </section>

        <section class="legal-card">
          <h2>Beta expectations</h2>
          <ul>
            <li>
              Providers can rate-limit, refuse, or safety-filter requests
              without notice.
            </li>
            <li>
              Canvas is beta and not a full package-install or arbitrary
              dependency sandbox.
            </li>
            <li>
              Daily free limits may block requests before or after provider-side
              limits are hit.
            </li>
          </ul>
        </section>

        <section class="legal-card">
          <h2>Support</h2>
          <p>
            Support is currently email-based only via{" "}
            <a class="legal-link" href="mailto:support@lavescar.com.tr">
              support@lavescar.com.tr
            </a>
            .
          </p>
        </section>

        <div class="legal-links">
          <a class="legal-link" href="/chat?auth=1">
            Open workspace
          </a>
          <a class="legal-link" href="/help/">
            Help
          </a>
          <a class="legal-link" href="/privacy/">
            Privacy
          </a>
        </div>
      </div>
    </main>
  );
});

export const head: DocumentHead = {
  title: "Terms | Shadow AI",
  meta: [
    {
      name: "description",
      content:
        "Terms summary for the Shadow AI free beta workspace, including acceptable use and beta limitations.",
    },
  ],
};
