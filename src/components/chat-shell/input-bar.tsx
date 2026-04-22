import {
  $,
  component$,
  type QRL,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

import type { ShellMode } from "~/lib/types";
import { MODES } from "~/lib/types";
import { modeLabel, modePlaceholder, t, type Language } from "~/lib/i18n";
import type { ModelOption } from "~/lib/model-options";
import { AttachmentDropdown } from "~/components/attachment-dropdown/attachment-dropdown";
import { ModeSwitcher } from "~/components/modes/mode-switcher";

interface InputBarProps {
  currentMode: ShellMode;
  onModeChange$: QRL<(mode: ShellMode) => void>;
  onSubmit$: QRL<(text: string) => void>;
  onModelChange$?: QRL<(model: string) => void>;
  disabled: boolean;
  language: Language;
  selectedModel?: string;
  modelOptions?: ModelOption[];
  features?: {
    attachments: boolean;
    voiceInput: boolean;
    memoryToggle: boolean;
  };
}

export const InputBar = component$<InputBarProps>(
  ({
    currentMode,
    onModeChange$,
    onSubmit$,
    onModelChange$,
    disabled,
    language,
    selectedModel,
    modelOptions,
    features,
  }) => {
    const text = useSignal("");
    const showModeSwitcher = useSignal(false);
    const textareaRef = useSignal<HTMLTextAreaElement>();

    const config = MODES.find((mode) => mode.id === currentMode)!;
    const currentModeLabel = modeLabel(currentMode, config.label, language);
    const currentPlaceholder = modePlaceholder(
      currentMode,
      config.placeholder,
      language,
    );

    const autoResize = $(() => {
      const el = textareaRef.value;
      if (!el) {
        return;
      }

      el.style.height = "auto";
      el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
    });

    const handleInput = $((event: InputEvent) => {
      const val = (event.target as HTMLTextAreaElement).value;
      text.value = val;
      autoResize();

      const slashMatch = val.match(/^\/(\w*)$/);
      if (slashMatch) {
        showModeSwitcher.value = true;
      }

      const exactMatch = MODES.find((mode) => mode.command === val.trim());
      if (exactMatch) {
        onModeChange$(exactMatch.id);
        text.value = "";
        showModeSwitcher.value = false;
      }
    });

    const handleKeyDown = $((event: KeyboardEvent) => {
      if (event.key === "Enter" && !event.shiftKey && !event.ctrlKey) {
        // eslint-disable-next-line qwik/no-async-prevent-default
        event.preventDefault();
        if (text.value.trim() && !disabled) {
          onSubmit$(text.value.trim());
          text.value = "";
          if (textareaRef.value) {
            textareaRef.value.style.height = "auto";
          }
        }
      }

      if (event.key === "Escape") {
        showModeSwitcher.value = false;
      }
    });

    const handleAttachmentAction = $(() => {
      // Attachment actions stay hidden until backed by real upload endpoints.
    });

    const closeModeSwitcher = $(() => {
      showModeSwitcher.value = false;
    });

    const selectMode = $((mode: ShellMode) => {
      onModeChange$(mode);
      text.value = "";
      showModeSwitcher.value = false;
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      textareaRef.value?.focus();
    });

    return (
      <>
        {showModeSwitcher.value && (
          <ModeSwitcher
            currentMode={currentMode}
            onSelect$={selectMode}
            onClose$={closeModeSwitcher}
            language={language}
          />
        )}

        <div class="px-4 pb-4 flex-shrink-0">
          <div class="flex items-center gap-2 mb-2 flex-wrap">
            <button
              class="mode-pill"
              style={{ "--mode-color": config.color } as Record<string, string>}
              onClick$={() => {
                showModeSwitcher.value = true;
              }}
              title={t("Switch mode (or type /command)", language)}
              type="button"
            >
              <span class="mode-pill-dot" />
              <span
                class="flex items-center"
                dangerouslySetInnerHTML={config.icon}
              />
              <span class="font-medium text-[.72rem]">{currentModeLabel}</span>
              <span class="font-mono text-[.65rem] opacity-60">
                {config.command}
              </span>
              <svg
                width="10"
                height="10"
                viewBox="0 0 24 24"
                fill="none"
                style={{ opacity: 0.4 }}
              >
                <path
                  d="M18 9l-6 6-6-6"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                  stroke-linejoin="round"
                />
              </svg>
            </button>

            {modelOptions?.length ? (
              <label class="flex items-center gap-2 h-8 px-2 rounded-[4px] border border-[var(--border-dim)] bg-[var(--bg-elevated)] text-[.7rem] text-[var(--text-dim)] font-mono">
                <span>{t("Model", language)}</span>
                <select
                  class="bg-transparent border-none outline-none text-[.72rem] text-[var(--text-base)] min-w-[188px] max-w-[240px]"
                  value={selectedModel}
                  onChange$={(event) =>
                    onModelChange$?.((event.target as HTMLSelectElement).value)
                  }
                  disabled={disabled}
                >
                  {modelOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </label>
            ) : null}
          </div>

          <div
            class={`input-shell ${disabled ? "opacity-70 pointer-events-none" : ""}`}
            style={{ "--mode-color": config.color } as Record<string, string>}
          >
            {features?.attachments !== false ? (
              <AttachmentDropdown
                onAction$={handleAttachmentAction}
                language={language}
              />
            ) : null}

            <textarea
              ref={textareaRef}
              class="flex-1 bg-transparent border-none outline-none font-mono text-[.88rem] text-[var(--text-bright)] leading-relaxed resize-none max-h-[200px] overflow-y-auto p-0 min-h-[22px] placeholder-[var(--text-dim)]"
              placeholder={currentPlaceholder}
              value={text.value}
              onInput$={handleInput}
              onKeyDown$={handleKeyDown}
              rows={1}
              disabled={disabled}
            />

            <div class="flex items-center gap-1 flex-shrink-0">
              {features?.voiceInput ? (
                <button
                  class="tool-btn"
                  title={t("Voice input", language)}
                  type="button"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                    <path
                      d="M19 10v2a7 7 0 01-14 0v-2M12 19v4M8 23h8"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              ) : null}

              {features?.memoryToggle ? (
                <button
                  class="tool-btn"
                  title={t("Memory context", language)}
                  type="button"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                    <path
                      d="M12 8v4l3 3"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                </button>
              ) : null}

              <button
                class={`send-btn ${text.value.trim() && !disabled ? "ready" : ""}`}
                style={
                  { "--mode-color": config.color } as Record<string, string>
                }
                onClick$={() => {
                  if (text.value.trim() && !disabled) {
                    onSubmit$(text.value.trim());
                    text.value = "";
                    if (textareaRef.value) {
                      textareaRef.value.style.height = "auto";
                    }
                  }
                }}
                disabled={!text.value.trim() || disabled}
                title={t("Send (Enter)", language)}
                type="button"
              >
                {disabled ? (
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    style={{ animation: "spin 1s linear infinite" }}
                  >
                    <circle
                      cx="12"
                      cy="12"
                      r="9"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-dasharray="28 56"
                    />
                  </svg>
                ) : (
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={`
        .mode-pill {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 10px 6px 8px;
          border-radius: var(--r-sm);
          border: 1px solid color-mix(in srgb, var(--mode-color) 30%, transparent);
          background: color-mix(in srgb, var(--mode-color) 8%, var(--bg-elevated));
          color: var(--mode-color);
          cursor: pointer;
          font-family: var(--font-body);
          transition: all var(--t-fast);
        }
        .mode-pill:hover {
          background: color-mix(in srgb, var(--mode-color) 15%, var(--bg-elevated));
          border-color: color-mix(in srgb, var(--mode-color) 45%, transparent);
        }
        .mode-pill-dot {
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: var(--mode-color);
          flex-shrink: 0;
          box-shadow: 0 0 6px var(--mode-color);
        }

        .input-shell {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          background: var(--bg-elevated);
          border: 1px solid var(--border-mid);
          border-radius: var(--r-xl);
          padding: 14px 10px 14px 14px;
          transition: border-color var(--t-fast), box-shadow var(--t-fast);
        }
        .input-shell:focus-within {
          border-color: color-mix(in srgb, var(--mode-color) 50%, var(--border-focus));
          box-shadow: 0 0 0 3px color-mix(in srgb, var(--mode-color) 12%, transparent);
        }

        .tool-btn {
          width: 30px;
          height: 30px;
          border-radius: var(--r-sm);
          border: none;
          background: none;
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--t-fast);
        }
        .tool-btn:hover {
          background: var(--bg-hover);
          color: var(--text-base);
        }

        .send-btn {
          width: 34px;
          height: 34px;
          border-radius: var(--r-sm);
          border: 1px solid var(--border-mid);
          background: var(--bg-hover);
          color: var(--text-muted);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all var(--t-fast);
        }
        .send-btn:disabled {
          opacity: .4;
          cursor: not-allowed;
        }
        .send-btn.ready {
          background: var(--mode-color);
          border-color: var(--mode-color);
          color: white;
          box-shadow: 0 0 12px color-mix(in srgb, var(--mode-color) 40%, transparent);
          transform: scale(1.05);
        }
        .send-btn.ready:hover {
          filter: brightness(1.1);
        }
      `}
        />
      </>
    );
  },
);
