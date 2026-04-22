import {
  $,
  component$,
  type QRL,
  useOnDocument,
  useSignal,
} from "@builder.io/qwik";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectProps {
  options: SelectOption[];
  value: string;
  label?: string;
  onChange$?: QRL<(value: string) => void>;
}

export const Select = component$<SelectProps>(
  ({ options, value, label, onChange$ }) => {
    const open = useSignal(false);
    const rootRef = useSignal<HTMLDivElement>();

    useOnDocument(
      "click",
      $((e) => {
        if (rootRef.value && !rootRef.value.contains(e.target as Node)) {
          open.value = false;
        }
      }),
    );

    const current = options.find((o) => o.value === value) ?? options[0];

    return (
      <div class="select-root relative" ref={rootRef}>
        {label && (
          <span class="text-[.65rem] font-mono text-[var(--text-dim)] mr-1.5 whitespace-nowrap">
            {label}
          </span>
        )}
        <button
          class={`select-trigger flex items-center gap-1.5 h-7 px-2.5 rounded-[3px] border text-[.75rem] font-medium cursor-pointer transition-all duration-[160ms] whitespace-nowrap ${open.value ? "open" : ""}`}
          onClick$={() => {
            open.value = !open.value;
          }}
          type="button"
        >
          <span class="select-value">{current.label}</span>
          <svg
            width="11"
            height="11"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
            class="select-chevron transition-transform duration-[160ms] opacity-50"
            style={{
              transform: open.value ? "rotate(180deg)" : "rotate(0deg)",
            }}
          >
            <path d="M6 9l6 6 6-6" />
          </svg>
        </button>

        {open.value && (
          <div class="select-menu absolute top-[calc(100%+4px)] left-0 min-w-[140px] rounded-[4px] border overflow-hidden z-[200] animate-[slideDown_.15s_both]">
            {options.map((opt) => (
              <button
                key={opt.value}
                class={`select-option w-full text-left px-3 py-1.5 text-[.75rem] cursor-pointer border-none transition-all duration-[100ms] ${opt.value === current.value ? "active" : ""}`}
                onClick$={() => {
                  onChange$?.(opt.value);
                  open.value = false;
                }}
                type="button"
              >
                {opt.label}
                {opt.value === current.value && (
                  <svg
                    class="inline-block ml-auto float-right mt-0.5 opacity-70"
                    width="11"
                    height="11"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2.5"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                )}
              </button>
            ))}
          </div>
        )}

        <style
          dangerouslySetInnerHTML={`
        .select-trigger {
          background: var(--bg-elevated);
          border-color: var(--border-mid);
          color: var(--text-base);
        }
        .select-trigger:hover {
          background: var(--bg-hover);
          border-color: var(--border-lit);
          color: var(--text-bright);
        }
        .select-trigger.open {
          background: var(--bg-hover);
          border-color: var(--accent-pri);
          color: var(--text-bright);
          box-shadow: 0 0 0 2px color-mix(in srgb, var(--accent-pri) 15%, transparent);
        }
        .select-trigger.open .select-chevron {
          opacity: 0.9;
        }

        .select-menu {
          background: var(--bg-elevated);
          border-color: var(--border-mid);
          box-shadow: 0 8px 32px rgba(0,0,0,.5), 0 0 0 1px rgba(255,255,255,.04);
        }

        .select-option {
          background: transparent;
          color: var(--text-muted);
        }
        .select-option:hover {
          background: var(--bg-hover);
          color: var(--text-bright);
        }
        .select-option.active {
          color: var(--text-bright);
          background: color-mix(in srgb, var(--accent-pri) 8%, var(--bg-elevated));
        }
      `}
        />
      </div>
    );
  },
);
