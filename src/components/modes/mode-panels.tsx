import { component$, useSignal } from "@builder.io/qwik";

import { modeDescription, modeLabel, t, type Language } from "~/lib/i18n";
import type { ShellMode } from "~/lib/types";
import { MODES } from "~/lib/types";
import { Select } from "~/components/ui/select";

interface ModeHeaderProps {
  mode: ShellMode;
  language: Language;
}

interface ControlsProps {
  language: Language;
}

function translatedOptions(values: string[], language: Language) {
  return values.map((value) => ({ value, label: t(value, language) }));
}

export const ModeHeader = component$<ModeHeaderProps>(({ mode, language }) => {
  const config = MODES.find((item) => item.id === mode)!;

  return (
    <div
      class="px-5 pt-4 animate-[fadeUp_.4s_both]"
      style={{ "--mode-color": config.color } as Record<string, string>}
    >
      <div class="mode-badge inline-flex items-center gap-2 px-2.5 py-1 rounded-[3px] mb-1">
        <span
          class="flex items-center opacity-80"
          dangerouslySetInnerHTML={config.icon}
        />
        <span
          class="text-[.72rem] font-semibold tracking-tight"
          style={{ color: config.color }}
        >
          {modeLabel(mode, config.label, language)}
        </span>
        <span
          class="font-mono text-[.6rem] opacity-50"
          style={{ color: config.color }}
        >
          {config.command}
        </span>
      </div>
      <p class="text-[.75rem] text-[var(--text-dim)] ml-0.5">
        {modeDescription(mode, config.description, language)}
      </p>

      <style
        dangerouslySetInnerHTML={`
        .mode-badge {
          background: color-mix(in srgb, var(--mode-color) 10%, transparent);
          border: 1px solid color-mix(in srgb, var(--mode-color) 18%, transparent);
        }
      `}
      />
    </div>
  );
});

export const CodeToolbar = component$<ControlsProps>(({ language }) => {
  const activeLang = useSignal("TypeScript");
  const activeAction = useSignal<string | null>(null);

  const langs = ["JavaScript", "TypeScript", "Python", "Rust", "Go", "SQL"];
  const actions = ["Explain", "Refactor", "Test", "Document"];

  return (
    <div class="flex items-center gap-1.5 px-5 py-2.5 border-b border-[var(--border-dim)] animate-[fadeIn_.3s_both]">
      <div class="flex items-center gap-1 flex-wrap">
        {langs.map((lang) => (
          <button
            key={lang}
            class={`lang-btn h-7 px-2.5 rounded-[3px] text-[.72rem] font-mono cursor-pointer transition-all duration-[150ms] border ${activeLang.value === lang ? "active" : ""}`}
            onClick$={() => {
              activeLang.value = lang;
            }}
            type="button"
          >
            {lang}
          </button>
        ))}
      </div>

      <div class="w-px h-5 bg-[var(--border-mid)] mx-1 flex-shrink-0" />

      <div class="flex items-center gap-1">
        {actions.map((act) => (
          <button
            key={act}
            class={`action-btn h-7 px-2.5 rounded-[3px] text-[.72rem] font-medium cursor-pointer transition-all duration-[150ms] border ${activeAction.value === act ? "action-active" : ""}`}
            onClick$={() => {
              activeAction.value = activeAction.value === act ? null : act;
            }}
            type="button"
          >
            {t(act, language)}
          </button>
        ))}
      </div>

      <style
        dangerouslySetInnerHTML={`
        .lang-btn {
          background: transparent;
          border-color: var(--border-dim);
          color: var(--text-dim);
        }
        .lang-btn:hover {
          background: var(--bg-hover);
          border-color: var(--border-mid);
          color: var(--text-muted);
        }
        .lang-btn.active {
          background: color-mix(in srgb, #34d399 10%, var(--bg-elevated));
          border-color: color-mix(in srgb, #34d399 30%, transparent);
          color: #34d399;
        }

        .action-btn {
          background: color-mix(in srgb, var(--accent-pri) 6%, transparent);
          border-color: color-mix(in srgb, var(--accent-pri) 15%, transparent);
          color: var(--text-muted);
        }
        .action-btn:hover {
          background: color-mix(in srgb, var(--accent-pri) 12%, transparent);
          border-color: color-mix(in srgb, var(--accent-pri) 30%, transparent);
          color: var(--text-bright);
        }
        .action-btn.action-active {
          background: color-mix(in srgb, var(--accent-pri) 18%, transparent);
          border-color: color-mix(in srgb, var(--accent-pri) 45%, transparent);
          color: var(--accent-pri);
        }
      `}
      />
    </div>
  );
});

export const EmailControls = component$<ControlsProps>(({ language }) => {
  const tone = useSignal("Professional");
  const length = useSignal("Standard");
  const type = useSignal("Cold outreach");

  return (
    <div class="flex items-center gap-2 px-5 py-2.5 border-b border-[var(--border-dim)] animate-[fadeIn_.3s_both]">
      <Select
        label={t("Tone", language)}
        value={tone.value}
        options={translatedOptions(
          ["Professional", "Friendly", "Formal", "Casual"],
          language,
        )}
        onChange$={(v) => {
          tone.value = v;
        }}
      />
      <Select
        label={t("Length", language)}
        value={length.value}
        options={translatedOptions(["Brief", "Standard", "Detailed"], language)}
        onChange$={(v) => {
          length.value = v;
        }}
      />
      <Select
        label={t("Type", language)}
        value={type.value}
        options={translatedOptions(
          ["Cold outreach", "Follow-up", "Reply", "Newsletter", "Announcement"],
          language,
        )}
        onChange$={(v) => {
          type.value = v;
        }}
      />
    </div>
  );
});

export const SEOControls = component$<ControlsProps>(({ language }) => {
  const auditType = useSignal("Full audit");

  return (
    <div class="flex items-center gap-2 px-5 py-2.5 border-b border-[var(--border-dim)] animate-[fadeIn_.3s_both] flex-wrap">
      <Select
        label={t("Audit", language)}
        value={auditType.value}
        options={translatedOptions(
          ["Full audit", "On-page", "Technical", "Backlinks", "Content gap"],
          language,
        )}
        onChange$={(v) => {
          auditType.value = v;
        }}
      />
      <div class="flex items-center gap-1.5">
        <span class="text-[.65rem] font-mono text-[var(--text-dim)] whitespace-nowrap">
          {t("Keyword", language)}
        </span>
        <input
          class="h-7 px-2.5 bg-[var(--bg-elevated)] border border-[var(--border-mid)] rounded-[3px] text-[var(--text-base)] text-[.75rem] outline-none transition-[border-color] duration-[160ms] w-[180px] placeholder-[var(--text-dim)] focus:border-[var(--accent-pri)] focus:[box-shadow:0_0_0_2px_color-mix(in_srgb,var(--accent-pri)_15%,transparent)]"
          placeholder={t("e.g. best AI tools 2025", language)}
        />
      </div>
      <div class="flex items-center gap-1.5">
        <span class="text-[.65rem] font-mono text-[var(--text-dim)] whitespace-nowrap">
          {t("Competitor", language)}
        </span>
        <input
          class="h-7 px-2.5 bg-[var(--bg-elevated)] border border-[var(--border-mid)] rounded-[3px] text-[var(--text-base)] text-[.75rem] outline-none transition-[border-color] duration-[160ms] w-[180px] placeholder-[var(--text-dim)] focus:border-[var(--accent-pri)]"
          placeholder="https://competitor.com"
        />
      </div>
    </div>
  );
});

export const VoiceControls = component$<ControlsProps>(({ language }) => {
  const voice = useSignal("Nova");
  const format = useSignal("mp3");

  return (
    <div class="flex items-center gap-2 px-5 py-2.5 border-b border-[var(--border-dim)] animate-[fadeIn_.3s_both] flex-wrap">
      <Select
        label={t("Voice", language)}
        value={voice.value}
        options={translatedOptions(
          ["Alloy", "Echo", "Fable", "Onyx", "Nova", "Shimmer"],
          language,
        )}
        onChange$={(v) => {
          voice.value = v;
        }}
      />
      <div class="flex items-center gap-2">
        <span class="text-[.65rem] font-mono text-[var(--text-dim)]">
          {t("Speed", language)}
        </span>
        <input
          type="range"
          min="0.5"
          max="2.0"
          step="0.1"
          value="1.0"
          class="w-20 h-[3px] bg-[var(--border-mid)] rounded-sm outline-none cursor-pointer appearance-none [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--accent-pri)] [&::-webkit-slider-thumb]:cursor-pointer"
        />
      </div>
      <Select
        label={t("Format", language)}
        value={format.value}
        options={translatedOptions(
          ["mp3", "opus", "aac", "flac", "wav"],
          language,
        )}
        onChange$={(v) => {
          format.value = v;
        }}
      />
    </div>
  );
});

export const ImageControls = component$<ControlsProps>(({ language }) => {
  const style = useSignal("Photorealistic");
  const ratio = useSignal("16:9");
  const quality = useSignal("HD");
  const count = useSignal("1");

  return (
    <div class="flex items-center gap-2 px-5 py-2.5 border-b border-[var(--border-dim)] animate-[fadeIn_.3s_both] flex-wrap">
      <Select
        label={t("Style", language)}
        value={style.value}
        options={translatedOptions(
          [
            "Photorealistic",
            "Digital art",
            "Oil painting",
            "Watercolor",
            "Sketch",
            "3D render",
            "Pixel art",
            "Anime",
          ],
          language,
        )}
        onChange$={(v) => {
          style.value = v;
        }}
      />
      <Select
        label={t("Ratio", language)}
        value={ratio.value}
        options={translatedOptions(
          ["1:1", "16:9", "9:16", "4:3", "3:4"],
          language,
        )}
        onChange$={(v) => {
          ratio.value = v;
        }}
      />
      <Select
        label={t("Quality", language)}
        value={quality.value}
        options={translatedOptions(["Standard", "HD", "Ultra"], language)}
        onChange$={(v) => {
          quality.value = v;
        }}
      />
      <Select
        label={t("Count", language)}
        value={count.value}
        options={translatedOptions(["1", "2", "4"], language)}
        onChange$={(v) => {
          count.value = v;
        }}
      />
    </div>
  );
});

export const VideoControls = component$<ControlsProps>(({ language }) => {
  const platform = useSignal("YouTube");
  const duration = useSignal("5 min");
  const style = useSignal("Educational");

  return (
    <div class="flex items-center gap-2 px-5 py-2.5 border-b border-[var(--border-dim)] animate-[fadeIn_.3s_both] flex-wrap">
      <Select
        label={t("Platform", language)}
        value={platform.value}
        options={translatedOptions(
          ["YouTube", "TikTok", "Instagram Reels", "LinkedIn", "Twitter/X"],
          language,
        )}
        onChange$={(v) => {
          platform.value = v;
        }}
      />
      <Select
        label={t("Duration", language)}
        value={duration.value}
        options={translatedOptions(
          ["30s", "1 min", "5 min", "10 min", "15 min", "Long-form"],
          language,
        )}
        onChange$={(v) => {
          duration.value = v;
        }}
      />
      <Select
        label={t("Style", language)}
        value={style.value}
        options={translatedOptions(
          ["Educational", "Entertainment", "Tutorial", "Vlog", "Documentary"],
          language,
        )}
        onChange$={(v) => {
          style.value = v;
        }}
      />
    </div>
  );
});
