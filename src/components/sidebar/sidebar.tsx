import { $, component$, type QRL, useSignal } from "@builder.io/qwik";

import { modeLabel, t, type Language } from "~/lib/i18n";
import type { ConversationSummary, ShellMode } from "~/lib/types";

interface SidebarProps {
  activeMode: ShellMode;
  conversations: ConversationSummary[];
  activeConversationId?: string | null;
  language: Language;
  onModeChange$: QRL<(mode: ShellMode) => void>;
  onConversationSelect$: QRL<(conversationId: string) => void>;
  onConversationDelete$?: QRL<(conversationId: string) => void>;
  onNewChat$?: QRL<() => void>;
}

const MODE_COLORS: Record<string, string> = {
  chat: "#6366f1",
  content: "#22d3ee",
  code: "#34d399",
  canvas: "#38bdf8",
  email: "#f472b6",
  video: "#fb923c",
  seo: "#a78bfa",
  image: "#f59e0b",
  voice: "#ec4899",
  resume: "#14b8a6",
  bot: "#8b5cf6",
};

function relativeTime(timestamp: number, language: Language) {
  const delta = Math.max(0, Date.now() - timestamp);
  const minutes = Math.floor(delta / 60_000);

  if (minutes < 1) {
    return language === "tr" ? "şimdi" : "now";
  }

  if (minutes < 60) {
    return `${minutes}m`;
  }

  const hours = Math.floor(minutes / 60);
  if (hours < 24) {
    return `${hours}h`;
  }

  return `${Math.floor(hours / 24)}d`;
}

export const Sidebar = component$<SidebarProps>(
  ({
    conversations,
    activeConversationId,
    language,
    onConversationSelect$,
    onConversationDelete$,
    onNewChat$,
  }) => {
    const collapsed = useSignal(false);

    const toggleCollapse = $(() => {
      collapsed.value = !collapsed.value;
    });

    return (
      <aside
        class="flex flex-col bg-[var(--bg-surface)] border-r border-[var(--border-dim)] h-dvh overflow-hidden flex-shrink-0 relative z-10 transition-[width] duration-[240ms] ease-in-out"
        style={{ width: collapsed.value ? "52px" : "228px" }}
      >
        <div class="flex items-center gap-2.5 px-3 py-3 border-b border-[var(--border-dim)] min-h-[52px]">
          <div class="flex items-center justify-center w-6 h-6 flex-shrink-0">
            <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
              {/* Shadow AI: angular double-S mark */}
              <path
                d="M2 4h10v7H2v8h10"
                stroke="var(--accent-pri)"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
              />
              <path
                d="M7 8h10v6H7v5h10"
                stroke="var(--accent-pri)"
                stroke-width="1.9"
                stroke-linecap="round"
                stroke-linejoin="round"
                style={{ opacity: 0.42 }}
              />
            </svg>
          </div>
          {!collapsed.value && (
            <div class="flex items-baseline gap-[3px] flex-1 whitespace-nowrap">
              <span class="font-bold text-[.88rem] text-[var(--text-bright)] tracking-tight">
                Shadow
              </span>
              <span class="font-semibold text-[.7rem] text-[var(--accent-pri)] tracking-[.06em]">
                AI
              </span>
            </div>
          )}
          <button
            class="w-6 h-6 flex items-center justify-center rounded-[2px] text-[var(--text-dim)] hover:text-[var(--text-muted)] hover:bg-[var(--bg-hover)] transition-all duration-[160ms] flex-shrink-0 cursor-pointer border-none bg-transparent"
            onClick$={toggleCollapse}
            title={t(collapsed.value ? "Expand" : "Collapse", language)}
            type="button"
          >
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              style={{
                transform: collapsed.value ? "rotate(180deg)" : "rotate(0deg)",
                transition: "transform 220ms ease",
              }}
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
        </div>

        <div class="px-2 pt-2 pb-1">
          <button
            class="w-full flex items-center gap-2 px-2.5 py-2 bg-[var(--bg-elevated)] border border-[var(--border-mid)] rounded-[3px] text-[var(--text-muted)] cursor-pointer text-[.78rem] font-medium transition-all duration-[160ms] whitespace-nowrap overflow-hidden hover:bg-[var(--bg-hover)] hover:border-[var(--border-lit)] hover:text-[var(--text-bright)] group"
            title={t("New conversation", language)}
            type="button"
            onClick$={() => onNewChat$?.()}
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="flex-shrink-0 group-hover:text-[var(--accent-pri)] transition-colors duration-[160ms]"
            >
              <path d="M12 5v14M5 12h14" />
            </svg>
            {!collapsed.value && <span>{t("New chat", language)}</span>}
          </button>
        </div>

        {!collapsed.value && (
          <div class="flex-1 overflow-y-auto px-2 py-1">
            <div class="text-[.63rem] font-semibold uppercase tracking-[.08em] text-[var(--text-dim)] px-2 pt-2 pb-1.5">
              {t("Recent", language)}
            </div>

            {conversations.length === 0 ? (
              <p class="text-[.72rem] text-[var(--text-dim)] leading-relaxed px-2 py-2">
                {t(
                  "Sign in and send a message to start persistent memory.",
                  language,
                )}
              </p>
            ) : (
              <div class="flex flex-col gap-px">
                {conversations.map((item) => (
                  <button
                    key={item.id}
                    class={`history-item group w-full text-left px-2.5 py-2 rounded-[3px] border border-transparent cursor-pointer transition-all duration-[160ms] hover:bg-[var(--bg-hover)] hover:border-[var(--border-dim)] ${activeConversationId === item.id ? "bg-[var(--bg-hover)] border-[var(--border-dim)]" : ""}`}
                    style={
                      { "--mode-color": MODE_COLORS[item.mode] } as Record<
                        string,
                        string
                      >
                    }
                    onClick$={() => onConversationSelect$(item.id)}
                    type="button"
                  >
                    <div class="flex items-center gap-1.5 mb-0.5">
                      <span class="mode-dot w-1 h-1 rounded-full flex-shrink-0" />
                      <span class="text-[.65rem] font-mono text-[var(--text-dim)] group-hover:text-[var(--text-muted)] transition-colors">
                        {modeLabel(item.mode, item.mode, language)}
                      </span>
                      <span class="ml-auto text-[.62rem] font-mono text-[var(--text-dim)] flex-shrink-0">
                        {relativeTime(item.updatedAt, language)}
                      </span>
                      {onConversationDelete$ && (
                        <span class="history-delete-wrap flex-shrink-0">
                          <button
                            class="history-delete"
                            title={t("Delete conversation", language)}
                            type="button"
                            onClick$={(event) => {
                              event.stopPropagation();
                              onConversationDelete$(item.id);
                            }}
                          >
                            <svg
                              width="11"
                              height="11"
                              viewBox="0 0 24 24"
                              fill="none"
                            >
                              <path
                                d="M18 6L6 18M6 6l12 12"
                                stroke="currentColor"
                                stroke-width="1.5"
                                stroke-linecap="round"
                              />
                            </svg>
                          </button>
                        </span>
                      )}
                    </div>
                    <div class="text-[.76rem] text-[var(--text-muted)] group-hover:text-[var(--text-base)] transition-colors leading-tight overflow-hidden whitespace-nowrap text-ellipsis">
                      {item.title}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {collapsed.value && <div class="flex-1" />}

        <div class="px-2 pb-2 pt-1 border-t border-[var(--border-dim)]">
          <button
            class="w-full flex items-center gap-2 px-2.5 py-2 border-none bg-transparent rounded-[3px] text-[var(--text-dim)] cursor-pointer text-[.76rem] transition-all duration-[160ms] whitespace-nowrap overflow-hidden hover:bg-[var(--bg-hover)] hover:text-[var(--text-muted)]"
            title={t("Memory", language)}
            type="button"
          >
            <svg
              width="13"
              height="13"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.5"
              stroke-linecap="round"
              stroke-linejoin="round"
              class="flex-shrink-0"
            >
              <path d="M12 2a10 10 0 100 20 10 10 0 000-20z" />
              <path d="M12 8v4l3 3" />
            </svg>
            {!collapsed.value && (
              <span>{t("D1 + Vector memory", language)}</span>
            )}
          </button>
        </div>

        <style
          dangerouslySetInnerHTML={`
        .mode-dot {
          background: var(--mode-color);
          box-shadow: 0 0 4px var(--mode-color);
        }
        .history-delete-wrap {
          opacity: 0;
          transition: opacity 160ms ease;
        }
        .history-item:hover .history-delete-wrap,
        .history-item:focus-within .history-delete-wrap {
          opacity: 1;
        }
        .history-delete {
          width: 18px;
          height: 18px;
          border: none;
          background: transparent;
          color: var(--text-dim);
          border-radius: 3px;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          transition: all 160ms ease;
        }
        .history-delete:hover {
          color: #fca5a5;
          background: rgba(248, 113, 113, 0.1);
        }
      `}
        />
      </aside>
    );
  },
);
