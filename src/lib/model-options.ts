import type { ShellMode } from "./types";
import type { Language } from "./i18n";

export interface ModelOption {
  value: string;
  label: string;
}

export const AUTO_MODEL_VALUE = "__auto__";

const MODEL_IDS = {
  gptOss120b: "openai/gpt-oss-120b:free",
  gptOss20b: "openai/gpt-oss-20b:free",
  qwenNext80b: "qwen/qwen3-next-80b-a3b-instruct:free",
  qwenCoder: "qwen/qwen3-coder:free",
  glm45Air: "z-ai/glm-4.5-air:free",
  nemotron30b: "nvidia/nemotron-3-nano-30b-a3b:free",
  fluxSchnell: "@cf/black-forest-labs/flux-1-schnell",
} as const;

const BASE_OPTIONS: Partial<Record<ShellMode, Array<{ value: string; label: string }>>> = {
  chat: [
    { value: MODEL_IDS.gptOss120b, label: "GPT OSS 120B" },
    { value: MODEL_IDS.qwenNext80b, label: "Qwen3 Next 80B" },
    { value: MODEL_IDS.gptOss20b, label: "GPT OSS 20B" },
    { value: MODEL_IDS.glm45Air, label: "GLM 4.5 Air" },
    { value: MODEL_IDS.nemotron30b, label: "Nemotron 30B" },
  ],
  content: [
    { value: MODEL_IDS.qwenNext80b, label: "Qwen3 Next 80B" },
    { value: MODEL_IDS.gptOss120b, label: "GPT OSS 120B" },
    { value: MODEL_IDS.glm45Air, label: "GLM 4.5 Air" },
    { value: MODEL_IDS.gptOss20b, label: "GPT OSS 20B" },
  ],
  code: [
    { value: MODEL_IDS.qwenCoder, label: "Qwen3 Coder" },
    { value: MODEL_IDS.qwenNext80b, label: "Qwen3 Next 80B" },
    { value: MODEL_IDS.gptOss120b, label: "GPT OSS 120B" },
    { value: MODEL_IDS.gptOss20b, label: "GPT OSS 20B" },
  ],
  canvas: [
    { value: MODEL_IDS.qwenCoder, label: "Qwen3 Coder" },
    { value: MODEL_IDS.qwenNext80b, label: "Qwen3 Next 80B" },
    { value: MODEL_IDS.gptOss20b, label: "GPT OSS 20B" },
    { value: MODEL_IDS.gptOss120b, label: "GPT OSS 120B" },
    { value: MODEL_IDS.nemotron30b, label: "Nemotron 30B" },
  ],
  email: [
    { value: MODEL_IDS.gptOss20b, label: "GPT OSS 20B" },
    { value: MODEL_IDS.qwenNext80b, label: "Qwen3 Next 80B" },
    { value: MODEL_IDS.gptOss120b, label: "GPT OSS 120B" },
  ],
  video: [
    { value: MODEL_IDS.qwenNext80b, label: "Qwen3 Next 80B" },
    { value: MODEL_IDS.gptOss20b, label: "GPT OSS 20B" },
    { value: MODEL_IDS.gptOss120b, label: "GPT OSS 120B" },
  ],
  seo: [
    { value: MODEL_IDS.glm45Air, label: "GLM 4.5 Air" },
    { value: MODEL_IDS.qwenNext80b, label: "Qwen3 Next 80B" },
    { value: MODEL_IDS.gptOss20b, label: "GPT OSS 20B" },
  ],
  image: [{ value: MODEL_IDS.fluxSchnell, label: "Workers AI Flux Schnell" }],
  voice: [
    { value: MODEL_IDS.gptOss20b, label: "GPT OSS 20B" },
    { value: MODEL_IDS.qwenNext80b, label: "Qwen3 Next 80B" },
  ],
  resume: [
    { value: MODEL_IDS.gptOss120b, label: "GPT OSS 120B" },
    { value: MODEL_IDS.qwenNext80b, label: "Qwen3 Next 80B" },
    { value: MODEL_IDS.gptOss20b, label: "GPT OSS 20B" },
  ],
  bot: [
    { value: MODEL_IDS.qwenNext80b, label: "Qwen3 Next 80B" },
    { value: MODEL_IDS.gptOss120b, label: "GPT OSS 120B" },
    { value: MODEL_IDS.gptOss20b, label: "GPT OSS 20B" },
  ],
};

export function getModelOptionsForMode(
  mode: ShellMode,
  language: Language,
): ModelOption[] {
  const autoLabel =
    language === "tr" ? "Otomatik (önerilen)" : "Auto (recommended)";
  const modeLabel = language === "tr" ? "Mode stack" : "Mode stack";
  const options = BASE_OPTIONS[mode] ?? [];

  return [
    {
      value: AUTO_MODEL_VALUE,
      label: `${autoLabel} · ${modeLabel}`,
    },
    ...options,
  ];
}
