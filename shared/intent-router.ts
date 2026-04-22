import type { ShellMode } from "./mode-contracts";

export type IntentKind = "mode" | "meta";

export interface IntentRoute {
  kind: IntentKind;
  mode: ShellMode;
  confidence: "high" | "low";
  reason: string;
}

const MODE_COMMANDS: Record<string, ShellMode> = {
  chat: "chat",
  content: "content",
  code: "code",
  canvas: "canvas",
  email: "email",
  video: "video",
  seo: "seo",
  image: "image",
  voice: "voice",
  resume: "resume",
  bot: "bot",
};

const MODE_KEYWORDS: Array<{
  mode: Exclude<ShellMode, "chat">;
  reason: string;
  patterns: RegExp[];
}> = [
  {
    mode: "resume",
    reason: "resume-cv-request",
    patterns: [
      /\b(cv|resume|ats)\b/i,
      /öz\s*geçmiş/i,
      /özgeçmiş/i,
      /kariyer profili/i,
      /pdf.*\b(cv|resume)\b/i,
    ],
  },
  {
    mode: "code",
    reason: "code-request",
    patterns: [
      /\b(code|coding|bug|debug|refactor|component|function|api|sql)\b/i,
      /\b(react|typescript|javascript|python|rust|go|node|qwik|svelte)\b/i,
      /\bkod\b/i,
      /hata.*(çöz|bul|fix)/i,
    ],
  },
  {
    mode: "canvas",
    reason: "canvas-preview-request",
    patterns: [
      /\b(canvas|playground|live preview|preview panel)\b/i,
      /\b(frontend preview|component preview|ui playground)\b/i,
      /\b(canli onizleme|canlı önizleme|preview workspace)\b/i,
      /\b(sağ panel|sag panel).*(onizleme|önizleme)/i,
    ],
  },
  {
    mode: "email",
    reason: "email-request",
    patterns: [
      /\b(email|mail|newsletter|subject|follow-up|cold outreach)\b/i,
      /e-?posta/i,
      /mail.*(yaz|taslak|cevap)/i,
    ],
  },
  {
    mode: "seo",
    reason: "seo-request",
    patterns: [
      /\b(seo|keyword|backlink|serp|meta title|meta description)\b/i,
      /anahtar kelime/i,
      /site.*analiz/i,
      /içerik boşluğu/i,
    ],
  },
  {
    mode: "bot",
    reason: "bot-persona-request",
    patterns: [
      /\b(bot|chatbot|persona|system prompt)\b/i,
      /asistan.*(oluştur|tasarla|kur)/i,
      /bot.*(oluştur|tasarla|kur)/i,
    ],
  },
  {
    mode: "video",
    reason: "video-script-request",
    patterns: [
      /\b(video|youtube|tiktok|reels|shorts|script|senaryo)\b/i,
      /video.*(metni|senaryo|akış|çekim)/i,
    ],
  },
  {
    mode: "image",
    reason: "image-prompt-request",
    patterns: [
      /\b(image|photo|picture|poster|logo|illustration|prompt)\b/i,
      /\b(görsel|fotoğraf|resim|afiş|illüstrasyon)\b/i,
      /görsel.*(oluştur|üret|tasarla)/i,
    ],
  },
  {
    mode: "voice",
    reason: "voice-script-request",
    patterns: [
      /\b(voice|tts|speech|ssml|podcast|audio)\b/i,
      /\b(ses|konuşma|seslendirme)\b/i,
      /metni.*sese/i,
    ],
  },
  {
    mode: "content",
    reason: "content-request",
    patterns: [
      /\b(content|article|blog|post|copy|landing page|caption)\b/i,
      /\b(içerik|makale|blog|metin|reklam metni|sosyal medya)\b/i,
      /yazı.*(yaz|oluştur|hazırla)/i,
    ],
  },
];

const META_PATTERNS = [
  /hangi model/i,
  /hangi modelsin/i,
  /modelin ne/i,
  /ne model/i,
  /kimsin/i,
  /sen kimsin/i,
  /ne yapabiliyorsun/i,
  /yeteneklerin/i,
  /what model/i,
  /which model/i,
  /who are you/i,
  /what can you do/i,
];

export function routeUserInput(
  input: string,
  currentMode: ShellMode,
): IntentRoute {
  const trimmed = input.trim();
  const command = trimmed.match(/^\/([a-z]+)\b/i)?.[1]?.toLowerCase();
  const commandMode = command ? MODE_COMMANDS[command] : undefined;

  if (commandMode) {
    return {
      kind: commandMode === "chat" ? "mode" : "mode",
      mode: commandMode,
      confidence: "high",
      reason: "slash-command",
    };
  }

  if (isMetaIntent(trimmed)) {
    return {
      kind: "meta",
      mode: currentMode,
      confidence: "high",
      reason: "assistant-meta-question",
    };
  }

  // Once the user deliberately switches into a specialized mode, keep that
  // lane pinned unless they explicitly use a slash command.
  if (currentMode !== "chat") {
    return {
      kind: "mode",
      mode: currentMode,
      confidence: "high",
      reason: "keep-selected-mode",
    };
  }

  for (const item of MODE_KEYWORDS) {
    if (item.patterns.some((pattern) => pattern.test(trimmed))) {
      return {
        kind: "mode",
        mode: item.mode,
        confidence: "high",
        reason: item.reason,
      };
    }
  }

  return {
    kind: "mode",
    mode: currentMode,
    confidence: "low",
    reason: "keep-current-mode",
  };
}

export function isMetaIntent(input: string) {
  const trimmed = input.trim();
  if (/^(selam|merhaba|hello|hi)[!. ]*$/i.test(trimmed)) {
    return true;
  }
  return META_PATTERNS.some((pattern) => pattern.test(trimmed));
}
