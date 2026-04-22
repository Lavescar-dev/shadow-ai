import {
  $,
  component$,
  type QRL,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

import { downloadResumePdf } from "~/lib/api";
import { modeLabel, t, type Language } from "~/lib/i18n";
import type {
  CanvasArtifactData,
  ModeArtifact,
  ResumeTemplate,
} from "~/lib/types";
import type { Message, ShellMode } from "~/lib/types";
import { MODES } from "~/lib/types";
import { isInternalRouterModel } from "../../../shared/branding";

interface MessageBubbleProps {
  message: Message;
  index: number;
  language: Language;
  onApplyCanvasArtifact$?: QRL<(artifact: CanvasArtifactData) => void>;
  onOpenInCanvas$?: QRL<(content: string) => void>;
}

export const MessageBubble = component$<MessageBubbleProps>(
  ({ message, index, language, onApplyCanvasArtifact$, onOpenInCanvas$ }) => {
    const copied = useSignal(false);
    const resumeTemplate = useSignal<ResumeTemplate>("ats-professional");
    const pdfStatus = useSignal("");
    const config = MODES.find((mode) => mode.id === message.mode)!;
    const artifact = message.metadata?.artifact;

    const copyContent = $(async () => {
      try {
        await navigator.clipboard.writeText(message.content);
        copied.value = true;
        window.setTimeout(() => {
          copied.value = false;
        }, 2000);
      } catch {
        copied.value = false;
      }
    });

    const downloadPdf = $(async () => {
      if (!artifact?.resume) {
        return;
      }

      try {
        pdfStatus.value = "Preparing PDF...";
        const blob = await downloadResumePdf(artifact, resumeTemplate.value);
        const url = URL.createObjectURL(blob);
        const link = document.createElement("a");
        link.href = url;
        link.download = `${artifact.resume.fullName || "resume"}.pdf`;
        document.body.appendChild(link);
        link.click();
        link.remove();
        URL.revokeObjectURL(url);
        pdfStatus.value = "PDF downloaded";
      } catch (error) {
        pdfStatus.value =
          error instanceof Error ? error.message : "PDF download failed";
      }
    });

    const downloadImage = $(
      async (dataUrl: string, title: string, mimeType?: string) => {
        const extension =
          mimeType === "image/jpeg"
            ? "jpg"
            : mimeType === "image/webp"
              ? "webp"
              : "png";
        const slug = title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-+|-+$/g, "");
        const link = document.createElement("a");
        link.href = dataUrl;
        link.download = `${slug || "shadow-image"}.${extension}`;
        document.body.appendChild(link);
        link.click();
        link.remove();
      },
    );

    if (message.role === "user") {
      return (
        <div
          class="flex flex-col items-end gap-1 animate-[fadeUp_.35s_both]"
          style={{ animationDelay: `${index * 0.05}s` }}
        >
          <div class="max-w-[min(68%,600px)] bg-[var(--bg-elevated)] border border-[var(--border-mid)] rounded-[3px] px-4 py-2.5 text-[var(--text-base)] text-[.88rem] leading-relaxed">
            <p>{message.content}</p>
          </div>
          <div class="text-[.66rem] text-[var(--text-dim)] font-mono">
            {new Date(message.timestamp).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </div>
        </div>
      );
    }

    const assistantBubbleClass = message.streaming
      ? "msg-assistant flex gap-3"
      : "msg-assistant flex gap-3 animate-[fadeUp_.35s_both]";

    return (
      <div
        class={assistantBubbleClass}
        style={
          message.streaming ? undefined : { animationDelay: `${index * 0.05}s` }
        }
      >
        <div
          class="msg-avatar w-7 h-7 rounded-[3px] flex items-center justify-center flex-shrink-0 mt-0.5"
          style={{ "--mode-color": config.color } as Record<string, string>}
          dangerouslySetInnerHTML={config.icon}
        />

        <div class="flex-1 min-w-0">
          <div
            class="flex items-center gap-1.5 text-[.68rem] font-mono font-medium mb-1.5"
            style={{ color: config.color }}
          >
            <span>{modeLabel(message.mode, config.label, language)}</span>
            <span class="w-[3px] h-[3px] rounded-full bg-[var(--text-dim)]" />
            <span class="text-[var(--text-dim)]">
              {new Date(message.timestamp).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </span>
          </div>

          <div class="text-[.875rem] leading-[1.7] text-[var(--text-base)] whitespace-pre-wrap break-words">
            {message.streaming && message.mode === "canvas" ? (
              <div class="canvas-stream-block">
                <div class="canvas-stream-pill">
                  <span class="canvas-stream-pill-dot" />
                  <span>{t("Canvas is generating...", language)}</span>
                </div>
                <div class="canvas-stream-status">
                  <span>
                    {message.content ||
                      t("Preparing canvas workspace...", language)}
                  </span>
                  <span class="inline-block animate-[blink_.8s_step-end_infinite] text-[var(--accent-pri)] ml-px">
                    ▍
                  </span>
                </div>
              </div>
            ) : message.streaming ? (
              <>
                <span>{message.content}</span>
                <span class="inline-block animate-[blink_.8s_step-end_infinite] text-[var(--accent-pri)] ml-px">
                  ▍
                </span>
              </>
            ) : (
              <span>{message.content}</span>
            )}
          </div>

          {!message.streaming && artifact && (
            <ArtifactCard
              artifact={artifact}
              resumeTemplate={resumeTemplate.value}
              pdfStatus={pdfStatus.value}
              language={language}
              onApplyCanvasArtifact$={onApplyCanvasArtifact$}
              onTemplateChange$={(value) => {
                resumeTemplate.value = value;
              }}
              onDownloadPdf$={downloadPdf}
              onDownloadImage$={downloadImage}
            />
          )}

          {!message.streaming && (
            <div class="msg-actions flex items-center gap-0.5 mt-2 opacity-0 transition-opacity duration-[160ms]">
              <button
                class="msg-action-btn"
                onClick$={copyContent}
                title={t("Copy", language)}
                type="button"
              >
                {copied.value ? (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M20 6L9 17l-5-5"
                      stroke="var(--accent-green)"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                ) : (
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="9"
                      y="9"
                      width="13"
                      height="13"
                      rx="2"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                    <path
                      d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                  </svg>
                )}
                <span>{t(copied.value ? "Copied!" : "Copy", language)}</span>
              </button>
              {onOpenInCanvas$ && (
                <button
                  class="msg-action-btn"
                  title={t("Open in Canvas", language)}
                  type="button"
                  onClick$={() => onOpenInCanvas$(message.content)}
                >
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <rect
                      x="3.5"
                      y="3.5"
                      width="17"
                      height="17"
                      rx="2"
                      stroke="currentColor"
                      stroke-width="1.5"
                    />
                    <path
                      d="M8 8h8M8 12h5M8 16h3"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                    />
                  </svg>
                  <span>{t("Open in Canvas", language)}</span>
                </button>
              )}
              <button
                class="msg-action-btn"
                title={t("Regenerate", language)}
                type="button"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M1 4v6h6M23 20v-6h-6"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                  <path
                    d="M20.49 9A9 9 0 005.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 013.51 15"
                    stroke="currentColor"
                    stroke-width="1.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  />
                </svg>
                <span>{t("Retry", language)}</span>
              </button>
              <button
                class="msg-action-btn"
                title={t("Share", language)}
                type="button"
              >
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                  <circle
                    cx="18"
                    cy="5"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <circle
                    cx="6"
                    cy="12"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <circle
                    cx="18"
                    cy="19"
                    r="3"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <line
                    x1="8.59"
                    y1="13.51"
                    x2="15.42"
                    y2="17.49"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                  <line
                    x1="15.41"
                    y1="6.51"
                    x2="8.59"
                    y2="10.49"
                    stroke="currentColor"
                    stroke-width="1.5"
                  />
                </svg>
                <span>{t("Share", language)}</span>
              </button>
            </div>
          )}
        </div>

        <style
          dangerouslySetInnerHTML={`
        .msg-avatar {
          background: color-mix(in srgb, var(--mode-color) 15%, var(--bg-elevated));
          border: 1px solid color-mix(in srgb, var(--mode-color) 25%, transparent);
        }
        .msg-assistant:hover .msg-actions {
          opacity: 1;
        }
        .msg-action-btn {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px 8px;
          border-radius: var(--r-xs);
          border: none;
          background: none;
          color: var(--text-muted);
          font-size: .7rem;
          font-family: var(--font-body);
          cursor: pointer;
          transition: all var(--t-fast);
        }
        .msg-action-btn:hover {
          background: var(--bg-hover);
          color: var(--text-base);
        }
        .artifact-meta-line {
          margin-top: 6px;
          font-size: .72rem;
          color: var(--text-dim);
          font-family: var(--font-mono);
        }
        .artifact-meta-line--warn {
          color: #fbbf24;
        }
        .canvas-stream-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 8px;
          padding: 4px 10px;
          border-radius: 999px;
          border: 1px solid color-mix(in srgb, var(--accent-pri) 22%, transparent);
          background: color-mix(in srgb, var(--accent-pri) 11%, transparent);
          color: var(--text-bright);
          font-size: .7rem;
          font-family: var(--font-mono);
          letter-spacing: .08em;
          text-transform: uppercase;
        }
        .canvas-stream-block {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .canvas-stream-status {
          display: inline-flex;
          align-items: center;
          gap: 2px;
          color: var(--text-base);
          min-height: 22px;
        }
        .canvas-stream-pill-dot {
          width: 8px;
          height: 8px;
          border-radius: 999px;
          background: var(--accent-pri);
          box-shadow: 0 0 18px color-mix(in srgb, var(--accent-pri) 55%, transparent);
          animation: canvasPulse 1s ease-in-out infinite;
          flex-shrink: 0;
        }
        @keyframes canvasPulse {
          0%, 100% { transform: scale(.78); opacity: .65; }
          50% { transform: scale(1); opacity: 1; }
        }
      `}
        />
      </div>
    );
  },
);

interface ArtifactCardProps {
  artifact: ModeArtifact;
  resumeTemplate: ResumeTemplate;
  pdfStatus: string;
  language: Language;
  onApplyCanvasArtifact$?: QRL<(artifact: CanvasArtifactData) => void>;
  onTemplateChange$: QRL<(value: ResumeTemplate) => void>;
  onDownloadPdf$: QRL<() => void>;
  onDownloadImage$: QRL<
    (dataUrl: string, title: string, mimeType?: string) => void
  >;
}

const ArtifactCard = component$<ArtifactCardProps>(
  ({
    artifact,
    resumeTemplate,
    pdfStatus,
    language,
    onApplyCanvasArtifact$,
    onTemplateChange$,
    onDownloadPdf$,
    onDownloadImage$,
  }) => {
    const selectedModel =
      typeof artifact.metadata?.selectedModel === "string"
        ? artifact.metadata.selectedModel
        : null;
    const attemptedModel =
      typeof artifact.metadata?.attemptedModel === "string"
        ? artifact.metadata.attemptedModel
        : null;
    const isCanvasFallback =
      artifact.mode === "canvas" &&
      (artifact.metadata?.routeReason === "canvas-fallback-scaffold" ||
        isInternalRouterModel(selectedModel));
    const canvasModelLabel =
      isCanvasFallback && attemptedModel ? attemptedModel : selectedModel;

    return (
      <div class="mt-4 rounded-[6px] border border-[var(--border-mid)] bg-[var(--bg-elevated)] overflow-hidden">
        <div class="flex items-center justify-between gap-3 px-4 py-3 border-b border-[var(--border-dim)]">
          <div>
            <p class="text-[.72rem] uppercase tracking-[.14em] text-[var(--text-dim)] font-mono">
              {modeLabel(artifact.mode, artifact.mode, language)}{" "}
              {t("artifact", language)}
            </p>
            <h3 class="text-[1rem] text-[var(--text-bright)] font-bold">
              {artifact.title}
            </h3>
          </div>

          {artifact.resume && (
            <div class="flex items-center gap-2">
              <select
                class="h-8 bg-[var(--bg-surface)] border border-[var(--border-mid)] rounded-[3px] px-2 text-[.72rem] text-[var(--text-base)] outline-none"
                value={resumeTemplate}
                onChange$={(event) =>
                  onTemplateChange$(
                    (event.target as HTMLSelectElement).value as ResumeTemplate,
                  )
                }
              >
                <option value="ats-professional">
                  {t("ATS professional", language)}
                </option>
                <option value="modern-visual">
                  {t("Modern visual", language)}
                </option>
              </select>
              <button
                class="artifact-btn"
                onClick$={() => onDownloadPdf$()}
                type="button"
              >
                PDF
              </button>
            </div>
          )}
        </div>

        <div class="p-4 flex flex-col gap-3">
          <p class="text-[.82rem] text-[var(--text-base)] leading-relaxed">
            {artifact.summary}
          </p>

          {artifact.images?.length ? (
            <div class="artifact-panel">
              <h4>{t("Image preview", language)}</h4>
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                {artifact.images.map((image, imageIndex) => (
                  <div key={`${artifact.title}-${imageIndex}`}>
                    <img
                      src={image.dataUrl}
                      alt={image.alt || artifact.title}
                      class="artifact-image"
                      loading="lazy"
                      width={image.width || 1024}
                      height={image.height || 1024}
                      style={
                        image.width && image.height
                          ? { aspectRatio: `${image.width} / ${image.height}` }
                          : undefined
                      }
                    />
                    <div class="artifact-image-actions">
                      <a
                        class="artifact-link-btn"
                        href={image.dataUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {t("Open", language)}
                      </a>
                      <button
                        class="artifact-link-btn"
                        type="button"
                        onClick$={() =>
                          onDownloadImage$(
                            image.dataUrl,
                            `${artifact.title}-${imageIndex + 1}`,
                            image.mimeType,
                          )
                        }
                      >
                        {t("Download", language)}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ) : null}

          {artifact.resume && (
            <div class="grid grid-cols-1 md:grid-cols-[1.2fr_.8fr] gap-3">
              <div class="artifact-panel">
                <h4>{artifact.resume.fullName}</h4>
                <p>{artifact.resume.headline}</p>
                <p>{artifact.resume.summary}</p>
              </div>
              <div class="artifact-panel">
                <h4>{t("Skills", language)}</h4>
                <p>{artifact.resume.skills.join(" · ")}</p>
              </div>
            </div>
          )}

          {artifact.bot && (
            <div class="artifact-panel">
              <h4>{artifact.bot.name}</h4>
              <p>{artifact.bot.description}</p>
              <p class="font-mono text-[.72rem] text-[var(--text-dim)]">
                {t("Tone", language)}: {artifact.bot.tone} ·{" "}
                {t("Memory", language)}: {artifact.bot.memoryPolicy}
              </p>
            </div>
          )}

          {artifact.canvas && (
            <div class="artifact-panel">
              <div class="flex items-start justify-between gap-3 flex-wrap">
                <div>
                  <h4>{t("Canvas changes", language)}</h4>
                  <p>
                    {artifact.canvas.template === "html" ? "HTML" : "React"} ·{" "}
                    {artifact.canvas.changedFiles.join(", ")}
                  </p>
                  {canvasModelLabel && (
                    <p class="artifact-meta-line">
                      {language === "tr" ? "Model" : "Model"} ·{" "}
                      {canvasModelLabel}
                    </p>
                  )}
                  {isCanvasFallback && (
                    <p class="artifact-meta-line artifact-meta-line--warn">
                      {language === "tr"
                        ? "Provider yerine guvenli fallback scaffold uygulandi."
                        : "A safe fallback scaffold was applied instead of the provider output."}
                    </p>
                  )}
                </div>
                {onApplyCanvasArtifact$ && (
                  <button
                    class="artifact-btn"
                    type="button"
                    onClick$={() => onApplyCanvasArtifact$(artifact.canvas!)}
                  >
                    {t("Apply to Canvas", language)}
                  </button>
                )}
              </div>
              {artifact.canvas.previewNotes?.length ? (
                <ul>
                  {artifact.canvas.previewNotes.map((item, itemIndex) => (
                    <li key={`${item}-${itemIndex}`}>{item}</li>
                  ))}
                </ul>
              ) : null}
            </div>
          )}

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            {artifact.sections.map((section, sectionIndex) => (
              <div
                class="artifact-panel"
                key={`${section.heading}-${sectionIndex}`}
              >
                <div class="flex items-center justify-between gap-2">
                  <h4>{section.heading}</h4>
                  {typeof section.score === "number" && (
                    <span class="text-[.68rem] font-mono text-[var(--accent-green)]">
                      {section.score}/100
                    </span>
                  )}
                </div>
                {section.body && <p>{section.body}</p>}
                {section.items && (
                  <ul>
                    {section.items.map((item, itemIndex) => (
                      <li key={`${item}-${itemIndex}`}>{item}</li>
                    ))}
                  </ul>
                )}
                {section.code && <pre>{section.code}</pre>}
              </div>
            ))}
          </div>

          {artifact.actions?.length ? (
            <div class="artifact-panel">
              <h4>{t("Next actions", language)}</h4>
              <ul>
                {artifact.actions.map((action, actionIndex) => (
                  <li key={`${action}-${actionIndex}`}>{action}</li>
                ))}
              </ul>
            </div>
          ) : null}

          {pdfStatus && (
            <p class="text-[.7rem] text-[var(--text-dim)] font-mono">
              {t(pdfStatus, language)}
            </p>
          )}
        </div>

        <style
          dangerouslySetInnerHTML={`
            .artifact-btn {
              height: 32px;
              padding: 0 12px;
              border-radius: var(--r-sm);
              border: 1px solid var(--border-mid);
              background: var(--accent-pri);
              color: #08090d;
              font-size: .72rem;
              font-weight: 700;
              cursor: pointer;
            }
            .artifact-panel {
              border: 1px solid var(--border-dim);
              background: rgba(8, 9, 13, .42);
              border-radius: 4px;
              padding: 12px;
            }
            .artifact-panel h4 {
              margin: 0 0 6px;
              color: var(--text-bright);
              font-size: .82rem;
              font-weight: 700;
            }
            .artifact-panel p,
            .artifact-panel li {
              color: var(--text-base);
              font-size: .78rem;
              line-height: 1.6;
            }
            .artifact-panel ul {
              margin: 0;
              padding-left: 16px;
            }
            .artifact-panel pre {
              white-space: pre-wrap;
              overflow-x: auto;
              margin: 8px 0 0;
              padding: 10px;
              border-radius: 4px;
              background: #08090d;
              color: var(--accent-green);
              font-size: .72rem;
            }
            .artifact-image {
              width: 100%;
              aspect-ratio: 1 / 1;
              object-fit: cover;
              border-radius: 4px;
              border: 1px solid var(--border-dim);
              background: rgba(8, 9, 13, .58);
            }
            .artifact-image-actions {
              display: flex;
              gap: 8px;
              margin-top: 10px;
            }
            .artifact-link-btn {
              display: inline-flex;
              align-items: center;
              justify-content: center;
              min-height: 30px;
              padding: 0 10px;
              border-radius: 4px;
              border: 1px solid var(--border-mid);
              background: rgba(8, 9, 13, .42);
              color: var(--text-base);
              font-size: .72rem;
              cursor: pointer;
              text-decoration: none;
            }
            .artifact-link-btn:hover {
              border-color: var(--accent-pri);
              color: var(--text-bright);
            }
          `}
        />
      </div>
    );
  },
);

interface TypingIndicatorProps {
  language: Language;
}

export const TypingIndicator = component$<TypingIndicatorProps>(
  ({ language }) => (
    <div class="flex items-center gap-2 py-1 animate-[fadeIn_.2s_both]">
      <div class="flex gap-1">
        <span
          class="w-1.5 h-1.5 rounded-full bg-[var(--accent-pri)] block animate-[typingDot_1.2s_ease-in-out_infinite_both]"
          style={{ animationDelay: "0ms" }}
        />
        <span
          class="w-1.5 h-1.5 rounded-full bg-[var(--accent-pri)] block animate-[typingDot_1.2s_ease-in-out_infinite_both]"
          style={{ animationDelay: "160ms" }}
        />
        <span
          class="w-1.5 h-1.5 rounded-full bg-[var(--accent-pri)] block animate-[typingDot_1.2s_ease-in-out_infinite_both]"
          style={{ animationDelay: "320ms" }}
        />
      </div>
      <span class="text-[.72rem] text-[var(--text-muted)] font-mono animate-[pulse_2s_ease-in-out_infinite]">
        {t("AI is thinking…", language)}
      </span>
    </div>
  ),
);

interface WelcomeScreenProps {
  mode: ShellMode;
  placeholder: string;
  language: Language;
  userName?: string;
  onModeChange$?: QRL<(mode: ShellMode) => void>;
}

export const WelcomeScreen = component$<WelcomeScreenProps>(
  ({ mode, language, userName, onModeChange$ }) => {
    const greeting = useSignal("");

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(() => {
      const hour = new Date().getHours();
      const timeWord =
        hour < 12
          ? t("Good morning", language)
          : hour < 18
            ? t("Good afternoon", language)
            : t("Good evening", language);
      const firstName = userName?.split(" ")[0];
      greeting.value = firstName
        ? `${timeWord}, ${firstName}.`
        : `${timeWord}.`;
    });

    return (
      <div class="welcome flex flex-col items-center justify-center flex-1 gap-5 px-6 py-14 text-center animate-[fadeIn_.4s_both]">
        <div class="welcome-hero">
          <h1 class="welcome-greeting">{greeting.value || "\u00A0"}</h1>
          <p class="welcome-sub">
            {t("How can Shadow AI help you today?", language)}
          </p>
        </div>

        {onModeChange$ && (
          <div class="welcome-chips">
            {MODES.map((m) => (
              <button
                key={m.id}
                class={`welcome-chip ${m.id === mode ? "active" : ""}`}
                style={{ "--chip-color": m.color } as Record<string, string>}
                type="button"
                onClick$={() => onModeChange$(m.id as ShellMode)}
              >
                <span
                  class="welcome-chip-icon [&_svg]:w-[14px] [&_svg]:h-[14px]"
                  dangerouslySetInnerHTML={m.icon}
                />
                <span>{modeLabel(m.id as ShellMode, m.label, language)}</span>
              </button>
            ))}
          </div>
        )}

        <style
          dangerouslySetInnerHTML={`
          .welcome-hero {
            display: flex;
            flex-direction: column;
            gap: 8px;
            max-width: 600px;
          }
          .welcome-greeting {
            font-size: clamp(2rem, 5vw, 3rem);
            font-weight: 800;
            letter-spacing: -.04em;
            line-height: 1.04;
            color: var(--text-bright);
            margin: 0;
          }
          .welcome-sub {
            font-size: .95rem;
            color: var(--text-muted);
            margin: 0;
            line-height: 1.5;
          }
          .welcome-chips {
            display: flex;
            flex-wrap: wrap;
            gap: 8px;
            justify-content: center;
            max-width: 600px;
          }
          .welcome-chip {
            display: flex;
            align-items: center;
            gap: 6px;
            padding: 7px 14px;
            border-radius: 999px;
            border: 1px solid color-mix(in srgb, var(--chip-color) 22%, transparent);
            background: color-mix(in srgb, var(--chip-color) 6%, transparent);
            color: var(--text-base);
            cursor: pointer;
            font-size: .78rem;
            font-weight: 500;
            transition: all 120ms ease;
            white-space: nowrap;
            font-family: var(--font-body);
          }
          .welcome-chip:hover {
            border-color: color-mix(in srgb, var(--chip-color) 50%, transparent);
            background: color-mix(in srgb, var(--chip-color) 13%, transparent);
            color: var(--text-bright);
            transform: translateY(-1px);
            box-shadow: 0 4px 14px rgba(0,0,0,.25);
          }
          .welcome-chip.active {
            border-color: color-mix(in srgb, var(--chip-color) 60%, transparent);
            background: color-mix(in srgb, var(--chip-color) 16%, transparent);
            color: var(--text-bright);
            font-weight: 600;
          }
          .welcome-chip-icon {
            display: flex;
            align-items: center;
            color: var(--chip-color);
          }
        `}
        />
      </div>
    );
  },
);
