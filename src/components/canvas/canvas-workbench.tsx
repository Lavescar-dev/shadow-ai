import {
  $,
  component$,
  type QRL,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";
import { CanvasEditor } from "~/components/canvas/canvas-editor";

import {
  createDefaultCanvasWorkspace,
  buildCanvasPreviewDocument,
  canvasFileLanguage,
  type CanvasPreviewEvent,
  workspaceFiles,
} from "~/lib/canvas";
import { t, type Language } from "~/lib/i18n";
import type { CanvasTemplate, CanvasWorkspaceData } from "~/lib/types";
import { isCanvasPreviewSource } from "../../../shared/branding";

interface CanvasWorkbenchProps {
  workspace: CanvasWorkspaceData;
  language: Language;
  status: string;
  isGenerating?: boolean;
  generationLabel?: string;
  generationStep?: number;
  generationTotal?: number;
  mobileTab: "chat" | "code" | "preview";
  onWorkspaceChange$: QRL<(workspace: CanvasWorkspaceData) => void>;
  canUndoHistory?: boolean;
  onUndo$?: QRL<() => void>;
  onReset$?: QRL<() => void>;
  diffLines?: Record<string, number[]> | null;
  onAcceptDiff$?: QRL<() => void>;
  onRevertDiff$?: QRL<() => void>;
}

type PreviewDevice = "desktop" | "tablet" | "mobile";
type DesktopCanvasView = "code" | "preview" | "split";

const DEVICE_WIDTH: Record<PreviewDevice, string> = {
  desktop: "100%",
  tablet: "820px",
  mobile: "390px",
};

export const CanvasWorkbench = component$<CanvasWorkbenchProps>(
  ({
    workspace,
    language,
    status,
    isGenerating,
    generationLabel,
    generationStep,
    generationTotal,
    mobileTab,
    onWorkspaceChange$,
    canUndoHistory,
    onUndo$,
    onReset$,
    diffLines,
    onAcceptDiff$,
    onRevertDiff$,
  }) => {
    const previewDoc = useSignal(buildCanvasPreviewDocument(workspace));
    const previewDevice = useSignal<PreviewDevice>("desktop");
    const desktopView = useSignal<DesktopCanvasView>("preview");
    const diagnostics = useSignal<CanvasPreviewEvent[]>([]);
    const diagnosticsPanelOpen = useSignal(true);
    const splitPercent = useSignal(52);

    const setTemplate = $((template: CanvasTemplate) => {
      const nextWorkspace: CanvasWorkspaceData = {
        ...(template === workspace.template
          ? workspace
          : createDefaultCanvasWorkspace(template)),
        template,
      };
      desktopView.value = "code";
      onWorkspaceChange$(nextWorkspace);
    });

    const updateActiveFile = $((path: string) => {
      desktopView.value = "code";
      onWorkspaceChange$({
        ...workspace,
        activeFile: path,
      });
    });

    const updateFileContent = $((value: string) => {
      onWorkspaceChange$({
        ...workspace,
        files: {
          ...workspace.files,
          [workspace.activeFile]: value,
        },
        updatedAt: Date.now(),
      });
    });

    const refreshPreview = $(() => {
      diagnostics.value = [];
      desktopView.value = "preview";
      previewDoc.value = buildCanvasPreviewDocument(workspace);
    });

    const downloadWorkspace = $(() => {
      const doc = buildCanvasPreviewDocument(workspace);
      const blob = new Blob([doc], { type: "text/html" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `canvas-${workspace.template}-${Date.now()}.html`;
      a.click();
      URL.revokeObjectURL(url);
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track, cleanup }) => {
      track(() => workspace.template);
      track(() => workspace.activeFile);
      track(() => JSON.stringify(workspace.files));

      const timeout = window.setTimeout(() => {
        diagnostics.value = [];
        previewDoc.value = buildCanvasPreviewDocument(workspace);
      }, 320);

      cleanup(() => window.clearTimeout(timeout));
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
      const listener = (event: MessageEvent) => {
        const payload = event.data as
          | ({ source?: string } & CanvasPreviewEvent)
          | undefined;
        if (!payload || !isCanvasPreviewSource(payload.source)) {
          return;
        }

        diagnostics.value = [...diagnostics.value.slice(-7), payload];
      };

      window.addEventListener("message", listener);
      cleanup(() => window.removeEventListener("message", listener));
    });

    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
      const nextTab = track(() => mobileTab);
      if (nextTab === "code" || nextTab === "preview") {
        desktopView.value = nextTab;
      }
    });

    // Load saved split ratio and wire up imperative drag handling
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ cleanup }) => {
      const stored = localStorage.getItem("nx-canvas-split");
      if (stored) {
        const n = parseInt(stored, 10);
        if (n >= 25 && n <= 75) splitPercent.value = n;
      }

      const handle = document.querySelector<HTMLElement>(
        ".canvas-split-handle",
      );
      const body = document.querySelector<HTMLElement>(
        ".canvas-workbench-body",
      );
      if (!handle || !body) return;

      let dragging = false;

      const onDown = (e: PointerEvent) => {
        dragging = true;
        handle.setPointerCapture(e.pointerId);
      };
      const onMove = (e: PointerEvent) => {
        if (!dragging) return;
        const rect = body.getBoundingClientRect();
        const pct = Math.round(((e.clientX - rect.left) / rect.width) * 100);
        splitPercent.value = Math.max(25, Math.min(75, pct));
      };
      const onUp = () => {
        if (!dragging) return;
        dragging = false;
        try {
          localStorage.setItem("nx-canvas-split", String(splitPercent.value));
        } catch (e) {
          void e;
        }
      };

      handle.addEventListener("pointerdown", onDown);
      handle.addEventListener("pointermove", onMove);
      handle.addEventListener("pointerup", onUp);

      cleanup(() => {
        handle.removeEventListener("pointerdown", onDown);
        handle.removeEventListener("pointermove", onMove);
        handle.removeEventListener("pointerup", onUp);
      });
    });

    const activeContent = workspace.files[workspace.activeFile] ?? "";
    const editorVisibleMobile = mobileTab !== "preview";
    const previewVisibleMobile = mobileTab !== "code";
    const editorVisibleDesktop = desktopView.value !== "preview";
    const previewVisibleDesktop = desktopView.value !== "code";
    const splitDesktop = desktopView.value === "split";

    return (
      <div class="canvas-workbench flex-1 min-h-0 flex flex-col">
        {isGenerating && (
          <div class="canvas-generation-banner">
            <div class="canvas-generation-copy">
              <div class="canvas-generation-title-row">
                <span class="canvas-generation-spinner" />
                <strong>
                  {generationLabel || t("Canvas is generating...", language)}
                </strong>
              </div>
              <p>
                {t(
                  "Live preview will refresh automatically when the files are ready.",
                  language,
                )}
              </p>
            </div>
            <div class="canvas-generation-meta">
              <span class="canvas-generation-step">
                {Math.max(1, generationStep || 1)}/
                {Math.max(1, generationTotal || 1)}
              </span>
              <span class="canvas-generation-rail">
                <span
                  class="canvas-generation-rail-fill"
                  style={{
                    width: `${Math.max(
                      18,
                      Math.round(
                        ((generationStep || 1) /
                          Math.max(1, generationTotal || 1)) *
                          100,
                      ),
                    )}%`,
                  }}
                />
              </span>
            </div>
          </div>
        )}
        <div class="canvas-desktop-viewbar hidden lg:flex">
          <div class="canvas-toolbar-group">
            <label class="canvas-toolbar-label">{t("Layout", language)}</label>
            <div class="canvas-file-tabs">
              {(
                [
                  ["code", t("Code", language)],
                  ["preview", t("Preview", language)],
                  ["split", t("Split", language)],
                ] as const
              ).map(([view, label]) => (
                <button
                  key={view}
                  class={`canvas-file-tab ${desktopView.value === view ? "active" : ""}`}
                  type="button"
                  onClick$={() => {
                    desktopView.value = view;
                  }}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div
          class={`canvas-workbench-body flex-1 min-h-0 flex flex-col ${splitDesktop ? "lg:flex-row" : ""}`}
        >
          <div
            class={`${editorVisibleMobile ? "flex" : "hidden"} ${editorVisibleDesktop ? "lg:flex" : "lg:hidden"} flex-col min-h-0 ${splitDesktop ? "" : "lg:flex-1"}`}
            style={
              splitDesktop ? { width: splitPercent.value + "%" } : undefined
            }
          >
            <div class="canvas-toolbar">
              <div class="canvas-toolbar-group">
                <label class="canvas-toolbar-label">
                  {t("Template", language)}
                </label>
                <select
                  class="canvas-select"
                  value={workspace.template}
                  onChange$={(event) =>
                    setTemplate(
                      (event.target as HTMLSelectElement)
                        .value as CanvasTemplate,
                    )
                  }
                >
                  <option value="react">React</option>
                  <option value="html">HTML</option>
                </select>
              </div>

              <div class="canvas-toolbar-group">
                <label class="canvas-toolbar-label">
                  {t("File", language)}
                </label>
                <div class="canvas-file-tabs">
                  {workspaceFiles(workspace.template).map((path) => (
                    <button
                      key={path}
                      class={`canvas-file-tab ${workspace.activeFile === path ? "active" : ""}`}
                      type="button"
                      onClick$={() => updateActiveFile(path)}
                    >
                      {path}
                    </button>
                  ))}
                </div>
              </div>

              <div class="canvas-toolbar-actions">
                <span class="canvas-language-badge">
                  {canvasFileLanguage(workspace.activeFile)}
                </span>
                {canUndoHistory && onUndo$ && (
                  <button
                    class="canvas-toolbar-btn"
                    type="button"
                    onClick$={onUndo$}
                  >
                    {t("Undo AI", language)}
                  </button>
                )}
                <button
                  class="canvas-toolbar-btn"
                  type="button"
                  onClick$={downloadWorkspace}
                >
                  {t("Download", language)}
                </button>
                {onReset$ && (
                  <button
                    class="canvas-toolbar-btn"
                    type="button"
                    onClick$={onReset$}
                  >
                    {t("Reset template", language)}
                  </button>
                )}
                <button
                  class="canvas-run-btn"
                  type="button"
                  onClick$={refreshPreview}
                >
                  {t("Run", language)}
                </button>
              </div>
            </div>

            <div class="canvas-editor-status">
              <span>{status}</span>
              {diffLines &&
                diffLines[workspace.activeFile]?.length > 0 &&
                onAcceptDiff$ &&
                onRevertDiff$ && (
                  <span class="canvas-diff-actions">
                    <button
                      class="canvas-diff-btn canvas-diff-accept"
                      type="button"
                      onClick$={onAcceptDiff$}
                    >
                      {t("Accept", language)}
                    </button>
                    <button
                      class="canvas-diff-btn canvas-diff-revert"
                      type="button"
                      onClick$={onRevertDiff$}
                    >
                      {t("Revert", language)}
                    </button>
                  </span>
                )}
            </div>

            <div class="canvas-editor-pane">
              <CanvasEditor
                key={`${workspace.template}:${workspace.activeFile}`}
                value={activeContent}
                language={canvasFileLanguage(workspace.activeFile)}
                diffLines={diffLines?.[workspace.activeFile]}
                onChange$={updateFileContent}
              />
            </div>
          </div>

          {splitDesktop && <div class="canvas-split-handle hidden lg:block" />}

          <div
            class={`${previewVisibleMobile ? "flex" : "hidden"} ${previewVisibleDesktop ? "lg:flex" : "lg:hidden"} flex-col min-h-0 ${splitDesktop ? "" : "lg:flex-1"}`}
            style={
              splitDesktop
                ? { width: 100 - splitPercent.value + "%" }
                : undefined
            }
          >
            <div class="canvas-toolbar border-b border-[var(--border-dim)]">
              <div class="canvas-toolbar-group">
                <label class="canvas-toolbar-label">
                  {t("Preview", language)}
                </label>
                <div class="canvas-file-tabs">
                  {(["desktop", "tablet", "mobile"] as PreviewDevice[]).map(
                    (device) => (
                      <button
                        key={device}
                        class={`canvas-file-tab ${previewDevice.value === device ? "active" : ""}`}
                        type="button"
                        onClick$={() => {
                          previewDevice.value = device;
                        }}
                      >
                        {t(
                          device === "desktop"
                            ? "Desktop"
                            : device === "tablet"
                              ? "Tablet"
                              : "Mobile",
                          language,
                        )}
                      </button>
                    ),
                  )}
                </div>
              </div>
            </div>

            <div class="canvas-preview-pane">
              <div
                class="canvas-preview-frame-shell"
                style={{ width: DEVICE_WIDTH[previewDevice.value] }}
              >
                <iframe
                  key={`${workspace.template}:${previewDevice.value}:${previewDoc.value.length}`}
                  class="canvas-preview-frame"
                  srcdoc={previewDoc.value}
                  sandbox="allow-scripts"
                  title="Canvas preview"
                />
              </div>
            </div>

            <div class="canvas-diagnostics">
              <div class="canvas-diagnostics-header">
                <span class="canvas-toolbar-label">Console</span>
                {diagnostics.value.length > 0 && (
                  <span class="canvas-diagnostics-count">
                    {diagnostics.value.length}
                  </span>
                )}
                <button
                  class="canvas-diagnostics-toggle"
                  type="button"
                  onClick$={() => {
                    diagnosticsPanelOpen.value = !diagnosticsPanelOpen.value;
                  }}
                >
                  {diagnosticsPanelOpen.value ? "▾" : "▸"}
                </button>
              </div>
              {diagnosticsPanelOpen.value && (
                <div class="canvas-diagnostics-list">
                  {diagnostics.value.length === 0 ? (
                    <p class="canvas-diagnostic-empty">
                      {t("Preview is clean.", language)}
                    </p>
                  ) : (
                    diagnostics.value.map((item, index) => (
                      <div
                        key={`${item.type}-${index}`}
                        class={`canvas-diagnostic canvas-diagnostic--${item.level || item.type}`}
                      >
                        <span class="canvas-diagnostic-level">
                          {item.level || item.type}
                        </span>
                        <span>{item.message}</span>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        <style
          dangerouslySetInnerHTML={`
            .canvas-generation-banner {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 16px;
              padding: 12px 14px;
              border-bottom: 1px solid color-mix(in srgb, var(--accent-pri) 22%, var(--border-dim));
              background:
                linear-gradient(90deg, color-mix(in srgb, var(--accent-pri) 10%, transparent), transparent 45%),
                rgba(8, 9, 13, .38);
            }
            .canvas-generation-copy {
              display: flex;
              flex-direction: column;
              gap: 4px;
              min-width: 0;
            }
            .canvas-generation-title-row {
              display: flex;
              align-items: center;
              gap: 10px;
              color: var(--text-bright);
              font-size: .8rem;
            }
            .canvas-generation-copy p {
              margin: 0;
              color: var(--text-dim);
              font-size: .74rem;
              line-height: 1.55;
            }
            .canvas-generation-spinner {
              width: 11px;
              height: 11px;
              border-radius: 999px;
              border: 2px solid color-mix(in srgb, var(--accent-pri) 18%, transparent);
              border-top-color: var(--accent-pri);
              animation: canvas-spin .85s linear infinite;
              flex-shrink: 0;
            }
            .canvas-generation-meta {
              width: min(180px, 32%);
              min-width: 140px;
              display: flex;
              flex-direction: column;
              align-items: flex-end;
              gap: 8px;
            }
            .canvas-generation-step {
              font-size: .68rem;
              font-family: var(--font-mono);
              color: var(--text-dim);
              letter-spacing: .12em;
            }
            .canvas-generation-rail {
              width: 100%;
              height: 6px;
              border-radius: 999px;
              overflow: hidden;
              background: rgba(255, 255, 255, .08);
              position: relative;
            }
            .canvas-generation-rail-fill {
              display: block;
              height: 100%;
              border-radius: inherit;
              background:
                linear-gradient(90deg, color-mix(in srgb, var(--accent-pri) 60%, white), var(--accent-pri));
              box-shadow: 0 0 22px color-mix(in srgb, var(--accent-pri) 45%, transparent);
              transition: width 220ms ease;
            }
            .canvas-desktop-viewbar {
              align-items: center;
              justify-content: flex-end;
              gap: 12px;
              padding: 12px 14px 0;
            }
            .canvas-workbench-body {
              min-height: 0;
            }
            .canvas-split-handle {
              width: 4px;
              flex-shrink: 0;
              cursor: col-resize;
              background: var(--border-dim);
              transition: background 100ms;
              touch-action: none;
              user-select: none;
            }
            .canvas-split-handle:hover {
              background: var(--accent-pri);
            }
            .canvas-mobile-tabs {
              display: flex;
              gap: 8px;
              padding: 10px 14px 0;
              border-bottom: 1px solid var(--border-dim);
            }
            .canvas-mobile-tab,
            .canvas-file-tab,
            .canvas-run-btn,
            .canvas-select {
              height: 32px;
              border-radius: 4px;
              border: 1px solid var(--border-mid);
              background: rgba(8, 9, 13, .42);
              color: var(--text-base);
              font-size: .72rem;
            }
            .canvas-mobile-tab,
            .canvas-file-tab,
            .canvas-run-btn {
              padding: 0 10px;
              cursor: pointer;
            }
            .canvas-mobile-tab.active,
            .canvas-file-tab.active {
              border-color: var(--accent-pri);
              color: var(--text-bright);
              background: color-mix(in srgb, var(--accent-pri) 14%, transparent);
            }
            .canvas-toolbar {
              display: flex;
              align-items: center;
              justify-content: space-between;
              gap: 14px;
              padding: 12px 14px;
              flex-wrap: wrap;
              background: rgba(8, 9, 13, .3);
            }
            .canvas-toolbar-group {
              display: flex;
              align-items: center;
              gap: 10px;
              flex-wrap: wrap;
            }
            .canvas-toolbar-label {
              font-size: .66rem;
              font-family: var(--font-mono);
              text-transform: uppercase;
              letter-spacing: .12em;
              color: var(--text-dim);
            }
            .canvas-select {
              min-width: 96px;
              padding: 0 8px;
              outline: none;
            }
            .canvas-file-tabs {
              display: flex;
              align-items: center;
              gap: 8px;
              flex-wrap: wrap;
            }
            .canvas-toolbar-actions {
              display: flex;
              align-items: center;
              gap: 10px;
              margin-left: auto;
            }
            .canvas-language-badge {
              font-size: .66rem;
              font-family: var(--font-mono);
              color: var(--text-dim);
              text-transform: uppercase;
              letter-spacing: .12em;
            }
            .canvas-run-btn {
              background: color-mix(in srgb, var(--accent-pri) 16%, transparent);
              border-color: color-mix(in srgb, var(--accent-pri) 35%, transparent);
            }
            .canvas-toolbar-btn {
              height: 32px;
              padding: 0 10px;
              border-radius: 4px;
              border: 1px solid var(--border-mid);
              background: rgba(8, 9, 13, .42);
              color: var(--text-base);
              font-size: .72rem;
              cursor: pointer;
            }
            .canvas-toolbar-btn:hover {
              background: rgba(255, 255, 255, .06);
            }
            .canvas-editor-status {
              padding: 0 14px 10px;
              font-size: .68rem;
              color: var(--text-dim);
              font-family: var(--font-mono);
              display: flex;
              align-items: center;
              gap: 12px;
              flex-wrap: wrap;
            }
            .canvas-diff-actions {
              display: flex;
              gap: 6px;
              margin-left: auto;
            }
            .canvas-diff-btn {
              height: 24px;
              padding: 0 10px;
              border-radius: 4px;
              border: 1px solid;
              font-size: .68rem;
              cursor: pointer;
              font-family: var(--font-mono);
            }
            .canvas-diff-accept {
              background: rgba(56,189,248,.14);
              border-color: rgba(56,189,248,.4);
              color: #38bdf8;
            }
            .canvas-diff-revert {
              background: rgba(252,165,165,.10);
              border-color: rgba(252,165,165,.35);
              color: #fca5a5;
            }
            .canvas-editor-pane,
            .canvas-preview-pane {
              flex: 1;
              min-height: 0;
              padding: 0 14px 14px;
            }
            .canvas-editor {
              width: 100%;
              height: 100%;
              min-height: 320px;
              resize: none;
              border: 1px solid var(--border-dim);
              border-radius: 8px;
              background: #090b10;
              color: #d9e1f2;
              outline: none;
              font-family: var(--font-mono);
              font-size: .84rem;
              line-height: 1.65;
              padding: 16px;
              tab-size: 2;
            }
            .canvas-preview-pane {
              display: grid;
              place-items: start center;
              overflow: auto;
            }
            .canvas-preview-frame-shell {
              min-height: 100%;
              max-width: 100%;
              transition: width 180ms ease;
            }
            .canvas-preview-frame {
              width: 100%;
              min-height: 640px;
              border: 1px solid var(--border-dim);
              border-radius: 10px;
              background: white;
            }
            .canvas-diagnostics {
              border-top: 1px solid var(--border-dim);
              background: rgba(8, 9, 13, .32);
            }
            .canvas-diagnostics-header {
              display: flex;
              align-items: center;
              gap: 8px;
              padding: 8px 14px;
            }
            .canvas-diagnostics-count {
              font-size: .66rem;
              font-family: var(--font-mono);
              background: rgba(255,255,255,.1);
              color: var(--text-dim);
              border-radius: 10px;
              padding: 1px 7px;
            }
            .canvas-diagnostics-toggle {
              margin-left: auto;
              background: none;
              border: none;
              color: var(--text-dim);
              cursor: pointer;
              font-size: .82rem;
              padding: 2px 4px;
              line-height: 1;
            }
            .canvas-diagnostics-list {
              padding: 0 14px 12px;
              display: flex;
              flex-direction: column;
              gap: 6px;
              max-height: 140px;
              overflow: auto;
            }
            .canvas-diagnostic-empty {
              margin: 0;
              font-size: .74rem;
              color: var(--text-dim);
            }
            .canvas-diagnostic {
              display: flex;
              gap: 10px;
              font-size: .74rem;
              color: var(--text-base);
              line-height: 1.5;
            }
            .canvas-diagnostic--error,
            .canvas-diagnostic--error .canvas-diagnostic-level {
              color: #fca5a5;
            }
            .canvas-diagnostic--warn,
            .canvas-diagnostic--warn .canvas-diagnostic-level {
              color: #fcd34d;
            }
            .canvas-diagnostic--log .canvas-diagnostic-level {
              color: #93c5fd;
            }
            .canvas-diagnostic-level {
              font-family: var(--font-mono);
              text-transform: uppercase;
              letter-spacing: .1em;
              color: var(--text-dim);
              flex-shrink: 0;
            }
            @keyframes canvas-spin {
              to {
                transform: rotate(360deg);
              }
            }
            @media (max-width: 1023px) {
              .canvas-generation-banner {
                align-items: flex-start;
                flex-direction: column;
              }
              .canvas-generation-meta {
                width: 100%;
                min-width: 0;
                align-items: flex-start;
              }
            }
          `}
        />
      </div>
    );
  },
);
