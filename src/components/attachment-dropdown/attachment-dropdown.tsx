import {
  $,
  component$,
  type QRL,
  useOnDocument,
  useSignal,
} from "@builder.io/qwik";

import { t, type Language } from "~/lib/i18n";
import type { AttachmentItem } from "~/lib/types";
import { ATTACHMENT_MENU } from "~/lib/types";

interface AttachmentDropdownProps {
  onAction$: QRL<(action: string) => void>;
  language: Language;
}

export const AttachmentDropdown = component$<AttachmentDropdownProps>(
  ({ onAction$, language }) => {
    const open = useSignal(false);
    const hoveredItem = useSignal<string | null>(null);

    useOnDocument(
      "click",
      $((event) => {
        const target = event.target as Element | null;
        if (!target?.closest(".attach-root")) {
          open.value = false;
          hoveredItem.value = null;
        }
      }),
    );

    return (
      <div class="attach-root relative">
        <button
          class={`w-8 h-8 rounded-[3px] border border-[var(--border-mid)] bg-[var(--bg-elevated)] text-[var(--text-muted)] cursor-pointer flex items-center justify-center transition-all duration-[160ms] flex-shrink-0 hover:bg-[var(--bg-hover)] hover:border-[var(--border-lit)] hover:text-[var(--text-base)] ${open.value ? "bg-[var(--bg-hover)] border-[var(--border-focus)] !text-[var(--accent-pri)]" : ""}`}
          onClick$={() => {
            open.value = !open.value;
            if (!open.value) {
              hoveredItem.value = null;
            }
          }}
          title={t("Attach / Tools", language)}
          type="button"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <line
              x1="12"
              y1="5"
              x2="12"
              y2="19"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
            <line
              x1="5"
              y1="12"
              x2="19"
              y2="12"
              stroke="currentColor"
              stroke-width="2"
              stroke-linecap="round"
            />
          </svg>
        </button>

        {open.value && (
          <div
            class="absolute bottom-[calc(100%+8px)] left-0 w-[240px] bg-[var(--bg-elevated)] border border-[var(--border-mid)] rounded-[4px] p-1.5 z-[100] animate-slideDown"
            style={{
              boxShadow: "var(--shadow-lg), 0 0 0 1px rgba(255,255,255,.03)",
            }}
          >
            {ATTACHMENT_MENU.map((item: AttachmentItem) => (
              <div
                key={item.id}
                class="relative"
                onMouseEnter$={() => (hoveredItem.value = item.id)}
                onMouseLeave$={() => (hoveredItem.value = null)}
              >
                <button
                  class={`flex items-center gap-2 w-full px-2.5 py-2 rounded-[3px] border-none text-[var(--text-base)] cursor-pointer font-mono text-[.8rem] text-left transition-[background,color] duration-[160ms] ${hoveredItem.value === item.id ? "bg-[var(--bg-hover)] text-[var(--text-bright)]" : "bg-transparent"}`}
                  onClick$={() => {
                    if (!item.children) {
                      onAction$(item.action);
                      open.value = false;
                    }
                  }}
                  type="button"
                >
                  <span
                    class="w-[18px] flex items-center justify-center flex-shrink-0"
                    dangerouslySetInnerHTML={item.icon}
                  />
                  <span class="flex-1">{t(item.label, language)}</span>
                  {item.children && (
                    <svg
                      class="text-[var(--text-muted)] flex-shrink-0"
                      width="12"
                      height="12"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M9 18l6-6-6-6"
                        stroke="currentColor"
                        stroke-width="1.5"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      />
                    </svg>
                  )}
                </button>

                {item.children && hoveredItem.value === item.id && (
                  <div
                    class="absolute left-[calc(100%+4px)] top-0 w-[220px] bg-[var(--bg-elevated)] border border-[var(--border-mid)] rounded-[4px] p-1.5 z-[101] animate-slideDown"
                    style={{ boxShadow: "var(--shadow-lg)" }}
                  >
                    {item.children.map((child: AttachmentItem) => (
                      <button
                        key={child.id}
                        class="flex items-center gap-2 w-full px-2.5 py-[7px] rounded-[3px] border-none bg-transparent text-[var(--text-base)] cursor-pointer font-mono text-[.78rem] text-left transition-[background,color] duration-[160ms] hover:bg-[var(--bg-hover)] hover:text-[var(--text-bright)]"
                        onClick$={() => {
                          onAction$(child.action);
                          open.value = false;
                          hoveredItem.value = null;
                        }}
                        type="button"
                      >
                        <span
                          class="w-4 flex items-center justify-center"
                          dangerouslySetInnerHTML={child.icon}
                        />
                        <span>{t(child.label, language)}</span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div class="h-px bg-[var(--border-dim)] my-1.5" />

            <div class="flex items-center justify-between px-2.5 py-2 rounded-[3px] cursor-pointer transition-[background] duration-[160ms] hover:bg-[var(--bg-hover)]">
              <div class="flex items-center gap-2 text-[.8rem] text-[var(--text-base)]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="11"
                    cy="11"
                    r="8"
                    stroke="var(--accent-spark)"
                    stroke-width="1.5"
                  />
                  <path
                    d="m21 21-4.35-4.35"
                    stroke="var(--accent-spark)"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                </svg>
                <span style={{ color: "var(--accent-spark)" }}>
                  {t("Web search", language)}
                </span>
              </div>
              <div class="w-[18px] h-[18px] rounded-full bg-[rgba(34,211,238,.15)] flex items-center justify-center">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M20 6L9 17l-5-5"
                    stroke="var(--accent-spark)"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
              </div>
            </div>

            <div class="flex items-center justify-between px-2.5 py-2 rounded-[3px] cursor-pointer transition-[background] duration-[160ms] hover:bg-[var(--bg-hover)]">
              <div class="flex items-center gap-2 text-[.8rem] text-[var(--text-base)]">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 20h9"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                  />
                  <path
                    d="M16.5 3.5a2.121 2.121 0 013 3L7 19l-4 1 1-4L16.5 3.5z"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>{t("Use style", language)}</span>
              </div>
              <svg
                class="text-[var(--text-muted)]"
                width="12"
                height="12"
                viewBox="0 0 24 24"
                fill="none"
              >
                <path
                  d="M9 18l6-6-6-6"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </div>
          </div>
        )}
      </div>
    );
  },
);
