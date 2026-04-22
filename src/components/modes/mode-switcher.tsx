import {
  component$,
  useComputed$,
  type QRL,
  useSignal,
} from "@builder.io/qwik";

import {
  modeDescription,
  modeLabel,
  modeSearchText,
  resultCountText,
  t,
  type Language,
} from "~/lib/i18n";
import type { ShellMode } from "~/lib/types";
import { MODES } from "~/lib/types";

interface ModeSwitcherProps {
  currentMode: ShellMode;
  onSelect$: QRL<(mode: ShellMode) => void>;
  onClose$: QRL<() => void>;
  language: Language;
}

export const ModeSwitcher = component$<ModeSwitcherProps>(
  ({ currentMode, onSelect$, onClose$, language }) => {
    const query = useSignal("");

    const filtered = useComputed$(() => {
      const queryLower = query.value.toLowerCase();
      return MODES.filter(
        (mode) =>
          modeSearchText(mode.id, mode.label, mode.description).includes(
            queryLower,
          ) || mode.command.toLowerCase().includes(queryLower),
      );
    });

    return (
      <div
        class="fixed inset-0 bg-black/70 backdrop-blur-[6px] flex items-center justify-center z-[1000] p-5"
        onClick$={(event) => {
          if ((event.target as HTMLElement).classList.contains("ms-overlay"))
            onClose$();
        }}
      >
        <div class="ms-overlay absolute inset-0" />

        <div class="ms-panel relative w-full max-w-[540px] rounded-[4px] overflow-hidden animate-scaleIn">
          {/* Header / search */}
          <div class="ms-header flex items-center gap-3 px-4 py-3.5">
            <span class="ms-prompt font-mono text-[.82rem] select-none flex-shrink-0">
              _/
            </span>
            <input
              class="flex-1 bg-transparent border-none outline-none font-mono text-[.88rem] text-[var(--text-bright)] placeholder-[var(--text-dim)] tracking-tight"
              placeholder={t("type a mode or command…", language)}
              value={query.value}
              onInput$={(event) => {
                query.value = (event.target as HTMLInputElement).value;
              }}
              autoFocus
            />
            <div class="flex items-center gap-1.5 flex-shrink-0">
              <span class="text-[.62rem] font-mono text-[var(--text-dim)] hidden sm:inline">
                ↑↓ {t("navigate", language)}
              </span>
              <kbd
                class="ms-esc font-mono text-[.63rem] px-2 py-0.5 cursor-pointer transition-all duration-[160ms]"
                onClick$={onClose$}
              >
                ESC
              </kbd>
            </div>
          </div>

          {/* Section label */}
          <div class="ms-section-label flex items-center gap-2 px-4 py-1.5">
            <span class="font-mono text-[.6rem] tracking-[.12em] uppercase text-[var(--text-dim)]">
              {query.value
                ? resultCountText(filtered.value.length, language)
                : t("all modes", language)}
            </span>
            <div class="flex-1 h-px bg-[var(--border-dim)]" />
          </div>

          {/* Mode list */}
          <div class="ms-list max-h-[400px] overflow-y-auto pb-1.5">
            {filtered.value.map((mode) => (
              <button
                key={mode.id}
                class={`ms-item w-full text-left cursor-pointer transition-all duration-[130ms] ${currentMode === mode.id ? "active" : ""}`}
                style={{ "--mode-color": mode.color } as Record<string, string>}
                onClick$={() => {
                  onSelect$(mode.id);
                  onClose$();
                }}
                type="button"
              >
                <div class="ms-item-inner flex items-center gap-3 px-4 py-2.5">
                  {/* Color accent bar */}
                  <div class="ms-accent-bar" />

                  {/* Icon */}
                  <div
                    class="ms-icon-wrap w-8 h-8 rounded-[3px] flex items-center justify-center flex-shrink-0 [&_svg]:w-[15px] [&_svg]:h-[15px]"
                    dangerouslySetInnerHTML={mode.icon}
                  />

                  {/* Info */}
                  <div class="flex flex-col gap-0.5 flex-1 min-w-0">
                    <div class="flex items-baseline gap-2">
                      <span class="ms-label font-mono font-semibold text-[.82rem] tracking-tight">
                        {modeLabel(mode.id, mode.label, language)}
                      </span>
                      <span class="ms-cmd font-mono text-[.65rem] tracking-wide">
                        {mode.command}
                      </span>
                    </div>
                    <span class="ms-desc text-[.71rem] text-[var(--text-dim)] truncate leading-snug">
                      {modeDescription(mode.id, mode.description, language)}
                    </span>
                  </div>

                  {/* Active indicator */}
                  {currentMode === mode.id && (
                    <div class="flex items-center gap-1.5 flex-shrink-0">
                      <span class="ms-active-badge font-mono text-[.6rem] tracking-wide px-1.5 py-0.5 rounded-[2px]">
                        {t("active", language)}
                      </span>
                    </div>
                  )}
                </div>
              </button>
            ))}

            {filtered.value.length === 0 && (
              <div class="px-4 py-8 text-center">
                <p class="font-mono text-[.78rem] text-[var(--text-dim)]">
                  {t("no match for", language)}{" "}
                  <span class="text-[var(--text-muted)]">"{query.value}"</span>
                </p>
                <p class="font-mono text-[.65rem] text-[var(--text-dim)] mt-1">
                  {t("try /chat, /code, /email…", language)}
                </p>
              </div>
            )}
          </div>

          {/* Footer */}
          <div class="ms-footer flex items-center justify-between px-4 py-2">
            <span class="font-mono text-[.6rem] text-[var(--text-dim)] tracking-wide">
              {t("SHADOW AI · MODE SWITCHER", language)}
            </span>
            <div class="flex items-center gap-3">
              <span class="font-mono text-[.6rem] text-[var(--text-dim)]">
                <kbd class="ms-key">↵</kbd> {t("select", language)}
              </span>
              <span class="font-mono text-[.6rem] text-[var(--text-dim)]">
                <kbd class="ms-key">/</kbd> {t("filter", language)}
              </span>
            </div>
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={`
        .ms-panel {
          background: var(--bg-elevated);
          border: 1px solid var(--border-mid);
          box-shadow:
            0 0 0 1px rgba(255,255,255,.03),
            0 24px 80px rgba(0,0,0,.7),
            0 0 80px color-mix(in srgb, var(--accent-pri) 8%, transparent);
        }

        .ms-header {
          background: var(--bg-surface);
          border-bottom: 1px solid var(--border-dim);
        }

        .ms-prompt {
          color: var(--accent-pri);
          text-shadow: 0 0 8px color-mix(in srgb, var(--accent-pri) 60%, transparent);
        }

        .ms-esc {
          background: var(--bg-hover);
          border: 1px solid var(--border-mid);
          color: var(--text-dim);
          border-radius: 2px;
        }
        .ms-esc:hover {
          border-color: var(--border-lit);
          color: var(--text-muted);
        }

        .ms-section-label {
          background: color-mix(in srgb, var(--bg-surface) 50%, transparent);
        }

        .ms-list {
          scrollbar-width: thin;
        }

        .ms-item {
          background: transparent;
          border: none;
          position: relative;
        }

        .ms-item-inner {
          position: relative;
        }

        .ms-accent-bar {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          width: 2px;
          height: 0;
          background: var(--mode-color);
          border-radius: 0 1px 1px 0;
          transition: height 150ms ease, opacity 150ms ease;
          opacity: 0;
        }

        .ms-item:hover .ms-accent-bar,
        .ms-item.active .ms-accent-bar {
          height: 60%;
          opacity: 1;
        }

        .ms-icon-wrap {
          background: color-mix(in srgb, var(--mode-color) 10%, var(--bg-surface));
          border: 1px solid color-mix(in srgb, var(--mode-color) 15%, transparent);
          color: var(--mode-color);
          transition: all 130ms ease;
        }

        .ms-item:hover .ms-icon-wrap {
          background: color-mix(in srgb, var(--mode-color) 18%, var(--bg-surface));
          border-color: color-mix(in srgb, var(--mode-color) 30%, transparent);
          box-shadow: 0 0 12px color-mix(in srgb, var(--mode-color) 20%, transparent);
        }

        .ms-label {
          color: var(--text-muted);
          transition: color 130ms ease;
        }

        .ms-item:hover .ms-label {
          color: var(--text-bright);
        }

        .ms-item.active .ms-label {
          color: var(--text-bright);
        }

        .ms-cmd {
          color: var(--text-dim);
          transition: color 130ms ease;
          letter-spacing: 0.04em;
        }

        .ms-item:hover .ms-cmd {
          color: var(--mode-color);
        }

        .ms-item.active .ms-cmd {
          color: var(--mode-color);
        }

        .ms-desc {
          transition: color 130ms ease;
        }

        .ms-item:hover .ms-desc {
          color: var(--text-muted);
        }

        .ms-item:hover {
          background: color-mix(in srgb, var(--mode-color) 4%, var(--bg-hover));
        }

        .ms-item.active {
          background: color-mix(in srgb, var(--mode-color) 6%, transparent);
        }

        .ms-active-badge {
          background: color-mix(in srgb, var(--mode-color) 12%, transparent);
          border: 1px solid color-mix(in srgb, var(--mode-color) 25%, transparent);
          color: var(--mode-color);
          text-transform: uppercase;
          letter-spacing: .08em;
        }

        .ms-footer {
          background: var(--bg-surface);
          border-top: 1px solid var(--border-dim);
        }

        .ms-key {
          display: inline-block;
          background: var(--bg-hover);
          border: 1px solid var(--border-mid);
          border-radius: 2px;
          padding: 0 4px;
          margin-right: 3px;
          font-family: var(--font-mono);
          font-size: .6rem;
          color: var(--text-muted);
          line-height: 1.6;
        }
      `}
        />
      </div>
    );
  },
);
