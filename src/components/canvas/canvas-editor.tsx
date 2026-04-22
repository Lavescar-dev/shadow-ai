import {
  component$,
  type QRL,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

// EditorView is a class instance — never stored in a Qwik signal.
// We key instances on the mount-point DOM node via a WeakMap so the
// Qwik serialiser never touches them.
let editorInstances: WeakMap<
  HTMLElement,
  import("@codemirror/view").EditorView
> | null = null;
function getMap() {
  if (!editorInstances) editorInstances = new WeakMap();
  return editorInstances;
}

// Re-entrancy guard: prevents the updateListener from calling onChange$
// when we dispatch a programmatic (AI-driven) document update.
let programmingUpdate = false;

interface CanvasEditorProps {
  value: string;
  language: string;
  diffLines?: number[];
  onChange$: QRL<(value: string) => void>;
}

export const CanvasEditor = component$<CanvasEditorProps>(
  ({ value, language, diffLines, onChange$ }) => {
    const mountRef = useSignal<HTMLElement>();
    const ready = useSignal(false);

    // Mount CodeMirror when the host element first becomes visible.
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(async ({ cleanup }) => {
      const host = mountRef.value;
      if (!host) return;

      const [
        { EditorState },
        { EditorView, keymap, lineNumbers, highlightActiveLine, drawSelection },
        { defaultKeymap, indentWithTab, history, historyKeymap },
        {
          defaultHighlightStyle,
          syntaxHighlighting,
          indentOnInput,
          bracketMatching,
          foldGutter,
        },
        { javascript },
        { css },
        { html },
        { autocompletion, closeBrackets },
        { oneDark },
      ] = await Promise.all([
        import("@codemirror/state"),
        import("@codemirror/view"),
        import("@codemirror/commands"),
        import("@codemirror/language"),
        import("@codemirror/lang-javascript"),
        import("@codemirror/lang-css"),
        import("@codemirror/lang-html"),
        import("@codemirror/autocomplete"),
        import("@codemirror/theme-one-dark"),
      ]);

      const { Decoration } = await import("@codemirror/view");
      const { StateEffect, StateField, RangeSetBuilder } = await import(
        "@codemirror/state"
      );

      // Language extension factory
      const langExt = (lang: string) => {
        if (lang === "tsx" || lang === "jsx")
          return javascript({ jsx: true, typescript: true });
        if (lang === "ts") return javascript({ typescript: true });
        if (lang === "js") return javascript();
        if (lang === "css") return css();
        if (lang === "html") return html();
        return javascript({ jsx: true, typescript: true });
      };

      // Diff decoration effect + field — must be defined before creating the state
      const setDiffEffect = StateEffect.define<number[]>();

      const diffField = StateField.define({
        create: () => Decoration.none,
        update(decos, tr) {
          for (const e of tr.effects) {
            if (e.is(setDiffEffect)) {
              const builder = new RangeSetBuilder<
                import("@codemirror/view").Decoration
              >();
              const sorted = [...e.value].sort((a, b) => a - b);
              for (const lineNum of sorted) {
                const oneBased = lineNum + 1;
                if (oneBased < 1 || oneBased > tr.state.doc.lines) continue;
                const lineObj = tr.state.doc.line(oneBased);
                builder.add(
                  lineObj.from,
                  lineObj.from,
                  Decoration.line({ class: "cm-diff-changed" }),
                );
              }
              return builder.finish();
            }
          }
          return decos.map(tr.changes);
        },
        provide: (f) => EditorView.decorations.from(f),
      });

      // Palette overrides to match Shadow AI dark theme
      const shadowTheme = EditorView.theme(
        {
          "&": {
            background: "#090b10",
            color: "#d9e1f2",
            height: "100%",
            borderRadius: "8px",
            border: "1px solid var(--border-dim)",
          },
          ".cm-scroller": {
            fontFamily: "var(--font-mono)",
            fontSize: ".84rem",
            lineHeight: "1.65",
          },
          ".cm-content": { padding: "16px 0" },
          ".cm-gutters": {
            background: "#090b10",
            borderRight: "1px solid #1e2233",
            color: "#4a5568",
          },
          ".cm-lineNumbers .cm-gutterElement": { padding: "0 10px" },
          ".cm-activeLine": { background: "rgba(255,255,255,.03)" },
          ".cm-activeLineGutter": { background: "transparent" },
          ".cm-cursor": { borderLeftColor: "#38bdf8" },
          ".cm-selectionBackground, ::selection": {
            background: "rgba(56,189,248,.22) !important",
          },
          ".cm-diff-changed": {
            background: "rgba(56,189,248,.10)",
            borderLeft: "2px solid #38bdf8",
            paddingLeft: "2px",
          },
        },
        { dark: true },
      );

      const state = EditorState.create({
        doc: value,
        extensions: [
          lineNumbers(),
          highlightActiveLine(),
          drawSelection(),
          history(),
          indentOnInput(),
          bracketMatching(),
          closeBrackets(),
          autocompletion(),
          foldGutter(),
          syntaxHighlighting(defaultHighlightStyle, { fallback: true }),
          keymap.of([indentWithTab, ...defaultKeymap, ...historyKeymap]),
          langExt(language),
          oneDark,
          shadowTheme,
          diffField,
          EditorView.updateListener.of((update) => {
            if (update.docChanged && !programmingUpdate) {
              onChange$(update.state.doc.toString());
            }
          }),
          EditorView.lineWrapping,
        ],
      });

      const view = new EditorView({ state, parent: host });
      getMap().set(host, view);

      // Expose the effect creator on the host element for updates
      (
        host as HTMLElement & { __setDiffEffect?: typeof setDiffEffect }
      ).__setDiffEffect = setDiffEffect;

      ready.value = true;

      cleanup(() => {
        view.destroy();
        getMap().delete(host);
        ready.value = false;
      });
    });

    // Controlled update: sync external `value` changes into CM without
    // destroying the editor or losing undo history.
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
      const nextValue = track(() => value);
      const host = mountRef.value;
      if (!host) return;
      const view = getMap().get(host);
      if (!view) return;
      if (view.state.doc.toString() === nextValue) return;
      programmingUpdate = true;
      view.dispatch({
        changes: { from: 0, to: view.state.doc.length, insert: nextValue },
      });
      programmingUpdate = false;
    });

    // Apply diff decorations when `diffLines` changes.
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
      const lines = track(() => diffLines);
      const host = mountRef.value;
      if (!host) return;
      const view = getMap().get(host);
      if (!view) return;
      const effectCreator = (
        host as HTMLElement & {
          __setDiffEffect?: import("@codemirror/state").StateEffectType<
            number[]
          >;
        }
      ).__setDiffEffect;
      if (!effectCreator) return;
      view.dispatch({ effects: effectCreator.of(lines ?? []) });
    });

    // Language changes require replacing the language extension.
    // The simplest approach for the small set of languages here is to
    // recreate the editor state (preserving the doc) when language changes.
    // eslint-disable-next-line qwik/no-use-visible-task
    useVisibleTask$(({ track }) => {
      // Only react to language changes after mount
      track(() => language);
      track(() => ready.value);
      const host = mountRef.value;
      if (!host || !ready.value) return;
      const view = getMap().get(host);
      if (!view) return;
      // Trigger a re-parse by reconfiguring the compartment is complex;
      // a simpler approach: the editor already has the correct language set
      // at creation time (value of `language` is captured then). Language
      // switches in canvas (tsx/css/html via file tab) cause a full
      // component remount via the `key` prop in canvas-workbench.tsx.
    });

    return (
      <div
        ref={mountRef}
        class="canvas-editor-host"
        style={{
          width: "100%",
          height: "100%",
          minHeight: "320px",
          overflow: "hidden",
        }}
      />
    );
  },
);
