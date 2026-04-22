import {
  ARTIFACT_SCHEMA_DESCRIPTION,
  type BotArtifactData,
  type CanvasArtifactData,
  type CanvasChange,
  type CanvasTemplate,
  type CanvasWorkspaceData,
  type GeneratedImageArtifact,
  type ModeArtifact,
  type ResumeArtifactData,
  type ResumeTemplate,
} from "../../shared/mode-contracts";
import { INTERNAL_ROUTER_MODEL, PRODUCT_NAME } from "../../shared/branding";
import { routeUserInput } from "../../shared/intent-router";
import * as fontkit from "@pdf-lib/fontkit";
import { PDFDocument, rgb, type PDFFont, type PDFPage } from "pdf-lib";

interface D1Database {
  prepare(query: string): D1PreparedStatement;
  batch<T = unknown>(statements: D1PreparedStatement[]): Promise<D1Result<T>[]>;
}

interface D1PreparedStatement {
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(columnName?: string): Promise<T | null>;
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
}

interface D1Result<T = unknown> {
  results?: T[];
  success: boolean;
  error?: string;
}

interface KVNamespace {
  get(key: string): Promise<string | null>;
  put(
    key: string,
    value: string,
    options?: { expirationTtl?: number },
  ): Promise<void>;
  delete(key: string): Promise<void>;
}

interface VectorizeIndex {
  query(
    vector: number[],
    options: {
      topK: number;
      returnMetadata?: "all" | boolean;
      filter?: Record<string, unknown>;
    },
  ): Promise<{
    matches: Array<{
      id: string;
      score: number;
      metadata?: Record<string, unknown>;
    }>;
  }>;
  insert?(vectors: VectorizeVector[]): Promise<unknown>;
  upsert?(vectors: VectorizeVector[]): Promise<unknown>;
}

interface VectorizeVector {
  id: string;
  values: number[];
  metadata?: Record<string, string | number | boolean>;
}

interface AiBinding {
  run(model: string, input: unknown): Promise<unknown>;
}

interface Env {
  DB: D1Database;
  RATE_LIMIT?: KVNamespace;
  MEMORY_INDEX?: VectorizeIndex;
  AI?: AiBinding;
  PUBLIC_ORIGIN?: string;
  API_PUBLIC_ORIGIN?: string;
  ALLOWED_ORIGIN?: string;
  GOOGLE_CLIENT_ID?: string;
  GOOGLE_CLIENT_SECRET?: string;
  GITHUB_CLIENT_ID?: string;
  GITHUB_CLIENT_SECRET?: string;
  OPENROUTER_API_KEY?: string;
  OPENROUTER_DEFAULT_MODEL?: string;
  OPENROUTER_MODEL_CHAT?: string;
  OPENROUTER_MODEL_CONTENT?: string;
  OPENROUTER_MODEL_CODE?: string;
  OPENROUTER_MODEL_CANVAS?: string;
  OPENROUTER_MODEL_EMAIL?: string;
  OPENROUTER_MODEL_VIDEO?: string;
  OPENROUTER_MODEL_SEO?: string;
  OPENROUTER_MODEL_IMAGE?: string;
  OPENROUTER_MODEL_VOICE?: string;
  OPENROUTER_MODEL_RESUME?: string;
  OPENROUTER_MODEL_BOT?: string;
  CF_IMAGE_MODEL?: string;
  OPENROUTER_APP_TITLE?: string;
  OPENROUTER_HTTP_REFERER?: string;
  OPENROUTER_JSON_TIMEOUT_MS?: string;
  PDF_FONT_REGULAR_URL?: string;
  PDF_FONT_BOLD_URL?: string;
  EMBEDDING_MODEL?: string;
  TURNSTILE_SECRET_KEY?: string;
  TURNSTILE_SITE_KEY?: string;
  REQUIRE_TURNSTILE?: string;
  IP_RATE_LIMIT_PER_MINUTE?: string;
  USER_DAILY_MESSAGE_LIMIT?: string;
  DAILY_CHAT_LIMIT?: string;
  DAILY_MODE_LIMIT?: string;
  DAILY_IMAGE_LIMIT?: string;
  DAILY_PDF_LIMIT?: string;
  SUPPORT_EMAIL?: string;
  CANVAS_BETA?: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<unknown>): void;
}

type ShellMode =
  | "chat"
  | "content"
  | "code"
  | "canvas"
  | "email"
  | "video"
  | "seo"
  | "image"
  | "voice"
  | "resume"
  | "bot";
type MessageRole = "system" | "user" | "assistant";

interface UserRow {
  id: string;
  email: string;
  name: string;
  avatar_url: string | null;
}

interface SessionUser extends UserRow {
  session_id: string;
}

interface ConversationRow {
  id: string;
  user_id: string;
  title: string;
  mode: ShellMode;
  model: string | null;
  created_at: number;
  updated_at: number;
}

interface MessageRow {
  id: string;
  conversation_id: string;
  user_id: string;
  role: MessageRole;
  mode: ShellMode;
  content: string;
  model: string | null;
  metadata?: string | null;
  created_at: number;
}

interface BotRow {
  id: string;
  user_id: string;
  name: string;
  description: string;
  system_prompt: string;
  tone: string;
  boundaries: string;
  starter_prompts: string;
  memory_policy: string;
  tools: string;
  created_at: number;
  updated_at: number;
  deleted_at?: number | null;
}

interface ArtifactRow {
  id: string;
  user_id: string;
  conversation_id: string;
  message_id: string;
  mode: ShellMode;
  type: string;
  title: string;
  payload: string;
  created_at: number;
  updated_at: number;
}

interface CanvasWorkspaceRow {
  conversation_id: string;
  user_id: string;
  template: CanvasTemplate;
  files_json: string;
  active_file: string;
  updated_at: number;
}

interface UserSettingsRow {
  user_id: string;
  preferred_language: "en" | "tr";
  onboarding_completed: number;
  created_at: number;
  updated_at: number;
}

interface DailyUsageCounterRow {
  user_id: string;
  capability: UsageCapability;
  day_key: string;
  count: number;
  updated_at: number;
}

interface OAuthState {
  provider: "google" | "github";
  codeVerifier?: string;
  redirectTo: string;
  createdAt: number;
}

interface OAuthProfile {
  provider: "google" | "github";
  providerUserId: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

interface ChatRequest {
  conversationId?: string | null;
  mode?: ShellMode;
  model?: string;
  message?: string;
  turnstileToken?: string;
  botId?: string | null;
}

interface ModeRunRequest {
  conversationId?: string | null;
  mode?: ShellMode;
  input?: string;
  model?: string;
  turnstileToken?: string;
  controls?: Record<string, unknown>;
}

interface CanvasWorkspaceRequest {
  workspace?: CanvasWorkspaceData;
}

interface ResumePdfRequest {
  artifact?: ModeArtifact;
  template?: ResumeTemplate;
}

interface BotUpdateRequest {
  name?: string;
  description?: string;
  systemPrompt?: string;
  tone?: string;
  boundaries?: string[];
  starterPrompts?: string[];
  memoryPolicy?: string;
  tools?: string[];
}

interface AccountSettingsRequest {
  preferredLanguage?: "en" | "tr";
  onboardingCompleted?: boolean;
}

type UsageCapability = "chat" | "mode" | "image" | "resume_pdf";

const SESSION_COOKIE = "shadow_session";
const LEGACY_SESSION_COOKIE = "nexus_session";
const SESSION_TTL_SECONDS = 60 * 60 * 24 * 30;
const MODE_SET = new Set<ShellMode>([
  "chat",
  "content",
  "code",
  "canvas",
  "email",
  "video",
  "seo",
  "image",
  "voice",
  "resume",
  "bot",
]);

const MODE_PROMPTS: Record<ShellMode, string> = {
  chat: "General assistant conversation. Be direct, useful, and ask clarifying questions only when needed. Follow the user's input language unless they ask otherwise.",
  content:
    "Generate structured content with title, outline, draft-ready sections, hooks, CTA ideas, SEO notes, and revision suggestions. Follow the input language.",
  code: "Act as a senior software engineer. Return language, files, implementation, tests, risks, and exact follow-up commands. Prefer minimal correct code. Follow the input language for explanations.",
  canvas:
    "Design or update a live-preview frontend workspace. Default to full-page responsive screens with hero, supporting sections, spacing, and clear CTA flow unless the user explicitly asks for a widget, card, modal, or small component. Return file changes for the active template, keep file paths inside the allowed canvas files, avoid package installs, and make the result directly runnable in a sandboxed iframe preview. Follow the input language.",
  email:
    "Draft polished email copy with subject options, final email, tone notes, personalization slots, and a follow-up variant. Follow the input language.",
  video:
    "Create concise scripts with hook, scene list, voiceover, caption ideas, CTA, platform notes, and timing. Follow the input language.",
  seo: "Analyze SEO with score, technical issues, on-page issues, content gaps, priority fixes, and checklist. Follow the input language.",
  image:
    "Generate a finished image artifact with a rendered preview, concise prompt notes, style, aspect ratio, and next-step variations. Follow the input language.",
  voice:
    "Prepare text for speech with cleaned script, pacing notes, voice settings, SSML-safe text where possible, and export notes. Follow the input language.",
  resume:
    "Build a PDF-ready resume/CV artifact. Normalize the candidate into fullName, headline, contact, summary, skills, experience bullets, education, projects, and languages. Optimize for ATS and a modern visual template. Follow the input language.",
  bot: "Design and save a reusable bot persona with name, description, system prompt, tone, boundaries, starter prompts, memory policy, tools, and test sections. Follow the input language.",
};

const FREE_MODE_MODELS: Record<ShellMode, string> = {
  chat: "openai/gpt-oss-120b:free",
  content: "qwen/qwen3-next-80b-a3b-instruct:free",
  code: "qwen/qwen3-coder:free",
  canvas: "qwen/qwen3-coder:free",
  email: "openai/gpt-oss-20b:free",
  video: "qwen/qwen3-next-80b-a3b-instruct:free",
  seo: "z-ai/glm-4.5-air:free",
  image: "@cf/black-forest-labs/flux-1-schnell",
  voice: "openai/gpt-oss-20b:free",
  resume: "openai/gpt-oss-120b:free",
  bot: "qwen/qwen3-next-80b-a3b-instruct:free",
};

const FREE_FALLBACK_MODELS = [
  "openai/gpt-oss-120b:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "openai/gpt-oss-20b:free",
  "z-ai/glm-4.5-air:free",
  "nvidia/nemotron-3-nano-30b-a3b:free",
  "nvidia/nemotron-nano-9b-v2:free",
];

const CANVAS_FALLBACK_MODELS = [
  "qwen/qwen3-coder:free",
  "qwen/qwen3-next-80b-a3b-instruct:free",
  "openai/gpt-oss-120b:free",
  "openai/gpt-oss-20b:free",
  "z-ai/glm-4.5-air:free",
];

const USAGE_CAPABILITIES: UsageCapability[] = [
  "chat",
  "mode",
  "image",
  "resume_pdf",
];

const MODE_NLP_INSTRUCTIONS: Record<ShellMode, string> = {
  chat: "Use natural, conversational NLP. Keep context continuity, expose uncertainty, and answer in the user's language.",
  content:
    "Use marketing/content NLP: infer audience, intent, angle, structure, hooks, objections, CTA, and revision levers.",
  code: "Use engineering NLP: preserve identifiers, separate implementation from explanation, and include validation commands when useful.",
  canvas:
    "Use UI implementation NLP: reason over page structure, viewport composition, section hierarchy, responsive layout, typography, and preview-safe file edits while preserving a runnable workspace.",
  email:
    "Use business communication NLP: optimize subject, intent, recipient context, tone, scannability, and follow-up likelihood.",
  video:
    "Use scriptwriting NLP: optimize hook retention, scene beats, spoken rhythm, captions, CTA, and platform fit.",
  seo: "Use SEO/NLP entity analysis: infer search intent, entities, topical gaps, titles, snippets, internal-link opportunities, and prioritized fixes.",
  image:
    "Use visual-generation NLP: translate intent into subject, composition, lighting, mood, style, and render settings while keeping the output generation-ready.",
  voice:
    "Use speech NLP: normalize text for spoken clarity, pacing, pronunciation, pauses, emphasis, and SSML-safe phrasing.",
  resume:
    "Use resume NLP: extract role evidence, normalize experience, quantify impact where supported, preserve truthfulness, and optimize ATS keywords.",
  bot: "Use assistant-design NLP: infer persona, goals, boundaries, refusal style, memory policy, starter prompts, and testable behavior.",
};

const PDF_PAGE = {
  width: 612,
  height: 792,
  margin: 54,
  bottom: 54,
};

const PDF_COLORS = {
  black: rgb(0, 0, 0),
  muted: rgb(0.35, 0.39, 0.45),
  rule: rgb(0.74, 0.78, 0.82),
  accent: rgb(0.1, 0.48, 0.58),
  teal: rgb(0.12, 0.73, 0.69),
  header: rgb(0.07, 0.11, 0.18),
  headerText: rgb(1, 1, 1),
  headerMuted: rgb(0.82, 0.9, 0.92),
};

type PdfColor = (typeof PDF_COLORS)[keyof typeof PDF_COLORS];

let pdfFontBytesCache:
  | Promise<{ regular: Uint8Array; bold: Uint8Array }>
  | undefined;

const DEFAULT_CF_IMAGE_MODEL = "@cf/black-forest-labs/flux-1-schnell";
const CANVAS_TEMPLATE_FILES: Record<CanvasTemplate, string[]> = {
  react: ["App.tsx", "styles.css", "index.html"],
  html: ["index.html", "styles.css", "script.js"],
};
const CANVAS_FILE_LIMIT = 120_000;
const CANVAS_TOTAL_LIMIT = 240_000;

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext,
  ): Promise<Response> {
    if (request.method === "OPTIONS") {
      return withCors(new Response(null, { status: 204 }), request, env);
    }

    try {
      return await route(request, env, ctx);
    } catch (error) {
      if (error instanceof HttpError) {
        return json({ error: error.message }, error.status, request, env);
      }

      console.error(error);
      return json({ error: "Internal server error" }, 500, request, env);
    }
  },
};

async function route(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
): Promise<Response> {
  const url = new URL(request.url);
  const path = url.pathname.replace(/\/$/, "") || "/";

  if (request.method !== "GET" && request.method !== "HEAD") {
    const originError = requireAllowedMutationOrigin(request, env);
    if (originError) {
      return json(
        { error: originError.message },
        originError.status,
        request,
        env,
      );
    }
  }

  if (path === "/api/health") {
    return json(
      { ok: true, runtime: "cloudflare-worker", time: Date.now() },
      200,
      request,
      env,
    );
  }

  if (path === "/api/app-config" && request.method === "GET") {
    return json(appConfig(env), 200, request, env, {
      "Cache-Control": "no-store",
    });
  }

  if (path === "/api/me" && request.method === "GET") {
    const user = await getSessionUser(request, env);
    const settings = user
      ? toPublicUserSettings(await getOrCreateUserSettings(env, user.id))
      : null;
    return json(
      { user: user ? toPublicUser(user) : null, settings },
      200,
      request,
      env,
      {
        "Cache-Control": "no-store",
      },
    );
  }

  if (path === "/api/auth/logout" && request.method === "POST") {
    await logoutSession(request, env);
    const headers = new Headers({
      "Content-Type": "application/json; charset=utf-8",
      "Cache-Control": "no-store",
    });
    appendClearSessionCookies(headers, request);
    return withCors(
      new Response(JSON.stringify({ ok: true }), { status: 200, headers }),
      request,
      env,
    );
  }

  const authStart = path.match(/^\/api\/auth\/(google|github)\/start$/);
  if (authStart && request.method === "GET") {
    return startOAuth(authStart[1] as "google" | "github", request, env);
  }

  const authCallback = path.match(/^\/api\/auth\/(google|github)\/callback$/);
  if (authCallback && request.method === "GET") {
    return finishOAuth(authCallback[1] as "google" | "github", request, env);
  }

  if (path === "/api/conversations" && request.method === "GET") {
    const user = await requireUser(request, env);
    const rows = await env.DB.prepare(
      "SELECT id, user_id, title, mode, model, created_at, updated_at FROM conversations WHERE user_id = ? ORDER BY updated_at DESC LIMIT 50",
    )
      .bind(user.id)
      .all<ConversationRow>();

    return json(
      {
        conversations: (rows.results ?? []).map(toConversationSummary),
      },
      200,
      request,
      env,
    );
  }

  if (path === "/api/conversations" && request.method === "POST") {
    const user = await requireUser(request, env);
    const body = (await request
      .json()
      .catch(() => ({}))) as Partial<ChatRequest> & { title?: string };
    const mode = sanitizeMode(body.mode);
    const now = Date.now();
    const conversation: ConversationRow = {
      id: randomId("conv"),
      user_id: user.id,
      title: clip(body.title || "New conversation", 80),
      mode,
      model: body.model || null,
      created_at: now,
      updated_at: now,
    };

    await insertConversation(env, conversation);
    return json(
      { conversation: toConversationSummary(conversation) },
      201,
      request,
      env,
    );
  }

  const messagesMatch = path.match(/^\/api\/conversations\/([^/]+)\/messages$/);
  if (messagesMatch && request.method === "GET") {
    const user = await requireUser(request, env);
    const conversationId = decodeURIComponent(messagesMatch[1]);
    await requireConversation(env, user.id, conversationId);
    const messages = await getConversationMessages(
      env,
      user.id,
      conversationId,
      200,
      "ASC",
    );
    return json({ messages: messages.map(toApiMessage) }, 200, request, env);
  }

  const conversationMatch = path.match(/^\/api\/conversations\/([^/]+)$/);
  if (conversationMatch && request.method === "DELETE") {
    return handleDeleteConversation(
      request,
      env,
      decodeURIComponent(conversationMatch[1]),
    );
  }

  const canvasMatch = path.match(/^\/api\/conversations\/([^/]+)\/canvas$/);
  if (canvasMatch && request.method === "GET") {
    return handleGetCanvasWorkspace(
      request,
      env,
      decodeURIComponent(canvasMatch[1]),
    );
  }

  if (canvasMatch && request.method === "PUT") {
    return handlePutCanvasWorkspace(
      request,
      env,
      decodeURIComponent(canvasMatch[1]),
    );
  }

  if (path === "/api/bots" && request.method === "GET") {
    return handleListBots(request, env);
  }

  if (path === "/api/bots" && request.method === "POST") {
    return handleCreateBot(request, env);
  }

  const botMatch = path.match(/^\/api\/bots\/([^/]+)$/);
  if (botMatch && request.method === "PATCH") {
    return handleUpdateBot(request, env, decodeURIComponent(botMatch[1]));
  }

  if (botMatch && request.method === "DELETE") {
    return handleDeleteBot(request, env, decodeURIComponent(botMatch[1]));
  }

  if (path === "/api/account/usage" && request.method === "GET") {
    return handleAccountUsage(request, env);
  }

  if (path === "/api/account/export" && request.method === "GET") {
    return handleAccountExport(request, env);
  }

  if (path === "/api/account/settings" && request.method === "PATCH") {
    return handleAccountSettings(request, env);
  }

  if (path === "/api/account" && request.method === "DELETE") {
    return handleDeleteAccount(request, env);
  }

  if (path === "/api/modes/run" && request.method === "POST") {
    return handleModeRun(request, env);
  }

  if (path === "/api/modes/run/stream" && request.method === "POST") {
    return handleModeRunStream(request, env, ctx);
  }

  if (path === "/api/resume/pdf" && request.method === "POST") {
    return handleResumePdf(request, env);
  }

  if (path === "/api/chat/stream" && request.method === "POST") {
    return handleChatStream(request, env, ctx);
  }

  return json({ error: "Not found" }, 404, request, env);
}

async function handleGetCanvasWorkspace(
  request: Request,
  env: Env,
  conversationId: string,
) {
  const user = await requireUser(request, env);
  await requireConversation(env, user.id, conversationId);
  const row = await env.DB.prepare(
    "SELECT conversation_id, user_id, template, files_json, active_file, updated_at FROM canvas_workspaces WHERE conversation_id = ? AND user_id = ?",
  )
    .bind(conversationId, user.id)
    .first<CanvasWorkspaceRow>();

  return json(
    {
      workspace: row ? canvasWorkspaceFromRow(row) : null,
    },
    200,
    request,
    env,
  );
}

async function handlePutCanvasWorkspace(
  request: Request,
  env: Env,
  conversationId: string,
) {
  const user = await requireUser(request, env);
  const conversation = await requireConversation(env, user.id, conversationId);
  const body = (await request
    .json()
    .catch(() => null)) as CanvasWorkspaceRequest | null;

  if (!body?.workspace) {
    return json({ error: "Canvas workspace is required" }, 400, request, env);
  }

  let workspace: CanvasWorkspaceData;
  try {
    workspace = normalizeCanvasWorkspace(body.workspace);
  } catch (error) {
    return json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Canvas workspace is invalid",
      },
      400,
      request,
      env,
    );
  }

  const row = canvasWorkspaceToRow(conversationId, user.id, workspace);
  await env.DB.prepare(
    "INSERT INTO canvas_workspaces (conversation_id, user_id, template, files_json, active_file, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(conversation_id) DO UPDATE SET user_id = excluded.user_id, template = excluded.template, files_json = excluded.files_json, active_file = excluded.active_file, updated_at = excluded.updated_at",
  )
    .bind(
      row.conversation_id,
      row.user_id,
      row.template,
      row.files_json,
      row.active_file,
      row.updated_at,
    )
    .run();

  await env.DB.prepare(
    "UPDATE conversations SET mode = ?, updated_at = ? WHERE id = ? AND user_id = ?",
  )
    .bind("canvas", row.updated_at, conversation.id, user.id)
    .run();

  return json(
    {
      workspace: canvasWorkspaceFromRow(row),
    },
    200,
    request,
    env,
  );
}

async function handleDeleteConversation(
  request: Request,
  env: Env,
  conversationId: string,
) {
  const user = await requireUser(request, env);
  await requireConversation(env, user.id, conversationId);

  await deleteConversationData(env, user.id, conversationId);

  return json({ ok: true, conversationId }, 200, request, env, {
    "Cache-Control": "no-store",
  });
}

async function handleAccountUsage(request: Request, env: Env) {
  const user = await requireUser(request, env);
  const usage = await getUsageSnapshot(env, user.id);
  return json(usage, 200, request, env, {
    "Cache-Control": "no-store",
  });
}

async function handleAccountSettings(request: Request, env: Env) {
  const user = await requireUser(request, env);
  const body = (await request
    .json()
    .catch(() => ({}))) as AccountSettingsRequest;
  const settings = await updateUserSettings(env, user.id, body);

  return json({ settings: toPublicUserSettings(settings) }, 200, request, env, {
    "Cache-Control": "no-store",
  });
}

async function handleAccountExport(request: Request, env: Env) {
  const user = await requireUser(request, env);
  const settings = await getOrCreateUserSettings(env, user.id);
  const usage = await getUsageSnapshot(env, user.id);
  const [conversations, messages, artifacts, bots, memoryItems, toolEvents] =
    await Promise.all([
      env.DB.prepare(
        "SELECT id, user_id, title, mode, model, created_at, updated_at FROM conversations WHERE user_id = ? ORDER BY updated_at DESC",
      )
        .bind(user.id)
        .all<ConversationRow>(),
      env.DB.prepare(
        "SELECT id, conversation_id, user_id, role, mode, content, model, metadata, created_at FROM messages WHERE user_id = ? ORDER BY created_at ASC",
      )
        .bind(user.id)
        .all<MessageRow>(),
      env.DB.prepare(
        "SELECT id, user_id, conversation_id, message_id, mode, type, title, payload, created_at, updated_at FROM artifacts WHERE user_id = ? ORDER BY created_at ASC",
      )
        .bind(user.id)
        .all<ArtifactRow>(),
      env.DB.prepare(
        "SELECT id, user_id, name, description, system_prompt, tone, boundaries, starter_prompts, memory_policy, tools, created_at, updated_at, deleted_at FROM bots WHERE user_id = ? ORDER BY updated_at DESC",
      )
        .bind(user.id)
        .all<BotRow>(),
      env.DB.prepare(
        "SELECT id, user_id, conversation_id, type, content, source_message_id, confidence, metadata, created_at, updated_at FROM memory_items WHERE user_id = ? ORDER BY updated_at DESC",
      )
        .bind(user.id)
        .all<Record<string, unknown>>(),
      env.DB.prepare(
        "SELECT id, user_id, conversation_id, event_type, metadata, created_at FROM tool_events WHERE user_id = ? ORDER BY created_at DESC",
      )
        .bind(user.id)
        .all<Record<string, unknown>>(),
    ]);

  const payload = {
    exportedAt: new Date().toISOString(),
    product: appConfig(env).product,
    user: toPublicUser(user),
    settings: toPublicUserSettings(settings),
    usage,
    conversations: (conversations.results ?? []).map(toConversationSummary),
    messages: (messages.results ?? []).map(toApiMessage),
    artifacts: (artifacts.results ?? []).map((artifact) => ({
      ...artifact,
      payload: parseJsonObject(artifact.payload),
    })),
    bots: (bots.results ?? []).map(toBotSummary),
    memoryItems: memoryItems.results ?? [],
    toolEvents: toolEvents.results ?? [],
  };

  return withCors(
    new Response(JSON.stringify(payload, null, 2), {
      status: 200,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        "Content-Disposition": `attachment; filename="shadow-account-export-${safeFileName(user.email)}.json"`,
        "Cache-Control": "no-store",
      },
    }),
    request,
    env,
  );
}

async function handleDeleteAccount(request: Request, env: Env) {
  const user = await requireUser(request, env);
  await deleteUserData(env, user.id);

  const headers = new Headers({
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
  });
  appendClearSessionCookies(headers, request);
  return withCors(
    new Response(JSON.stringify({ ok: true }), { status: 200, headers }),
    request,
    env,
  );
}

async function handleListBots(request: Request, env: Env) {
  const user = await requireUser(request, env);
  const rows = await env.DB.prepare(
    "SELECT id, user_id, name, description, system_prompt, tone, boundaries, starter_prompts, memory_policy, tools, created_at, updated_at, deleted_at FROM bots WHERE user_id = ? AND deleted_at IS NULL ORDER BY updated_at DESC LIMIT 100",
  )
    .bind(user.id)
    .all<BotRow>();

  return json(
    { bots: (rows.results ?? []).map(toBotSummary) },
    200,
    request,
    env,
  );
}

async function handleCreateBot(request: Request, env: Env) {
  const user = await requireUser(request, env);
  const body = (await request.json().catch(() => null)) as unknown;
  const bodyRecord = isRecord(body) ? body : null;
  const input =
    bodyRecord && isRecord(bodyRecord.bot) ? bodyRecord.bot : bodyRecord;

  if (!input || typeof input.name !== "string" || !input.name.trim()) {
    return json({ error: "Bot name is required" }, 400, request, env);
  }

  const bot = normalizeBotArtifact(input, "Custom bot persona");
  const row = await insertBot(env, user.id, bot);
  return json({ bot: toBotSummary(row) }, 201, request, env);
}

async function handleUpdateBot(request: Request, env: Env, botId: string) {
  const user = await requireUser(request, env);
  const existing = await requireBot(env, user.id, botId);
  const body = (await request.json().catch(() => ({}))) as BotUpdateRequest;
  const now = Date.now();
  const next: BotRow = {
    ...existing,
    name: clip(body.name ?? existing.name, 80),
    description: clip(body.description ?? existing.description, 500),
    system_prompt: clip(body.systemPrompt ?? existing.system_prompt, 12_000),
    tone: clip(body.tone ?? existing.tone, 160),
    boundaries: JSON.stringify(
      normalizeStringArray(
        body.boundaries,
        parseStringArray(existing.boundaries),
      ),
    ),
    starter_prompts: JSON.stringify(
      normalizeStringArray(
        body.starterPrompts,
        parseStringArray(existing.starter_prompts),
      ),
    ),
    memory_policy: clip(body.memoryPolicy ?? existing.memory_policy, 500),
    tools: JSON.stringify(
      normalizeStringArray(body.tools, parseStringArray(existing.tools)),
    ),
    updated_at: now,
  };

  await env.DB.prepare(
    "UPDATE bots SET name = ?, description = ?, system_prompt = ?, tone = ?, boundaries = ?, starter_prompts = ?, memory_policy = ?, tools = ?, updated_at = ? WHERE id = ? AND user_id = ? AND deleted_at IS NULL",
  )
    .bind(
      next.name,
      next.description,
      next.system_prompt,
      next.tone,
      next.boundaries,
      next.starter_prompts,
      next.memory_policy,
      next.tools,
      next.updated_at,
      botId,
      user.id,
    )
    .run();

  return json({ bot: toBotSummary(next) }, 200, request, env);
}

async function handleDeleteBot(request: Request, env: Env, botId: string) {
  const user = await requireUser(request, env);
  await requireBot(env, user.id, botId);
  const now = Date.now();
  await env.DB.prepare(
    "UPDATE bots SET deleted_at = ?, updated_at = ? WHERE id = ? AND user_id = ?",
  )
    .bind(now, now, botId, user.id)
    .run();

  return json({ ok: true }, 200, request, env);
}

async function handleModeRun(request: Request, env: Env) {
  const user = await requireUser(request, env);
  const body = (await request
    .json()
    .catch(() => null)) as ModeRunRequest | null;

  if (!body || typeof body.input !== "string" || !body.input.trim()) {
    return json({ error: "Input is required" }, 400, request, env);
  }

  const mode = sanitizeMode(body.mode);
  if (mode === "chat") {
    return json(
      { error: "Use /api/chat/stream for chat mode" },
      400,
      request,
      env,
    );
  }

  const input = body.input.trim();
  if (input.length > 16_000) {
    return json({ error: "Input is too long" }, 413, request, env);
  }

  if (!(await verifyTurnstileIfRequired(env, body.turnstileToken, request))) {
    await logUsageEvent({
      env,
      request,
      userId: user.id,
      eventType: "turnstile.failed",
      model: "turnstile",
      metadata: { endpoint: "mode", mode },
    });
    return json({ error: "Turnstile verification failed" }, 403, request, env);
  }

  const controls = body.controls ?? {};
  const route = routeUserInput(input, mode);
  const isMetaRun = controls.metaIntent === true || route.kind === "meta";
  const needsResumeInfo = mode === "resume" && !hasResumeCandidateData(input);
  const needsImageClarification =
    mode === "image" && !isMetaRun && requiresImageClarification(input);
  const isWorkersAiImageRun = mode === "image" && !isMetaRun;
  const usageCapability: UsageCapability = mode === "image" ? "image" : "mode";

  if (
    !isMetaRun &&
    !needsResumeInfo &&
    !needsImageClarification &&
    !isWorkersAiImageRun &&
    !env.OPENROUTER_API_KEY
  ) {
    return json(
      { error: "OPENROUTER_API_KEY is not configured" },
      503,
      request,
      env,
    );
  }

  const ipLimit = Number(env.IP_RATE_LIMIT_PER_MINUTE || 10);
  const ipKey = `mode:ip:${await hashString(getClientIp(request))}:${Math.floor(Date.now() / 60_000)}`;

  if (!(await incrementLimit(env, ipKey, ipLimit, 120))) {
    return json({ error: "Rate limit exceeded" }, 429, request, env);
  }

  const quotaBlock = await blockOnQuota(
    env,
    request,
    user.id,
    usageCapability,
    mode === "image"
      ? "Daily image limit reached for the free beta."
      : "Daily structured-mode limit reached for the free beta.",
    { endpoint: "mode", mode },
  );
  if (quotaBlock) {
    return quotaBlock;
  }

  const modelCandidates =
    mode === "image"
      ? resolveWorkersAiImageModels(env, body.model)
      : resolveOpenRouterModels(env, mode, body.model);
  const selectedModel = modelCandidates[0] ?? FREE_MODE_MODELS[mode];
  const now = Date.now();
  const conversation = body.conversationId
    ? await requireConversation(env, user.id, body.conversationId)
    : await createConversationFromMessage(
        env,
        user.id,
        mode,
        selectedModel,
        input,
        now,
      );

  const userMessage: MessageRow = {
    id: randomId("msg"),
    conversation_id: conversation.id,
    user_id: user.id,
    role: "user",
    mode,
    content: input,
    model: selectedModel,
    created_at: now,
  };
  await insertMessage(env, userMessage);

  const artifactResult = isMetaRun
    ? {
        model: INTERNAL_ROUTER_MODEL,
        artifact: createMetaArtifact(mode, input, modelCandidates),
      }
    : needsResumeInfo
      ? {
          model: INTERNAL_ROUTER_MODEL,
          artifact: createResumeNeedsInfoArtifact(input),
        }
      : needsImageClarification
        ? {
            model: INTERNAL_ROUTER_MODEL,
            artifact: createImageClarificationArtifact(input),
          }
        : isWorkersAiImageRun
          ? await generateImageArtifact({
              env,
              input,
              controls,
              requestedModel: body.model,
            })
          : await callOpenRouterJson({
              request,
              env,
              models: modelCandidates,
              mode,
              input,
              controls,
            }).catch((error) => {
              if (mode === "canvas") {
                return {
                  model: INTERNAL_ROUTER_MODEL,
                  artifact: createCanvasFallbackArtifact(
                    input,
                    controls,
                    modelCandidates[0],
                  ),
                };
              }
              throw error;
            });
  const result = await completeModeArtifactRun({
    env,
    request,
    user,
    conversation,
    userMessage,
    mode,
    input,
    controls,
    routeReason: route.reason,
    modelCandidates,
    usageCapability,
    artifactResult,
  });

  return json(result, 200, request, env);
}

async function handleModeRunStream(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
) {
  const user = await requireUser(request, env);
  const body = (await request
    .json()
    .catch(() => null)) as ModeRunRequest | null;

  if (!body || typeof body.input !== "string" || !body.input.trim()) {
    return json({ error: "Input is required" }, 400, request, env);
  }

  const mode = sanitizeMode(body.mode);
  if (mode === "chat") {
    return json(
      { error: "Use /api/chat/stream for chat mode" },
      400,
      request,
      env,
    );
  }

  if (mode !== "canvas") {
    return json(
      {
        error:
          "Structured streaming is currently available only for canvas mode",
      },
      400,
      request,
      env,
    );
  }

  const input = body.input.trim();
  if (input.length > 16_000) {
    return json({ error: "Input is too long" }, 413, request, env);
  }

  if (!(await verifyTurnstileIfRequired(env, body.turnstileToken, request))) {
    await logUsageEvent({
      env,
      request,
      userId: user.id,
      eventType: "turnstile.failed",
      model: "turnstile",
      metadata: { endpoint: "mode.stream", mode },
    });
    return json({ error: "Turnstile verification failed" }, 403, request, env);
  }

  const controls = body.controls ?? {};
  const route = routeUserInput(input, mode);
  const isMetaRun = controls.metaIntent === true || route.kind === "meta";
  const usageCapability: UsageCapability = "mode";

  if (!isMetaRun && !env.OPENROUTER_API_KEY) {
    return json(
      { error: "OPENROUTER_API_KEY is not configured" },
      503,
      request,
      env,
    );
  }

  const ipLimit = Number(env.IP_RATE_LIMIT_PER_MINUTE || 10);
  const ipKey = `mode-stream:ip:${await hashString(getClientIp(request))}:${Math.floor(Date.now() / 60_000)}`;

  if (!(await incrementLimit(env, ipKey, ipLimit, 120))) {
    return json({ error: "Rate limit exceeded" }, 429, request, env);
  }

  const quotaBlock = await blockOnQuota(
    env,
    request,
    user.id,
    usageCapability,
    "Daily structured-mode limit reached for the free beta.",
    { endpoint: "mode.stream", mode },
  );
  if (quotaBlock) {
    return quotaBlock;
  }

  const modelCandidates = resolveOpenRouterModels(env, mode, body.model);
  const selectedModel = modelCandidates[0] ?? FREE_MODE_MODELS[mode];
  const now = Date.now();
  const conversation = body.conversationId
    ? await requireConversation(env, user.id, body.conversationId)
    : await createConversationFromMessage(
        env,
        user.id,
        mode,
        selectedModel,
        input,
        now,
      );

  const userMessage: MessageRow = {
    id: randomId("msg"),
    conversation_id: conversation.id,
    user_id: user.id,
    role: "user",
    mode,
    content: input,
    model: selectedModel,
    created_at: now,
  };
  await insertMessage(env, userMessage);

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  ctx.waitUntil(
    runCanvasModeStream({
      request,
      env,
      user,
      conversation,
      userMessage,
      input,
      controls,
      routeReason: route.reason,
      modelCandidates,
      usageCapability,
      writer,
      isMetaRun,
    }),
  );

  return withCors(
    new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    }),
    request,
    env,
  );
}

async function completeModeArtifactRun(args: {
  env: Env;
  request: Request;
  user: SessionUser;
  conversation: ConversationRow;
  userMessage: MessageRow;
  mode: ShellMode;
  input: string;
  controls: Record<string, unknown>;
  routeReason: string;
  modelCandidates: string[];
  usageCapability: UsageCapability;
  artifactResult: { model: string; artifact: unknown };
  assistantContent?: string;
}) {
  const {
    env,
    request,
    user,
    conversation,
    userMessage,
    mode,
    input,
    controls,
    routeReason,
    modelCandidates,
    usageCapability,
    artifactResult,
    assistantContent,
  } = args;

  let selectedModel = artifactResult.model;
  if (selectedModel !== userMessage.model) {
    await env.DB.prepare(
      "UPDATE messages SET model = ? WHERE id = ? AND user_id = ?",
    )
      .bind(selectedModel, userMessage.id, user.id)
      .run();
    userMessage.model = selectedModel;
  }

  let artifact = normalizeArtifact(mode, input, artifactResult.artifact);
  if (
    mode === "canvas" &&
    (!artifact.canvas || !artifact.canvas.changes.length)
  ) {
    artifact = createCanvasFallbackArtifact(input, controls, selectedModel);
    selectedModel = INTERNAL_ROUTER_MODEL;
  }

  artifact.metadata = {
    ...(artifact.metadata ?? {}),
    selectedModel,
  };

  const artifactId = randomId("art");
  let botId: string | undefined;

  if (mode === "bot" && artifact.bot) {
    const bot = await insertBot(env, user.id, artifact.bot);
    botId = bot.id;
  }

  const assistantMessage: MessageRow = {
    id: randomId("msg"),
    conversation_id: conversation.id,
    user_id: user.id,
    role: "assistant",
    mode,
    content: assistantContent ?? artifact.summary,
    model: selectedModel,
    metadata: JSON.stringify({
      artifact,
      artifactId,
      selectedModel,
      modelFallbacks: modelCandidates,
      routeReason,
      ...(botId ? { botId } : {}),
    }),
    created_at: Date.now(),
  };
  await insertMessage(env, assistantMessage);
  await insertArtifact(env, {
    id: artifactId,
    user_id: user.id,
    conversation_id: conversation.id,
    message_id: assistantMessage.id,
    mode,
    type: artifact.resume
      ? "resume"
      : artifact.bot
        ? "bot"
        : artifact.canvas
          ? "canvas"
          : "artifact",
    title: artifact.title,
    payload: JSON.stringify(artifact),
    created_at: assistantMessage.created_at,
    updated_at: assistantMessage.created_at,
  });

  await env.DB.prepare(
    "UPDATE conversations SET mode = ?, model = ?, title = CASE WHEN title = 'New conversation' THEN ? ELSE title END, updated_at = ? WHERE id = ? AND user_id = ?",
  )
    .bind(
      mode,
      selectedModel,
      titleFromMessage(input),
      assistantMessage.created_at,
      conversation.id,
      user.id,
    )
    .run();

  await env.DB.prepare(
    "INSERT INTO tool_events (id, user_id, conversation_id, event_type, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind(
      randomId("tool"),
      user.id,
      conversation.id,
      "mode.artifact.created",
      JSON.stringify({
        mode,
        artifactId,
        assistantMessageId: assistantMessage.id,
        botId,
        selectedModel,
        routeReason,
      }),
      assistantMessage.created_at,
    )
    .run();

  await incrementDailyUsage(env, user.id, usageCapability);
  await logUsageEvent({
    env,
    request,
    userId: user.id,
    eventType: usageCapability === "image" ? "image.request" : "mode.request",
    model: selectedModel,
    metadata: {
      mode,
      artifactId,
      assistantMessageId: assistantMessage.id,
      routeReason,
    },
  });

  return {
    conversationId: conversation.id,
    messageId: assistantMessage.id,
    artifactId,
    artifact,
    model: selectedModel,
    assistantContent: assistantMessage.content,
    ...(botId ? { botId } : {}),
  };
}

async function runCanvasModeStream(args: {
  request: Request;
  env: Env;
  user: SessionUser;
  conversation: ConversationRow;
  userMessage: MessageRow;
  input: string;
  controls: Record<string, unknown>;
  routeReason: string;
  modelCandidates: string[];
  usageCapability: UsageCapability;
  writer: WritableStreamDefaultWriter<Uint8Array>;
  isMetaRun: boolean;
}) {
  const {
    request,
    env,
    user,
    conversation,
    userMessage,
    input,
    controls,
    routeReason,
    modelCandidates,
    usageCapability,
    writer,
    isMetaRun,
  } = args;

  try {
    await writeSse(writer, "status", {
      label: "Analyzing canvas brief...",
      step: 1,
      total: 4,
    });

    let planningText = "";
    if (!isMetaRun) {
      await writeSse(writer, "status", {
        label: "Planning page layout and sections...",
        step: 2,
        total: 4,
      });
      planningText = await streamCanvasPlanning({
        request,
        env,
        writer,
        input,
        controls,
        models: modelCandidates,
      });
    }

    await writeSse(writer, "status", {
      label: "Writing canvas files...",
      step: 3,
      total: 4,
    });

    const artifactResult = isMetaRun
      ? {
          model: INTERNAL_ROUTER_MODEL,
          artifact: createMetaArtifact("canvas", input, modelCandidates),
        }
      : await callOpenRouterJson({
          request,
          env,
          models: modelCandidates,
          mode: "canvas",
          input,
          controls,
        }).catch(() => ({
          model: INTERNAL_ROUTER_MODEL,
          artifact: createCanvasFallbackArtifact(
            input,
            controls,
            modelCandidates[0],
          ),
        }));

    await writeSse(writer, "status", {
      label: "Applying canvas changes...",
      step: 4,
      total: 4,
    });

    const result = await completeModeArtifactRun({
      env,
      request,
      user,
      conversation,
      userMessage,
      mode: "canvas",
      input,
      controls,
      routeReason,
      modelCandidates,
      usageCapability,
      artifactResult,
      assistantContent: combineCanvasPlanningAndSummary(
        planningText,
        artifactResult.model,
        artifactResult.artifact,
        input,
        controls,
      ),
    });

    await writeSse(writer, "artifact.done", result);
    await writer.close();
  } catch (error) {
    await writeSse(writer, "error", {
      error: error instanceof Error ? error.message : "Canvas stream failed",
    });
    await writer.close();
  }
}

async function streamCanvasPlanning(args: {
  request: Request;
  env: Env;
  writer: WritableStreamDefaultWriter<Uint8Array>;
  input: string;
  controls: Record<string, unknown>;
  models: string[];
}) {
  const { request, env, writer, input, controls, models } = args;
  const responseLanguage = preferredResponseLanguage(controls, input);
  const planningMessages: Array<{ role: MessageRole; content: string }> = [
    {
      role: "system",
      content: [
        "You are Shadow AI's live canvas planner.",
        "Stream short working notes while you plan the frontend implementation.",
        `Write only in ${responseLanguage.label}.`,
        "Do not switch to German or any other language unless the user explicitly asks for it.",
        "Mention the visual direction, section order, CTA logic, and what files you are about to touch.",
        "Do not output code fences, JSON, or markdown headings.",
        "Keep it to 3-6 short sentences so the user can follow the build live.",
      ].join("\n"),
    },
    {
      role: "user",
      content: [
        `Canvas brief: ${input}`,
        `Controls: ${JSON.stringify(controls)}`,
      ].join("\n"),
    },
  ];

  let streamedText = "";

  try {
    const streamStart = await openOpenRouterStream({
      request,
      env,
      models,
      messages: planningMessages,
    });
    const reader = streamStart.response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const handleFrame = async (frame: string) => {
      for (const line of frame.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) {
          continue;
        }

        const raw = trimmed.slice(5).trim();
        if (!raw || raw === "[DONE]") {
          continue;
        }

        const data = JSON.parse(raw) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const delta = data.choices?.[0]?.delta?.content ?? "";
        if (!delta) {
          continue;
        }
        streamedText += delta;
        await writeSse(writer, "message.delta", { delta });
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split("\n\n");
      buffer = frames.pop() ?? "";
      for (const frame of frames) {
        await handleFrame(frame);
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) {
      await handleFrame(buffer);
    }
  } catch (error) {
    console.warn("Canvas planning stream failed", error);
  }

  return streamedText.trim();
}

function combineCanvasPlanningAndSummary(
  planningText: string,
  model: string,
  artifactLike: unknown,
  input: string,
  controls: Record<string, unknown>,
) {
  const artifact = normalizeArtifact("canvas", input, artifactLike);
  const changedFiles =
    artifact.canvas?.changedFiles?.join(", ") ||
    "App.tsx, styles.css, index.html";
  const summaryLine =
    preferredResponseLanguage(controls, input).code === "tr"
      ? `Hazır: ${changedFiles} güncellendi. Model: ${model}. ${artifact.summary}`
      : `Done: updated ${changedFiles}. Model: ${model}. ${artifact.summary}`;

  return planningText.trim()
    ? `${planningText.trim()}\n\n${summaryLine}`
    : summaryLine;
}

async function handleResumePdf(request: Request, env: Env) {
  const user = await requireUser(request, env);
  const body = (await request
    .json()
    .catch(() => null)) as ResumePdfRequest | null;
  const artifact = body?.artifact;

  if (!artifact || artifact.mode !== "resume" || !artifact.resume) {
    return json({ error: "Resume artifact is required" }, 400, request, env);
  }

  const quotaBlock = await blockOnQuota(
    env,
    request,
    user.id,
    "resume_pdf",
    "Daily resume PDF limit reached for the free beta.",
    { endpoint: "resume.pdf" },
  );
  if (quotaBlock) {
    return quotaBlock;
  }

  const template: ResumeTemplate =
    body.template === "modern-visual" ? "modern-visual" : "ats-professional";
  const pdf = await renderResumePdf(artifact.resume, template, request, env);
  const fileName = `${safeFileName(artifact.resume.fullName || "resume")}.pdf`;
  await incrementDailyUsage(env, user.id, "resume_pdf");
  await logUsageEvent({
    env,
    request,
    userId: user.id,
    eventType: "resume.pdf",
    model: "pdf-lib",
    metadata: { template, artifactTitle: artifact.title },
  });

  return withCors(
    new Response(pdf, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${fileName}"`,
        "Cache-Control": "no-store",
      },
    }),
    request,
    env,
  );
}

async function handleChatStream(
  request: Request,
  env: Env,
  ctx: ExecutionContext,
) {
  const user = await requireUser(request, env);
  const body = (await request.json().catch(() => null)) as ChatRequest | null;

  if (!body || typeof body.message !== "string" || !body.message.trim()) {
    return json({ error: "Message is required" }, 400, request, env);
  }

  const mode = sanitizeMode(body.mode);
  const input = body.message.trim();
  const route = routeUserInput(input, mode);
  const isMetaRun = route.kind === "meta";

  if (!isMetaRun && !env.OPENROUTER_API_KEY) {
    return json(
      { error: "OPENROUTER_API_KEY is not configured" },
      503,
      request,
      env,
    );
  }

  if (input.length > 16_000) {
    return json({ error: "Message is too long" }, 413, request, env);
  }

  if (!(await verifyTurnstileIfRequired(env, body.turnstileToken, request))) {
    await logUsageEvent({
      env,
      request,
      userId: user.id,
      eventType: "turnstile.failed",
      model: "turnstile",
      metadata: { endpoint: "chat", mode },
    });
    return json({ error: "Turnstile verification failed" }, 403, request, env);
  }

  const ipLimit = Number(env.IP_RATE_LIMIT_PER_MINUTE || 10);
  const ipKey = `chat:ip:${await hashString(getClientIp(request))}:${Math.floor(Date.now() / 60_000)}`;

  if (!(await incrementLimit(env, ipKey, ipLimit, 120))) {
    return json({ error: "Rate limit exceeded" }, 429, request, env);
  }

  const quotaBlock = await blockOnQuota(
    env,
    request,
    user.id,
    "chat",
    "Daily chat limit reached for the free beta.",
    { endpoint: "chat", mode },
  );
  if (quotaBlock) {
    return quotaBlock;
  }

  const modelCandidates = resolveOpenRouterModels(env, mode, body.model);
  const model = isMetaRun
    ? INTERNAL_ROUTER_MODEL
    : (modelCandidates[0] ?? FREE_MODE_MODELS[mode]);
  const now = Date.now();
  const conversation = body.conversationId
    ? await requireConversation(env, user.id, body.conversationId)
    : await createConversationFromMessage(
        env,
        user.id,
        mode,
        model,
        input,
        now,
      );

  const userMessage: MessageRow = {
    id: randomId("msg"),
    conversation_id: conversation.id,
    user_id: user.id,
    role: "user",
    mode,
    content: input,
    model,
    created_at: now,
  };

  await insertMessage(env, userMessage);
  await env.DB.prepare(
    "UPDATE conversations SET mode = ?, model = ?, updated_at = ? WHERE id = ? AND user_id = ?",
  )
    .bind(mode, model, now, conversation.id, user.id)
    .run();

  const { readable, writable } = new TransformStream();
  const writer = writable.getWriter();

  if (isMetaRun) {
    ctx.waitUntil(
      runDeterministicStream({
        env,
        user,
        conversation,
        userMessage,
        mode,
        content: createMetaResponseText(mode, input, modelCandidates),
        request,
        writer,
      }),
    );
  } else {
    ctx.waitUntil(
      runOpenRouterStream({
        request,
        env,
        ctx,
        user,
        conversation,
        userMessage,
        mode,
        capability: "chat",
        models: modelCandidates,
        botId: body.botId ?? null,
        writer,
      }),
    );
  }

  return withCors(
    new Response(readable, {
      headers: {
        "Content-Type": "text/event-stream; charset=utf-8",
        "Cache-Control": "no-cache, no-transform",
        Connection: "keep-alive",
      },
    }),
    request,
    env,
  );
}

async function runOpenRouterStream(args: {
  request: Request;
  env: Env;
  ctx: ExecutionContext;
  user: SessionUser;
  conversation: ConversationRow;
  userMessage: MessageRow;
  mode: ShellMode;
  capability: UsageCapability;
  models: string[];
  botId?: string | null;
  writer: WritableStreamDefaultWriter<Uint8Array>;
}) {
  const {
    request,
    env,
    ctx,
    user,
    conversation,
    userMessage,
    mode,
    capability,
    models,
    botId,
    writer,
  } = args;

  try {
    const promptMessages = await buildPromptMessages(
      env,
      user.id,
      conversation.id,
      mode,
      userMessage.content,
      botId,
    );
    const streamStart = await openOpenRouterStream({
      request,
      env,
      models,
      messages: promptMessages,
    });

    const { model, response } = streamStart;
    const assistantMessageId = randomId("msg");
    let assistantContent = "";
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = "";

    const handleFrame = async (frame: string) => {
      for (const line of frame.split("\n")) {
        const trimmed = line.trim();
        if (!trimmed.startsWith("data:")) {
          continue;
        }

        const raw = trimmed.slice(5).trim();
        if (!raw || raw === "[DONE]") {
          continue;
        }

        const data = JSON.parse(raw) as {
          choices?: Array<{ delta?: { content?: string } }>;
        };
        const delta = data.choices?.[0]?.delta?.content ?? "";

        if (delta) {
          assistantContent += delta;
          await writeSse(writer, "message.delta", { delta });
        }
      }
    };

    while (true) {
      const { done, value } = await reader.read();
      if (done) {
        break;
      }

      buffer += decoder.decode(value, { stream: true });
      const frames = buffer.split("\n\n");
      buffer = frames.pop() ?? "";

      for (const frame of frames) {
        await handleFrame(frame);
      }
    }

    buffer += decoder.decode();
    if (buffer.trim()) {
      await handleFrame(buffer);
    }

    const now = Date.now();
    await env.DB.prepare(
      "UPDATE messages SET model = ? WHERE id = ? AND user_id = ?",
    )
      .bind(model, userMessage.id, user.id)
      .run();
    await incrementDailyUsage(env, user.id, capability);
    await logUsageEvent({
      env,
      request,
      userId: user.id,
      eventType: "chat.request",
      model,
      metadata: { mode, fallbacks: models },
    });

    const assistantMessage: MessageRow = {
      id: assistantMessageId,
      conversation_id: conversation.id,
      user_id: user.id,
      role: "assistant",
      mode,
      content: assistantContent || "[No model output]",
      model,
      created_at: now,
    };

    await insertMessage(env, assistantMessage);
    await env.DB.prepare(
      "UPDATE conversations SET model = ?, updated_at = ? WHERE id = ? AND user_id = ?",
    )
      .bind(model, now, conversation.id, user.id)
      .run();

    await writeSse(writer, "message.done", {
      conversationId: conversation.id,
      messageId: assistantMessage.id,
      title: conversation.title,
    });

    await writer.close();
    ctx.waitUntil(
      updateMemory(
        env,
        user.id,
        conversation.id,
        userMessage,
        assistantMessage,
      ),
    );
  } catch (error) {
    await writeSse(writer, "error", {
      error:
        error instanceof Error ? error.message : "OpenRouter stream failed",
    });
    await writer.close();
  }
}

async function runDeterministicStream(args: {
  request: Request;
  env: Env;
  user: SessionUser;
  conversation: ConversationRow;
  userMessage: MessageRow;
  mode: ShellMode;
  content: string;
  writer: WritableStreamDefaultWriter<Uint8Array>;
}) {
  const {
    request,
    env,
    user,
    conversation,
    userMessage,
    mode,
    content,
    writer,
  } = args;

  try {
    const now = Date.now();
    const assistantMessage: MessageRow = {
      id: randomId("msg"),
      conversation_id: conversation.id,
      user_id: user.id,
      role: "assistant",
      mode,
      content,
      model: INTERNAL_ROUTER_MODEL,
      metadata: JSON.stringify({ routeReason: "assistant-meta-question" }),
      created_at: now,
    };

    await insertMessage(env, assistantMessage);
    await env.DB.prepare(
      "UPDATE conversations SET model = ?, updated_at = ? WHERE id = ? AND user_id = ?",
    )
      .bind(INTERNAL_ROUTER_MODEL, now, conversation.id, user.id)
      .run();
    await incrementDailyUsage(env, user.id, "chat");
    await logUsageEvent({
      env,
      request,
      userId: user.id,
      eventType: "chat.meta",
      model: INTERNAL_ROUTER_MODEL,
      metadata: { mode, userMessageId: userMessage.id },
    });

    await writeSse(writer, "message.delta", { delta: content });
    await writeSse(writer, "message.done", {
      conversationId: conversation.id,
      messageId: assistantMessage.id,
      title: conversation.title,
    });
    await writer.close();
  } catch (error) {
    await writeSse(writer, "error", {
      error:
        error instanceof Error ? error.message : "Deterministic reply failed",
    });
    await writer.close();
  }
}

async function openOpenRouterStream(args: {
  request: Request;
  env: Env;
  models: string[];
  messages: Array<{ role: MessageRole; content: string }>;
}): Promise<{
  model: string;
  response: Response & { body: ReadableStream<Uint8Array> };
}> {
  const { request, env, models, messages } = args;
  let lastError: HttpError | undefined;

  for (const model of models) {
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer":
              env.OPENROUTER_HTTP_REFERER ||
              env.PUBLIC_ORIGIN ||
              new URL(request.url).origin,
            "X-Title": env.OPENROUTER_APP_TITLE || PRODUCT_NAME,
          },
          body: JSON.stringify({
            model,
            stream: true,
            messages,
          }),
        },
      );

      if (response.ok && response.body) {
        return {
          model,
          response: response as Response & {
            body: ReadableStream<Uint8Array>;
          },
        };
      }

      lastError = response.ok
        ? new HttpError(502, "OpenRouter stream body was empty")
        : await openRouterHttpError(response, model);
      if (!isRetryableOpenRouterError(lastError)) {
        break;
      }
    } catch (error) {
      lastError =
        error instanceof HttpError
          ? error
          : new HttpError(502, "OpenRouter stream failed before output");
      if (!isRetryableOpenRouterError(lastError)) {
        break;
      }
    }
  }

  throw cleanOpenRouterFailure(lastError);
}

async function buildPromptMessages(
  env: Env,
  userId: string,
  conversationId: string,
  mode: ShellMode,
  query: string,
  botId?: string | null,
): Promise<Array<{ role: MessageRole; content: string }>> {
  const [recentMessages, summary, memories, bot] = await Promise.all([
    getConversationMessages(env, userId, conversationId, 18, "DESC").then(
      (items) => items.reverse(),
    ),
    env.DB.prepare(
      "SELECT summary FROM conversation_summaries WHERE conversation_id = ? AND user_id = ?",
    )
      .bind(conversationId, userId)
      .first<{ summary: string }>(),
    getRelevantMemories(env, userId, query),
    botId ? getBotById(env, userId, botId) : Promise.resolve(null),
  ]);

  const memoryBlock = memories.length
    ? memories.map((item) => `- ${item.type}: ${item.content}`).join("\n")
    : "No long-term memory yet.";
  const system = [
    `You are ${PRODUCT_NAME}, a Cloudflare edge AI workspace assistant.`,
    `Active mode: ${mode}. ${MODE_PROMPTS[mode]}`,
    `Mode NLP configuration: ${MODE_NLP_INSTRUCTIONS[mode]}`,
    `Default free OpenRouter model for this mode: ${FREE_MODE_MODELS[mode]}. If the runtime selected another model, still follow this mode's behavior contract.`,
    bot
      ? [
          `Saved bot persona: ${bot.name}`,
          `Description: ${bot.description}`,
          `Tone: ${bot.tone}`,
          `System prompt:\n${bot.system_prompt}`,
          `Boundaries:\n${parseStringArray(bot.boundaries)
            .map((item) => `- ${item}`)
            .join("\n")}`,
          `Memory policy: ${bot.memory_policy}`,
          `Tools:\n${parseStringArray(bot.tools)
            .map((item) => `- ${item}`)
            .join("\n")}`,
        ].join("\n")
      : "No saved bot persona selected.",
    "Use the memory context only when it is relevant. If memory conflicts with the current request, prefer the current request.",
    `Conversation summary: ${summary?.summary || "No summary yet."}`,
    `Long-term memory:\n${memoryBlock}`,
  ].join("\n\n");

  return [
    { role: "system", content: system },
    ...recentMessages.map((message) => ({
      role: message.role,
      content: message.content,
    })),
  ];
}

async function getRelevantMemories(env: Env, userId: string, query: string) {
  if (env.MEMORY_INDEX && env.AI) {
    try {
      const vector = await embedText(env, query);
      if (vector) {
        const result = await env.MEMORY_INDEX.query(vector, {
          topK: 8,
          returnMetadata: "all",
          filter: { userId },
        });
        const ids = result.matches.map((match) => match.id).filter(Boolean);
        const rows = await getMemoryItemsByIds(env, userId, ids);
        if (rows.length) {
          return rows;
        }
      }
    } catch (error) {
      console.warn("Vector memory lookup failed", error);
    }
  }

  const fallback = await env.DB.prepare(
    "SELECT id, type, content FROM memory_items WHERE user_id = ? ORDER BY updated_at DESC LIMIT 8",
  )
    .bind(userId)
    .all<{ id: string; type: string; content: string }>();
  return fallback.results ?? [];
}

async function getMemoryItemsByIds(env: Env, userId: string, ids: string[]) {
  if (!ids.length) {
    return [];
  }

  const placeholders = ids.map(() => "?").join(",");
  const rows = await env.DB.prepare(
    `SELECT id, type, content FROM memory_items WHERE user_id = ? AND id IN (${placeholders})`,
  )
    .bind(userId, ...ids)
    .all<{ id: string; type: string; content: string }>();
  const byId = new Map((rows.results ?? []).map((row) => [row.id, row]));
  return ids
    .map((id) => byId.get(id))
    .filter((row): row is { id: string; type: string; content: string } =>
      Boolean(row),
    );
}

async function updateMemory(
  env: Env,
  userId: string,
  conversationId: string,
  userMessage: MessageRow,
  assistantMessage: MessageRow,
) {
  const now = Date.now();
  const recent = await getConversationMessages(
    env,
    userId,
    conversationId,
    24,
    "DESC",
  ).then((items) => items.reverse());
  const summary = clip(
    recent
      .slice(-12)
      .map((message) => `${message.role}: ${message.content}`)
      .join("\n"),
    5000,
  );

  await env.DB.prepare(
    "INSERT INTO conversation_summaries (conversation_id, user_id, summary, updated_at) VALUES (?, ?, ?, ?) ON CONFLICT(conversation_id) DO UPDATE SET summary = excluded.summary, updated_at = excluded.updated_at",
  )
    .bind(conversationId, userId, summary, now)
    .run();

  const memoryCandidates = extractMemoryCandidates(userMessage.content);
  for (const candidate of memoryCandidates) {
    const id = randomId("mem");
    await env.DB.prepare(
      "INSERT INTO memory_items (id, user_id, conversation_id, type, content, source_message_id, confidence, metadata, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    )
      .bind(
        id,
        userId,
        conversationId,
        candidate.type,
        candidate.content,
        userMessage.id,
        candidate.confidence,
        JSON.stringify({ source: "heuristic" }),
        now,
        now,
      )
      .run();

    if (env.MEMORY_INDEX && env.AI) {
      try {
        const vector = await embedText(env, candidate.content);
        const write = env.MEMORY_INDEX.upsert ?? env.MEMORY_INDEX.insert;
        if (vector && write) {
          await write.call(env.MEMORY_INDEX, [
            {
              id,
              values: vector,
              metadata: { userId, conversationId, type: candidate.type },
            },
          ]);
        }
      } catch (error) {
        console.warn("Vector memory write failed", error);
      }
    }
  }

  await env.DB.prepare(
    "INSERT INTO tool_events (id, user_id, conversation_id, event_type, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind(
      randomId("tool"),
      userId,
      conversationId,
      "chat.completed",
      JSON.stringify({
        userMessageId: userMessage.id,
        assistantMessageId: assistantMessage.id,
        memoryCandidates: memoryCandidates.length,
      }),
      now,
    )
    .run();
}

function extractMemoryCandidates(text: string) {
  const normalized = text.trim();
  const lower = normalized.toLowerCase();
  const shouldRemember =
    lower.includes("remember") ||
    lower.includes("benim ") ||
    lower.includes("bana ") ||
    lower.includes("tercih") ||
    lower.includes("prefer") ||
    lower.includes("i like") ||
    lower.includes("i use");

  if (!shouldRemember) {
    return [];
  }

  return [
    {
      type:
        lower.includes("prefer") ||
        lower.includes("tercih") ||
        lower.includes("i like")
          ? "preference"
          : "fact",
      content: clip(normalized, 800),
      confidence: 0.62,
    },
  ];
}

async function embedText(env: Env, text: string): Promise<number[] | null> {
  if (!env.AI) {
    return null;
  }

  const result = await env.AI.run(
    env.EMBEDDING_MODEL || "@cf/baai/bge-small-en-v1.5",
    { text: [text] },
  );

  if (Array.isArray(result) && typeof result[0] === "number") {
    return result as number[];
  }

  const data = result as { data?: number[][]; embeddings?: number[][] };
  return data.data?.[0] ?? data.embeddings?.[0] ?? null;
}

async function startOAuth(
  provider: "google" | "github",
  request: Request,
  env: Env,
) {
  if (!env.RATE_LIMIT) {
    return json(
      { error: "RATE_LIMIT KV binding is required for OAuth state" },
      503,
      request,
      env,
    );
  }

  const state = randomId("state");
  const frontendOrigin = env.PUBLIC_ORIGIN || new URL(request.url).origin;
  const oauthState: OAuthState = {
    provider,
    redirectTo: `${frontendOrigin}/chat`,
    createdAt: Date.now(),
  };

  let redirectUrl: URL;
  if (provider === "google") {
    if (!env.GOOGLE_CLIENT_ID || !env.GOOGLE_CLIENT_SECRET) {
      return json(
        { error: "Google OAuth is not configured" },
        503,
        request,
        env,
      );
    }

    oauthState.codeVerifier = randomToken();
    const codeChallenge = await pkceChallenge(oauthState.codeVerifier);
    redirectUrl = new URL("https://accounts.google.com/o/oauth2/v2/auth");
    redirectUrl.searchParams.set("client_id", env.GOOGLE_CLIENT_ID);
    redirectUrl.searchParams.set(
      "redirect_uri",
      callbackUrl(provider, request, env),
    );
    redirectUrl.searchParams.set("response_type", "code");
    redirectUrl.searchParams.set("scope", "openid email profile");
    redirectUrl.searchParams.set("state", state);
    redirectUrl.searchParams.set("code_challenge", codeChallenge);
    redirectUrl.searchParams.set("code_challenge_method", "S256");
    redirectUrl.searchParams.set("access_type", "online");
    redirectUrl.searchParams.set("prompt", "select_account");
  } else {
    if (!env.GITHUB_CLIENT_ID || !env.GITHUB_CLIENT_SECRET) {
      return json(
        { error: "GitHub OAuth is not configured" },
        503,
        request,
        env,
      );
    }

    redirectUrl = new URL("https://github.com/login/oauth/authorize");
    redirectUrl.searchParams.set("client_id", env.GITHUB_CLIENT_ID);
    redirectUrl.searchParams.set(
      "redirect_uri",
      callbackUrl(provider, request, env),
    );
    redirectUrl.searchParams.set("scope", "read:user user:email");
    redirectUrl.searchParams.set("state", state);
  }

  await env.RATE_LIMIT.put(`oauth:${state}`, JSON.stringify(oauthState), {
    expirationTtl: 600,
  });
  return Response.redirect(redirectUrl.toString(), 302);
}

async function finishOAuth(
  provider: "google" | "github",
  request: Request,
  env: Env,
) {
  if (!env.RATE_LIMIT) {
    return json(
      { error: "RATE_LIMIT KV binding is required for OAuth state" },
      503,
      request,
      env,
    );
  }

  const url = new URL(request.url);
  const code = url.searchParams.get("code");
  const state = url.searchParams.get("state");

  if (!code || !state) {
    return json(
      { error: "OAuth callback is missing code or state" },
      400,
      request,
      env,
    );
  }

  const stored = await env.RATE_LIMIT.get(`oauth:${state}`);
  await env.RATE_LIMIT.delete(`oauth:${state}`);

  if (!stored) {
    return json({ error: "OAuth state expired" }, 400, request, env);
  }

  const oauthState = JSON.parse(stored) as OAuthState;
  if (oauthState.provider !== provider) {
    return json({ error: "OAuth provider mismatch" }, 400, request, env);
  }

  const profile = await fetchOAuthProfile(
    provider,
    code,
    oauthState,
    request,
    env,
  );
  const user = await upsertOAuthUser(env, profile);
  const token = await createSession(env, user.id);
  const headers = new Headers({ Location: oauthState.redirectTo });
  appendSessionCookies(headers, token, request);

  return new Response(null, { status: 302, headers });
}

async function fetchOAuthProfile(
  provider: "google" | "github",
  code: string,
  state: OAuthState,
  request: Request,
  env: Env,
): Promise<OAuthProfile> {
  if (provider === "google") {
    const token = await fetchJson<{ access_token: string }>(
      "https://oauth2.googleapis.com/token",
      {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          client_id: env.GOOGLE_CLIENT_ID || "",
          client_secret: env.GOOGLE_CLIENT_SECRET || "",
          code,
          code_verifier: state.codeVerifier || "",
          grant_type: "authorization_code",
          redirect_uri: callbackUrl(provider, request, env),
        }),
      },
    );
    const info = await fetchJson<{
      sub: string;
      email?: string;
      name?: string;
      picture?: string;
    }>("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${token.access_token}` },
    });

    return {
      provider,
      providerUserId: info.sub,
      email: info.email || `${info.sub}@users.google.shadow.local`,
      name: info.name || info.email || "Google user",
      avatarUrl: info.picture,
    };
  }

  const token = await fetchJson<{ access_token: string }>(
    "https://github.com/login/oauth/access_token",
    {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: env.GITHUB_CLIENT_ID || "",
        client_secret: env.GITHUB_CLIENT_SECRET || "",
        code,
        redirect_uri: callbackUrl(provider, request, env),
      }),
    },
  );
  const info = await fetchJson<{
    id: number;
    login: string;
    name?: string;
    email?: string;
    avatar_url?: string;
  }>("https://api.github.com/user", {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "User-Agent": "Shadow-AI-Worker",
    },
  });
  const emails = await fetchJson<
    Array<{ email: string; primary: boolean; verified: boolean }>
  >("https://api.github.com/user/emails", {
    headers: {
      Authorization: `Bearer ${token.access_token}`,
      "User-Agent": "Shadow-AI-Worker",
    },
  }).catch(() => []);
  const email =
    info.email ||
    emails.find((item) => item.primary && item.verified)?.email ||
    `${info.login}@users.github.shadow.local`;

  return {
    provider,
    providerUserId: String(info.id),
    email,
    name: info.name || info.login,
    avatarUrl: info.avatar_url,
  };
}

async function upsertOAuthUser(env: Env, profile: OAuthProfile) {
  const now = Date.now();
  const existingAccount = await env.DB.prepare(
    "SELECT u.id, u.email, u.name, u.avatar_url FROM oauth_accounts oa JOIN users u ON u.id = oa.user_id WHERE oa.provider = ? AND oa.provider_user_id = ?",
  )
    .bind(profile.provider, profile.providerUserId)
    .first<UserRow>();

  const userId = existingAccount?.id || randomId("user");

  await env.DB.prepare(
    "INSERT INTO users (id, email, name, avatar_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?) ON CONFLICT(email) DO UPDATE SET name = excluded.name, avatar_url = excluded.avatar_url, updated_at = excluded.updated_at",
  )
    .bind(
      userId,
      profile.email,
      profile.name,
      profile.avatarUrl || null,
      now,
      now,
    )
    .run();

  const user = await env.DB.prepare(
    "SELECT id, email, name, avatar_url FROM users WHERE email = ?",
  )
    .bind(profile.email)
    .first<UserRow>();
  if (!user) {
    throw new Error("Could not create OAuth user");
  }

  await env.DB.prepare(
    "INSERT INTO oauth_accounts (provider, provider_user_id, user_id, email, name, avatar_url, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?) ON CONFLICT(provider, provider_user_id) DO UPDATE SET user_id = excluded.user_id, email = excluded.email, name = excluded.name, avatar_url = excluded.avatar_url, updated_at = excluded.updated_at",
  )
    .bind(
      profile.provider,
      profile.providerUserId,
      user.id,
      profile.email,
      profile.name,
      profile.avatarUrl || null,
      now,
      now,
    )
    .run();

  return user;
}

async function createSession(env: Env, userId: string) {
  const token = randomToken();
  const now = Date.now();
  await env.DB.prepare(
    "INSERT INTO sessions (id, user_id, token_hash, expires_at, created_at, last_seen_at) VALUES (?, ?, ?, ?, ?, ?)",
  )
    .bind(
      randomId("sess"),
      userId,
      await hashString(token),
      now + SESSION_TTL_SECONDS * 1000,
      now,
      now,
    )
    .run();
  return token;
}

async function getSessionUser(request: Request, env: Env) {
  const token = sessionTokenFromRequest(request);
  if (!token) {
    return null;
  }

  const now = Date.now();
  const user = await env.DB.prepare(
    "SELECT u.id, u.email, u.name, u.avatar_url, s.id AS session_id FROM sessions s JOIN users u ON u.id = s.user_id WHERE s.token_hash = ? AND s.expires_at > ?",
  )
    .bind(await hashString(token), now)
    .first<SessionUser>();

  if (user) {
    await env.DB.prepare("UPDATE sessions SET last_seen_at = ? WHERE id = ?")
      .bind(now, user.session_id)
      .run();
  }

  return user;
}

async function requireUser(request: Request, env: Env) {
  const user = await getSessionUser(request, env);
  if (!user) {
    throw new HttpError(401, "Authentication required");
  }
  return user;
}

async function logoutSession(request: Request, env: Env) {
  const token = sessionTokenFromRequest(request);
  if (!token) {
    return;
  }
  await env.DB.prepare("DELETE FROM sessions WHERE token_hash = ?")
    .bind(await hashString(token))
    .run();
}

async function createConversationFromMessage(
  env: Env,
  userId: string,
  mode: ShellMode,
  model: string,
  message: string,
  now: number,
) {
  const conversation: ConversationRow = {
    id: randomId("conv"),
    user_id: userId,
    title: titleFromMessage(message),
    mode,
    model,
    created_at: now,
    updated_at: now,
  };
  await insertConversation(env, conversation);
  return conversation;
}

async function insertConversation(env: Env, conversation: ConversationRow) {
  await env.DB.prepare(
    "INSERT INTO conversations (id, user_id, title, mode, model, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(
      conversation.id,
      conversation.user_id,
      conversation.title,
      conversation.mode,
      conversation.model,
      conversation.created_at,
      conversation.updated_at,
    )
    .run();
}

async function requireConversation(
  env: Env,
  userId: string,
  conversationId: string,
) {
  const conversation = await env.DB.prepare(
    "SELECT id, user_id, title, mode, model, created_at, updated_at FROM conversations WHERE id = ? AND user_id = ?",
  )
    .bind(conversationId, userId)
    .first<ConversationRow>();

  if (!conversation) {
    throw new HttpError(404, "Conversation not found");
  }

  return conversation;
}

async function insertMessage(env: Env, message: MessageRow) {
  await env.DB.prepare(
    "INSERT INTO messages (id, conversation_id, user_id, role, mode, content, model, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(
      message.id,
      message.conversation_id,
      message.user_id,
      message.role,
      message.mode,
      message.content,
      message.model,
      message.metadata ?? null,
      message.created_at,
    )
    .run();
}

async function getConversationMessages(
  env: Env,
  userId: string,
  conversationId: string,
  limit: number,
  order: "ASC" | "DESC",
) {
  const rows = await env.DB.prepare(
    `SELECT id, conversation_id, user_id, role, mode, content, model, metadata, created_at FROM messages WHERE user_id = ? AND conversation_id = ? ORDER BY created_at ${order} LIMIT ?`,
  )
    .bind(userId, conversationId, limit)
    .all<MessageRow>();
  return rows.results ?? [];
}

function resolveWorkersAiImageModels(env: Env, requestedModel?: string) {
  return Array.from(
    new Set(
      [requestedModel, env.CF_IMAGE_MODEL, DEFAULT_CF_IMAGE_MODEL]
        .map((model) => model?.trim())
        .filter((model): model is string => Boolean(model)),
    ),
  );
}

async function generateImageArtifact(args: {
  env: Env;
  input: string;
  controls: Record<string, unknown>;
  requestedModel?: string;
}): Promise<{ model: string; artifact: ModeArtifact }> {
  const { env, input, controls, requestedModel } = args;
  if (!env.AI) {
    throw new HttpError(
      503,
      "Workers AI image generation is not configured on this deployment.",
    );
  }

  const models = resolveWorkersAiImageModels(env, requestedModel);
  const model = models[0] ?? DEFAULT_CF_IMAGE_MODEL;
  const style = stringControl(controls, "style", "Photorealistic");
  const aspectRatio = stringControl(controls, "aspectRatio", "16:9");
  const quality = stringControl(controls, "quality", "HD");
  const count = Math.max(1, Math.min(numberControl(controls, "count", 1), 2));
  const { width, height } = imageDimensionsFor(aspectRatio, quality);
  const prompt = buildWorkersAiImagePrompt(input, style, aspectRatio, quality);
  const images: GeneratedImageArtifact[] = [];

  for (let index = 0; index < count; index += 1) {
    let result: unknown;
    try {
      result = await env.AI.run(model, {
        prompt:
          count > 1
            ? `${prompt}\nVariation ${index + 1}: keep the concept consistent but change the framing slightly.`
            : prompt,
        width,
        height,
      });
    } catch (error) {
      throw cleanWorkersAiImageFailure(error, input);
    }

    images.push(
      await normalizeGeneratedImage(result, {
        prompt,
        alt: titleFromMessage(input),
        width,
        height,
      }),
    );
  }

  const tr = prefersTurkish(input);
  return {
    model,
    artifact: {
      mode: "image",
      title: titleFromMessage(input),
      summary: tr
        ? `${images.length} adet görsel üretildi. İstersen farklı stil, oran veya kompozisyonla yeni varyasyonlar hazırlayabilirim.`
        : `${images.length} image generated. I can create new variations with a different style, ratio, or composition if you want.`,
      images,
      sections: [
        {
          heading: tr ? "Render ayarları" : "Render settings",
          items: [
            `${tr ? "Stil" : "Style"}: ${style}`,
            `${tr ? "Oran" : "Ratio"}: ${aspectRatio}`,
            `${tr ? "Kalite" : "Quality"}: ${quality}`,
            `${tr ? "Boyut" : "Size"}: ${width}x${height}`,
            `Model: ${model}`,
          ],
        },
        {
          heading: tr ? "Prompt notları" : "Prompt notes",
          body: prompt,
        },
      ],
      actions: tr
        ? [
            "İstersen farklı bir sanat stili veya kamera açısıyla yeni bir varyasyon oluşturabilirim.",
            "Aynı görseli poster, kare sosyal medya ya da dikey story oranına da çevirebilirim.",
          ]
        : [
            "Ask for another variation with a different art style or camera angle.",
            "I can also regenerate this for poster, square social, or vertical story formats.",
          ],
      metadata: {
        provider: "workers-ai",
        selectedModel: model,
        aspectRatio,
        quality,
        imageCount: images.length,
      },
    },
  };
}

async function callOpenRouterJson(args: {
  request: Request;
  env: Env;
  models: string[];
  mode: ShellMode;
  input: string;
  controls: Record<string, unknown>;
}): Promise<{ model: string; artifact: unknown }> {
  const { request, env, models, mode, input, controls } = args;
  const strictJson = mode === "resume" || mode === "bot" || mode === "canvas";
  const timeoutMs = openRouterJsonTimeout(env, mode);
  const responseLanguage = preferredResponseLanguage(controls, input);
  let lastError: HttpError | undefined;

  for (const model of models) {
    const controller = new AbortController();
    const timeout = globalThis.setTimeout(() => controller.abort(), timeoutMs);
    try {
      const response = await fetch(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          method: "POST",
          signal: controller.signal,
          headers: {
            Authorization: `Bearer ${env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
            "HTTP-Referer":
              env.OPENROUTER_HTTP_REFERER ||
              env.PUBLIC_ORIGIN ||
              new URL(request.url).origin,
            "X-Title": env.OPENROUTER_APP_TITLE || PRODUCT_NAME,
          },
          body: JSON.stringify({
            model,
            stream: false,
            response_format: { type: "json_object" },
            temperature: mode === "canvas" ? 0.2 : 0.4,
            max_tokens: mode === "canvas" ? 3200 : 2600,
            messages: [
              {
                role: "system",
                content: [
                  `You are ${PRODUCT_NAME}'s structured mode runner.`,
                  "Return only valid JSON. Do not wrap it in Markdown.",
                  `Active mode: ${mode}. ${MODE_PROMPTS[mode]}`,
                  `Mode NLP configuration: ${MODE_NLP_INSTRUCTIONS[mode]}`,
                  `Free OpenRouter model selected for this run: ${model}. Be concise and structured because free models may have stricter throughput limits.`,
                  ARTIFACT_SCHEMA_DESCRIPTION,
                  "The artifact mode field must exactly match the active mode.",
                  `Explicit response language: ${responseLanguage.label}.`,
                  "Do not switch to another language unless the user explicitly asks for it.",
                  "Follow the user's input language for all user-facing text unless the user explicitly asks otherwise.",
                  "For resume mode, produce a PDF-ready CV that works with both ATS professional and modern visual templates.",
                  "For bot mode, produce a reusable saved persona that can be used as a future chat system prompt.",
                  mode === "canvas"
                    ? [
                        "For canvas mode, populate the canvas field with template, changes, changedFiles, and optional previewNotes.",
                        "Allowed react files: App.tsx, styles.css, index.html. Allowed html files: index.html, styles.css, script.js.",
                        "Only modify the files that are necessary. Prefer minimal diffs and do not invent extra files.",
                        "If the user asks for a homepage, landing page, product page, campaign page, or full website section, prefer a full-viewport composition instead of a single centered card.",
                        "It is acceptable to rewrite the main layout files when the existing workspace shell is too small for the requested page.",
                        "Do not return a strategy memo, content brief, or checklist instead of code. The user expects runnable file contents now.",
                        "Your summary must explain what you built and why it fits the brief in 2-4 sentences.",
                        "Your sections should describe implementation decisions, not generic marketing advice.",
                        "Avoid generic placeholder copy like 'Build full-page concepts' unless the user explicitly asked for a blank starter.",
                        "The preview runtime exposes global React and ReactDOM in the iframe. Do not add package installs or imports from npm.",
                      ].join("\n")
                    : "",
                  `Controls: ${JSON.stringify(controls)}`,
                ].join("\n\n"),
              },
              { role: "user", content: input },
            ],
          }),
        },
      );

      if (!response.ok) {
        throw await openRouterHttpError(response, model);
      }

      const data = (await response.json()) as {
        choices?: Array<{ message?: { content?: string } }>;
      };
      const content = data.choices?.[0]?.message?.content;

      if (!content) {
        throw new HttpError(502, "OpenRouter did not return artifact JSON");
      }

      try {
        return { model, artifact: parseModelJson(content) };
      } catch (error) {
        if (!strictJson) {
          return {
            model,
            artifact: createTextArtifactPayload(mode, input, content),
          };
        }
        throw error;
      }
    } catch (error) {
      lastError =
        error instanceof HttpError
          ? error
          : error instanceof Error && error.name === "AbortError"
            ? new HttpError(
                504,
                `OpenRouter timed out on ${model} after ${timeoutMs}ms`,
              )
            : new HttpError(502, "OpenRouter artifact generation failed");
      if (!isRetryableOpenRouterError(lastError)) {
        break;
      }
    } finally {
      globalThis.clearTimeout(timeout);
    }
  }

  throw cleanOpenRouterFailure(lastError);
}

function openRouterJsonTimeout(env: Env, mode: ShellMode) {
  const fallback = mode === "canvas" ? 20_000 : 28_000;
  const parsed = Number(env.OPENROUTER_JSON_TIMEOUT_MS || fallback);
  if (!Number.isFinite(parsed)) {
    return fallback;
  }
  return Math.max(8_000, Math.min(parsed, 60_000));
}

function buildWorkersAiImagePrompt(
  input: string,
  style: string,
  aspectRatio: string,
  quality: string,
) {
  return [
    input.trim(),
    `Style: ${style}.`,
    `Aspect ratio: ${aspectRatio}.`,
    `Quality target: ${quality}.`,
    "Make the image visually polished and production-ready.",
    "Do not include visible text, logos, or watermarks unless the user explicitly asked for them.",
  ].join(" ");
}

function imageDimensionsFor(aspectRatio: string, quality: string) {
  const baseByRatio: Record<string, { width: number; height: number }> = {
    "1:1": { width: 768, height: 768 },
    "16:9": { width: 1024, height: 576 },
    "9:16": { width: 576, height: 1024 },
    "4:3": { width: 960, height: 720 },
    "3:4": { width: 720, height: 960 },
  };
  const preset = baseByRatio[aspectRatio] ?? baseByRatio["16:9"];
  const multiplier =
    quality === "Ultra" ? 1.25 : quality === "Standard" ? 0.75 : 1;

  return {
    width: roundImageDimension(preset.width * multiplier),
    height: roundImageDimension(preset.height * multiplier),
  };
}

function roundImageDimension(value: number) {
  return Math.max(512, Math.round(value / 64) * 64);
}

async function normalizeGeneratedImage(
  result: unknown,
  fallback: {
    prompt: string;
    alt: string;
    width: number;
    height: number;
  },
): Promise<GeneratedImageArtifact> {
  const direct = extractInlineGeneratedImage(result, fallback);
  if (direct) {
    return direct;
  }

  let bytes: Uint8Array | undefined;
  if (result instanceof Response) {
    bytes = new Uint8Array(await result.arrayBuffer());
  } else if (result instanceof ArrayBuffer) {
    bytes = new Uint8Array(result);
  } else if (ArrayBuffer.isView(result)) {
    bytes = new Uint8Array(
      result.buffer.slice(
        result.byteOffset,
        result.byteOffset + result.byteLength,
      ),
    );
  } else if (result instanceof ReadableStream) {
    bytes = new Uint8Array(await new Response(result).arrayBuffer());
  } else if (result instanceof Blob) {
    bytes = new Uint8Array(await result.arrayBuffer());
  }

  if (!bytes?.byteLength) {
    throw new HttpError(
      502,
      "Workers AI did not return a renderable image payload.",
    );
  }

  const mimeType = "image/png";
  return {
    dataUrl: `data:${mimeType};base64,${bytesToBase64(bytes)}`,
    mimeType,
    alt: fallback.alt,
    prompt: fallback.prompt,
    width: fallback.width,
    height: fallback.height,
  };
}

function extractInlineGeneratedImage(
  result: unknown,
  fallback: {
    prompt: string;
    alt: string;
    width: number;
    height: number;
  },
): GeneratedImageArtifact | null {
  if (!isRecord(result)) {
    return null;
  }

  const base64 =
    optionalString(result.image) ??
    optionalString(result.base64) ??
    optionalString(result.b64_json) ??
    optionalString(result.result);
  if (!base64) {
    const nested = isRecord(result.result)
      ? extractInlineGeneratedImage(result.result, fallback)
      : null;
    if (nested) {
      return nested;
    }
    return null;
  }

  const mimeType =
    optionalString(result.mimeType) ??
    optionalString(result.mime_type) ??
    optionalString(result.contentType) ??
    "image/png";
  const dataUrl = base64.startsWith("data:")
    ? base64
    : `data:${mimeType};base64,${base64}`;

  return {
    dataUrl,
    mimeType,
    alt: optionalString(result.alt) ?? fallback.alt,
    prompt: optionalString(result.prompt) ?? fallback.prompt,
    width: typeof result.width === "number" ? result.width : fallback.width,
    height: typeof result.height === "number" ? result.height : fallback.height,
  };
}

function bytesToBase64(bytes: Uint8Array) {
  let binary = "";
  const chunkSize = 0x8000;
  for (let index = 0; index < bytes.length; index += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(index, index + chunkSize));
  }
  return btoa(binary);
}

function stringControl(
  controls: Record<string, unknown>,
  key: string,
  fallback: string,
) {
  const value = controls[key];
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function numberControl(
  controls: Record<string, unknown>,
  key: string,
  fallback: number,
) {
  const value = controls[key];
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }
  if (typeof value === "string") {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) {
      return parsed;
    }
  }
  return fallback;
}

function parseModelJson(content: string) {
  try {
    return JSON.parse(content) as unknown;
  } catch {
    const start = content.indexOf("{");
    const end = content.lastIndexOf("}");
    if (start >= 0 && end > start) {
      try {
        return JSON.parse(content.slice(start, end + 1)) as unknown;
      } catch {
        // Fall through to the structured upstream error below.
      }
    }
  }

  throw new HttpError(502, "OpenRouter returned invalid artifact JSON");
}

function createMetaArtifact(
  mode: ShellMode,
  input: string,
  models: string[],
): ModeArtifact {
  const tr = prefersTurkish(input);
  const modeName = modeLabelForResponse(mode, tr);
  const primary = models[0] ?? FREE_MODE_MODELS[mode];
  const summary =
    mode === "image"
      ? tr
        ? `Ben ${PRODUCT_NAME} içinde çalışan ${modeName} moduyum. Bu mod görselleri Workers AI üzerinden ${primary} ile üretir.`
        : `I am the ${modeName} mode inside ${PRODUCT_NAME}. This mode renders images with Workers AI using ${primary}.`
      : mode === "canvas"
        ? tr
          ? `Ben ${PRODUCT_NAME} içindeki ${modeName} moduyum. Bu mod canlı önizlemeli küçük frontend workspace dosyaları üretir ve varsayılan olarak ${primary} ile yapılandırılmış patch'ler hazırlar.`
          : `I am the ${modeName} mode inside ${PRODUCT_NAME}. This mode prepares structured file patches for a live frontend workspace and defaults to ${primary}.`
        : tr
          ? `Ben ${PRODUCT_NAME} içinde çalışan ${modeName} moduyum. Bu modda önce ${primary} denenir; rate-limit olursa ücretsiz fallback modellerine geçilir.`
          : `I am the ${modeName} mode inside ${PRODUCT_NAME}. This mode tries ${primary} first, then falls back across free models if rate-limited.`;

  return {
    mode,
    title: tr ? "Model bilgisi" : "Model status",
    summary,
    sections: [
      {
        heading: tr ? "Model durumu" : "Model routing",
        body: summary,
        items: models.map((model, index) =>
          mode === "image"
            ? tr
              ? `${index === 0 ? "Aktif" : "Alternatif"}: ${model}`
              : `${index === 0 ? "Active" : "Alternative"}: ${model}`
            : index === 0
              ? tr
                ? `Birincil: ${model}`
                : `Primary: ${model}`
              : tr
                ? `Fallback: ${model}`
                : `Fallback: ${model}`,
        ),
      },
      {
        heading: tr ? "Bu mod ne yapar?" : "What this mode does",
        body: MODE_PROMPTS[mode],
      },
    ],
    actions: tr
      ? [
          "CV, kod, SEO, e-posta, bot veya içerik isteğini doğrudan yazabilirsin.",
          "Daha net artifact için hedef, format ve örnek veri paylaş.",
        ]
      : [
          "Ask directly for a resume, code, SEO, email, bot, or content artifact.",
          "For better artifacts, include the goal, format, and source details.",
        ],
    metadata: {
      deterministic: true,
      routeReason: "assistant-meta-question",
      primaryModel: primary,
      fallbackModels: models,
    },
  };
}

function createMetaResponseText(
  mode: ShellMode,
  input: string,
  models: string[],
) {
  const tr = prefersTurkish(input);
  const modeName = modeLabelForResponse(mode, tr);
  const primary = models[0] ?? FREE_MODE_MODELS[mode];
  if (mode === "image") {
    return tr
      ? [
          `Ben ${PRODUCT_NAME} içinde çalışan ${modeName} moduyum.`,
          `Bu mod görselleri Workers AI üzerinden ${primary} ile üretir.`,
          "İstersen aynı fikri farklı stil, oran veya kompozisyonla yeniden çizebilirim.",
        ].join(" ")
      : [
          `I am the ${modeName} mode inside ${PRODUCT_NAME}.`,
          `This mode renders images with Workers AI using ${primary}.`,
          "I can redraw the same concept with a different style, aspect ratio, or composition if you want.",
        ].join(" ");
  }
  if (mode === "canvas") {
    return tr
      ? [
          `Ben ${PRODUCT_NAME} içinde çalışan ${modeName} moduyum.`,
          `Bu mod canlı önizleme için küçük frontend dosya patch'leri üretir ve varsayılan olarak ${primary} kullanır.`,
          "İstersen React veya HTML canvas workspace'i için bileşen, stil ve etkileşim güncellemeleri hazırlayabilirim.",
        ].join(" ")
      : [
          `I am the ${modeName} mode inside ${PRODUCT_NAME}.`,
          `This mode prepares small frontend file patches for the live preview workspace and defaults to ${primary}.`,
          "I can draft component, styling, and interaction updates for a React or HTML canvas workspace.",
        ].join(" ");
  }
  return tr
    ? [
        `Ben ${PRODUCT_NAME} içinde çalışan ${modeName} moduyum.`,
        `Bu modda önce ${primary} denenir; provider rate-limit verirse sıradaki ücretsiz fallback modellere geçerim.`,
        "CV, kod, SEO, e-posta, bot, içerik, görsel, video senaryosu veya ses metni istediğinde otomatik olarak en uygun moda yönlenebilirim.",
      ].join(" ")
    : [
        `I am the ${modeName} mode inside ${PRODUCT_NAME}.`,
        `This mode tries ${primary} first and falls back to the next free models if a provider rate-limits.`,
        "When you ask for a resume, code, SEO, email, bot, content, image, video script, or voice script, I can route to the best matching mode.",
      ].join(" ");
}

function createResumeNeedsInfoArtifact(input: string): ModeArtifact {
  const tr = prefersTurkish(input);
  return {
    mode: "resume",
    title: tr ? "CV bilgileri gerekli" : "Resume details needed",
    summary: tr
      ? "PDF CV oluşturabilmem için aday bilgileri eksik. Şimdilik placeholder CV üretmiyorum; önce temel bilgileri paylaşmanı isteyeceğim."
      : "I need candidate details before creating a PDF resume. I will not generate a placeholder resume without source information.",
    sections: [
      {
        heading: tr ? "Gerekli bilgiler" : "Required details",
        items: tr
          ? [
              "Ad soyad ve hedef pozisyon",
              "İletişim: e-posta, şehir, LinkedIn/GitHub varsa",
              "İş deneyimleri: şirket, rol, tarih, somut katkılar",
              "Eğitim ve sertifikalar",
              "Teknik/mesleki beceriler ve projeler",
            ]
          : [
              "Full name and target role",
              "Contact info: email, location, LinkedIn/GitHub if available",
              "Experience: company, role, dates, concrete impact",
              "Education and certifications",
              "Skills and projects",
            ],
      },
      {
        heading: tr ? "Örnek giriş" : "Example input",
        body: tr
          ? "Adım ..., hedef rolüm ..., son işim ..., kullandığım teknolojiler ..., eğitimim ..."
          : "My name is ..., my target role is ..., my last role was ..., my technologies are ..., my education is ...",
      },
    ],
    actions: tr
      ? [
          "Bilgileri gönderdiğinde ATS ve modern görsel PDF seçenekleriyle CV hazırlayacağım.",
        ]
      : [
          "Send the details and I will prepare a resume with ATS and modern visual PDF options.",
        ],
    metadata: {
      deterministic: true,
      routeReason: "resume-details-missing",
    },
  };
}

function createImageClarificationArtifact(input: string): ModeArtifact {
  const tr = prefersTurkish(input);
  return {
    mode: "image",
    title: titleFromMessage(input),
    summary: tr
      ? "Bu görsel isteği yaş açısından belirsiz görünüyor. Görsel sağlayıcısı bunu güvenlik nedeniyle engelleyebilir; lütfen yetişkin ve daha net bir tanım kullan."
      : "This image request is age-ambiguous. The image provider may block it for safety reasons, so please rephrase it with a clear adult-safe description.",
    sections: [
      {
        heading: tr
          ? "Neden açıklama gerekiyor?"
          : "Why clarification is needed",
        body: tr
          ? "Tek kelimelik veya yaş belirsiz insan tanımları, görsel modeller tarafından çocuk/ergen içerik riski olarak yorumlanabiliyor."
          : "Single-word or age-ambiguous people prompts can be interpreted by image models as minor-related content risk.",
      },
      {
        heading: tr ? "Daha iyi örnekler" : "Better examples",
        items: tr
          ? [
              "kırmızı montlu yetişkin kadın portresi",
              "orman içinde yürüyen genç kadın, sinematik ışık",
              "kahve içen yetişkin kadın, fotogerçekçi portre",
            ]
          : [
              "adult woman portrait in a red coat",
              "young woman walking in a forest, cinematic light",
              "adult woman drinking coffee, photorealistic portrait",
            ],
      },
    ],
    actions: tr
      ? [
          "İstersen aynı isteği güvenli bir yetişkin tanımıyla benim için yeniden yazdır.",
        ]
      : [
          "If you want, ask me to rewrite the prompt with a safe adult description.",
        ],
    metadata: {
      deterministic: true,
      routeReason: "image-clarification-needed",
    },
  };
}

function normalizeCanvasTemplate(value: unknown): CanvasTemplate {
  return value === "html" ? "html" : "react";
}

function normalizeCanvasWorkspace(value: unknown): CanvasWorkspaceData {
  if (!isRecord(value)) {
    throw new Error("Canvas workspace payload must be an object.");
  }

  const template = normalizeCanvasTemplate(value.template);
  const allowedFiles = CANVAS_TEMPLATE_FILES[template];
  const sourceFiles = isRecord(value.files) ? value.files : {};
  const files: Record<string, string> = {};
  let totalBytes = 0;

  for (const path of allowedFiles) {
    const raw = sourceFiles[path];
    const next = typeof raw === "string" ? raw : "";
    const clipped = next.slice(0, CANVAS_FILE_LIMIT);
    totalBytes += clipped.length;
    files[path] = clipped;
  }

  if (totalBytes > CANVAS_TOTAL_LIMIT) {
    throw new Error("Canvas workspace is too large for this preview runtime.");
  }

  const activeFile =
    typeof value.activeFile === "string" &&
    allowedFiles.includes(value.activeFile)
      ? value.activeFile
      : allowedFiles[0];

  return {
    template,
    files,
    activeFile,
    updatedAt:
      typeof value.updatedAt === "number" && Number.isFinite(value.updatedAt)
        ? value.updatedAt
        : Date.now(),
  };
}

function normalizeCanvasArtifact(
  value: unknown,
  fallbackTemplate: CanvasTemplate = "react",
): CanvasArtifactData {
  const data = isRecord(value) ? value : {};
  const template = normalizeCanvasTemplate(data.template ?? fallbackTemplate);
  const allowedFiles = CANVAS_TEMPLATE_FILES[template];
  const changes = normalizeCanvasChanges(data.changes, template);
  const changedFiles = normalizeStringArray(
    data.changedFiles,
    changes.map((change) => change.path),
  ).filter((path) => allowedFiles.includes(path));
  const previewNotes = normalizeStringArray(data.previewNotes, []);

  return {
    template,
    changes,
    changedFiles: changedFiles.length
      ? changedFiles
      : changes.map((change) => change.path),
    ...(previewNotes.length ? { previewNotes } : {}),
  };
}

function normalizeCanvasChanges(
  value: unknown,
  template: CanvasTemplate,
): CanvasChange[] {
  if (!Array.isArray(value)) {
    return [];
  }

  const allowedFiles = CANVAS_TEMPLATE_FILES[template];
  const changes: CanvasChange[] = [];
  for (const item of value) {
    if (!isRecord(item) || typeof item.path !== "string") {
      continue;
    }
    const normalizedPath = normalizeCanvasPath(item.path, template);
    if (!allowedFiles.includes(normalizedPath)) {
      continue;
    }

    const operation = item.operation === "delete" ? "delete" : "upsert";
    const change: CanvasChange = {
      path: normalizedPath,
      operation,
    };
    if (operation === "upsert") {
      change.content =
        typeof item.content === "string"
          ? item.content.slice(0, CANVAS_FILE_LIMIT)
          : "";
    }
    changes.push(change);
  }
  return changes;
}

function normalizeCanvasPath(path: string, template: CanvasTemplate) {
  const normalized = path.trim().replace(/\\/g, "/");
  const lower = normalized.toLowerCase();

  if (template === "react") {
    if (
      [
        "app.tsx",
        "app.jsx",
        "page.tsx",
        "page.jsx",
        "index.tsx",
        "index.jsx",
        "src/app.tsx",
        "src/app.jsx",
        "src/index.tsx",
        "src/index.jsx",
        "pages/index.tsx",
        "pages/index.jsx",
        "app/page.tsx",
        "app/page.jsx",
      ].includes(lower)
    ) {
      return "App.tsx";
    }

    if (
      [
        "styles.css",
        "index.css",
        "globals.css",
        "global.css",
        "src/styles.css",
        "src/index.css",
        "src/globals.css",
        "src/global.css",
        "app/globals.css",
        "styles/global.css",
      ].includes(lower)
    ) {
      return "styles.css";
    }

    if (["index.html", "public/index.html", "src/index.html"].includes(lower)) {
      return "index.html";
    }
  }

  if (template === "html") {
    if (
      [
        "index.html",
        "public/index.html",
        "src/index.html",
        "pages/index.html",
      ].includes(lower)
    ) {
      return "index.html";
    }

    if (
      [
        "styles.css",
        "index.css",
        "globals.css",
        "global.css",
        "src/styles.css",
        "src/index.css",
        "src/globals.css",
        "app/globals.css",
      ].includes(lower)
    ) {
      return "styles.css";
    }

    if (
      [
        "script.js",
        "index.js",
        "main.js",
        "src/script.js",
        "src/index.js",
        "src/main.js",
      ].includes(lower)
    ) {
      return "script.js";
    }
  }

  return normalized;
}

function canvasWorkspaceToRow(
  conversationId: string,
  userId: string,
  workspace: CanvasWorkspaceData,
): CanvasWorkspaceRow {
  const normalized = normalizeCanvasWorkspace(workspace);
  return {
    conversation_id: conversationId,
    user_id: userId,
    template: normalized.template,
    files_json: JSON.stringify(normalized.files),
    active_file: normalized.activeFile,
    updated_at: normalized.updatedAt ?? Date.now(),
  };
}

function canvasWorkspaceFromRow(row: CanvasWorkspaceRow): CanvasWorkspaceData {
  const files = parseJsonObject(row.files_json) ?? {};
  return normalizeCanvasWorkspace({
    template: row.template,
    files,
    activeFile: row.active_file,
    updatedAt: row.updated_at,
  });
}

function createTextArtifactPayload(
  mode: ShellMode,
  input: string,
  content: string,
) {
  const title = titleFromMessage(input);
  const summary = clip(content.replace(/\s+/g, " ").trim(), 500);
  return {
    title,
    summary: summary || `${title} artifact is ready.`,
    sections: [
      {
        heading: "Model output",
        body: clip(content.trim() || summary || title, 4000),
      },
    ],
    actions: [
      "Ask for a more specific structure if you want a tighter artifact.",
    ],
    metadata: {
      fallback: true,
      fallbackReason: "invalid-json-wrapped-as-artifact",
    },
  };
}

function detectCanvasFallbackConcept(input: string) {
  const lower = input.toLowerCase();
  if (
    /\b(spor|fitness|gym|pilates|yoga|antrenman|wellness|workout)\b/i.test(
      lower,
    )
  ) {
    return "gym" as const;
  }
  if (/\b(hayvanat|zoo|animal|wildlife|safari|aquarium)\b/i.test(lower)) {
    return "zoo" as const;
  }
  if (
    /\b(e-commerce|ecommerce|shop|store|product|catalog|checkout|cart|retail|fashion)\b/i.test(
      lower,
    )
  ) {
    return "ecommerce" as const;
  }
  return "generic" as const;
}

function createCanvasFallbackArtifact(
  input: string,
  controls: Record<string, unknown>,
  attemptedModel?: string,
): ModeArtifact {
  const template = controls.canvasTemplate === "html" ? "html" : "react";
  const tr = prefersTurkish(input);
  const concept = detectCanvasFallbackConcept(input);
  const title = titleFromMessage(input);
  const files: Record<string, string> =
    template === "html"
      ? createHtmlCanvasFiles({ tr, concept, title })
      : createReactCanvasFiles({ tr, concept, title });
  const changedFiles = Object.keys(files);
  const changes: CanvasChange[] = changedFiles.map((path) => ({
    path,
    operation: "upsert",
    content: files[path],
  }));

  return {
    mode: "canvas",
    title,
    summary: tr
      ? "Canvas icin dogrudan calisan bir tam sayfa landing page hazirladim. Saglam bir ilk ekran, destekleyici bolumler ve net CTA akisini birlikte kurdum; istersen bunu daha premium, daha kurumsal ya da daha agresif satis odakli bir yone cekebilirim."
      : "I prepared a working full-page landing page for the canvas with a stronger first screen, supporting sections, and a clear CTA flow. I can push it further toward a more premium, corporate, or conversion-heavy direction if you want.",
    sections: [
      {
        heading: tr ? "Ne yaptim" : "What I built",
        items: tr
          ? [
              `${template === "react" ? "React" : "HTML"} tabanli tam sayfa bir hero alani kurdum.`,
              "Destekleyici bolumler, metrik bandi, sosyal kanit ve CTA akislarini ekledim.",
              "Canli onizlemede direkt calisacak sekilde tek canvas workspace icinde tuttum.",
            ]
          : [
              `Built a full-page ${template === "react" ? "React" : "HTML"} hero section.`,
              "Added supporting sections, a metric band, social proof, and CTA flow.",
              "Kept everything inside one canvas workspace so it runs directly in the live preview.",
            ],
      },
      {
        heading: tr ? "Neden bu yapi" : "Why this structure",
        body: tr
          ? "Kullanici daha ilk ekranda teklif, guven sinyali ve sonraki adimi goruyor. Bu yuzden sayfa kart hissinden cikiyor ve daha gercek bir landing page akisi veriyor."
          : "The visitor sees the offer, trust signals, and next action in the first screen. That moves the page away from a single-card feel and toward a real landing-page flow.",
      },
      {
        heading: tr ? "Canvas degisiklikleri" : "Canvas changes",
        items: changedFiles.map(
          (path) => `${template === "react" ? "React" : "HTML"} · ${path}`,
        ),
      },
      {
        heading: tr ? "Sonraki adimlar" : "Next actions",
        items: tr
          ? [
              "Renk yonunu, tipografiyi veya hedef kitle tonunu soyle ve sayfayi buna gore keskinlestireyim.",
              "Istersen uyelik paketleri, egitmen kartlari, referanslar veya form alanlari ekleyebilirim.",
            ]
          : [
              "Tell me the color direction, typography, or audience tone and I will refine the page around it.",
              "I can also add pricing, trainer cards, testimonials, or lead capture sections next.",
            ],
      },
    ],
    actions: tr
      ? [
          "Istersen bunu daha luks, daha sportif ya da daha kurumsal bir yone tasiyayim.",
        ]
      : [
          "If you want, I can push this toward a more luxurious, energetic, or corporate direction.",
        ],
    canvas: {
      template,
      changes,
      changedFiles,
      previewNotes: tr
        ? [
            attemptedModel
              ? `${attemptedModel} dogrudan uygulanabilir canvas dosyalari donmeyince guvenli fallback scaffold kullanildi.`
              : "Provider dogrudan uygulanabilir canvas dosyalari donmeyince guvenli fallback scaffold kullanildi.",
          ]
        : [
            attemptedModel
              ? `Safe fallback scaffold was used because ${attemptedModel} did not return directly usable canvas files.`
              : "Safe fallback scaffold was used because the provider did not return directly usable canvas files.",
          ],
    },
    metadata: {
      deterministic: true,
      routeReason: "canvas-fallback-scaffold",
      ...(attemptedModel ? { attemptedModel } : {}),
      selectedModel: INTERNAL_ROUTER_MODEL,
    },
  };
}

function createGymReactCanvasFiles(tr: boolean) {
  return {
    "App.tsx": `export default function App() {
  const programs = [
    {
      label: "${tr ? "Performans" : "Performance"}",
      title: "${tr ? "Kuvvet, kondisyon ve fonksiyonel akislari tek zeminde birlestir." : "Bring strength, conditioning, and functional training onto one floor."}",
      body: "${tr ? "Premium ekipman hatti, PT seanslari ve kucuk grup formatlariyla her seviyede net bir ilerleme sun." : "Use premium equipment lines, PT sessions, and small-group formats to create clear progress for every level."}"
    },
    {
      label: "${tr ? "Topluluk" : "Community"}",
      title: "${tr ? "Koclar, dersler ve kulup hissi ile uyeligi bir rutine donustur." : "Turn membership into a routine with coaches, classes, and a club-like atmosphere."}",
      body: "${tr ? "Yuksek enerji veren ders takvimi, recovery alanlari ve uye deneyimi odakli iletisim katmanlari kur." : "Build an energetic class calendar, recovery zones, and experience-led member communication layers."}"
    },
    {
      label: "${tr ? "Donusum" : "Conversion"}",
      title: "${tr ? "Deneme randevusu, paket secimi ve ziyaret bilgisini ayni akista tut." : "Keep trial booking, package selection, and visit details in the same conversion flow."}",
      body: "${tr ? "Hero'dan fiyatlara, referanslardan konum CTA'sina kadar karar yolunu kisa ve guven verici tasarla." : "Design the decision path from hero to pricing, testimonials, and the visit CTA to feel short and trustworthy."}"
    }
  ];

  const tiers = [
    {
      name: "${tr ? "Start" : "Start"}",
      price: "${tr ? "₺2.490" : "$89"}",
      note: "${tr ? "Aylik uyelik" : "Monthly membership"}",
      items: ["${tr ? "Kulup alani" : "Club floor"}", "${tr ? "Grup dersleri" : "Group classes"}", "${tr ? "1 deneme analizi" : "1 intro assessment"}"]
    },
    {
      name: "${tr ? "Prime" : "Prime"}",
      price: "${tr ? "₺3.790" : "$129"}",
      note: "${tr ? "En populer plan" : "Most popular"}",
      items: ["${tr ? "Tum grup dersleri" : "All group classes"}", "${tr ? "2 PT seansi" : "2 PT sessions"}", "${tr ? "Recovery alani" : "Recovery access"}"]
    },
    {
      name: "${tr ? "Elite" : "Elite"}",
      price: "${tr ? "₺5.490" : "$179"}",
      note: "${tr ? "Yuksek temasli paket" : "High-touch package"}",
      items: ["${tr ? "Sinirsiz PT planlamasi" : "Flexible PT planning"}", "${tr ? "Beslenme takibi" : "Nutrition tracking"}", "${tr ? "Oncelikli rezervasyon" : "Priority booking"}"]
    }
  ];

  return (
    <main className="page">
      <section className="heroShell">
        <header className="topbar">
          <div>
            <p className="brand">FORGE ATHLETIC CLUB</p>
            <p className="microcopy">${tr ? "Besiktas · performance club" : "Besiktas · performance club"}</p>
          </div>
          <nav className="nav">
            <a href="#programs">${tr ? "Programlar" : "Programs"}</a>
            <a href="#plans">${tr ? "Uyelikler" : "Memberships"}</a>
            <a href="#visit">${tr ? "Ziyaret" : "Visit"}</a>
          </nav>
        </header>

        <div className="heroGrid">
          <div className="heroCopy">
            <p className="eyebrow">${tr ? "Premium spor kulubu" : "Premium training club"}</p>
            <h1>${tr ? "Sehir temposuna ayak uyduran modern spor deneyimi." : "A modern training club built for the pace of city life."}</h1>
            <p className="body">
              ${
                tr
                  ? "Kuvvet, kondisyon, grup dersleri ve recovery alanlarini tek premium akista birlestiren donusum odakli bir landing page. Hedef: ziyaretciyi deneme dersi ya da uyelik basvurusuna dogrudan tasimak."
                  : "A conversion-led landing page that brings strength training, conditioning, group classes, and recovery spaces into one premium digital flow. The goal: move visitors straight into a trial session or membership application."
              }
            </p>
            <div className="heroActions">
              <button className="ctaPrimary">${tr ? "Ucretsiz deneme al" : "Book a free trial"}</button>
              <button className="ctaGhost">${tr ? "Uyelikleri incele" : "View memberships"}</button>
            </div>
            <div className="heroStats">
              <span>4.9/5 ${tr ? "uye puani" : "member rating"}</span>
              <span>1.800+ ${tr ? "aktif uye" : "active members"}</span>
              <span>${tr ? "06:00 - 24:00 acik" : "Open 06:00 - 24:00"}</span>
            </div>
          </div>

          <aside className="heroCard">
            <p className="panelKicker">${tr ? "Neden simdi" : "Why now"}</p>
            <ul>
              <li>${tr ? "Fonksiyonel zemin + premium ekipman" : "Functional floor + premium equipment"}</li>
              <li>${tr ? "Koc destekli ilerleme sistemi" : "Coach-led progression system"}</li>
              <li>${tr ? "Ders, PT ve recovery tek uyelikte" : "Classes, PT, and recovery in one membership"}</li>
              <li>${tr ? "Hizli basvuru ve net CTA hiyerarsisi" : "Fast application flow and clear CTA hierarchy"}</li>
            </ul>
            <div className="miniQuote">
              <strong>${tr ? '"Ilk ekranda premium, ikinci ekranda guven, ucuncu ekranda kayit."' : '"Premium in the first screen, proof in the second, conversion in the third."'}</strong>
            </div>
          </aside>
        </div>
      </section>

      <section className="metrics">
        <article><strong>12+</strong><span>${tr ? "grup dersi formati" : "class formats"}</span></article>
        <article><strong>3</strong><span>${tr ? "ana donusum noktasi" : "conversion checkpoints"}</span></article>
        <article><strong>7/24</strong><span>${tr ? "dijital uyelik akisi" : "digital membership flow"}</span></article>
      </section>

      <section className="programGrid" id="programs">
        {programs.map((program) => (
          <article className="programCard" key={program.title}>
            <p className="cardKicker">{program.label}</p>
            <h2>{program.title}</h2>
            <p>{program.body}</p>
          </article>
        ))}
      </section>

      <section className="storyBand">
        <div className="storyCopy">
          <p className="cardKicker">${tr ? "Sosyal kanit" : "Social proof"}</p>
          <h2>${tr ? "Referans, sonuc ve atmosfer ayni ekranda okunuyor." : "Testimonials, outcomes, and atmosphere read on the same screen."}</h2>
          <p>
            ${
              tr
                ? "Gercek uye yorumlari, once/sonra sonucu yerine guven veren ilerleme hikayeleri ve kulubun gunluk ritmini gosteren kisa bir galeri yapisi kuruldu."
                : "Use believable testimonials, progress-led success stories, and a short gallery structure that shows the rhythm of the club without feeling noisy."
            }
          </p>
        </div>
        <div className="quoteGrid">
          <article>
            <strong>${tr ? "“3 ayda enerji seviyem tamamen degisti.”" : '"My energy changed completely within 3 months."'}</strong>
            <span>${tr ? "Merve · Prime uye" : "Merve · Prime member"}</span>
          </article>
          <article>
            <strong>${tr ? "“Koc takibi sayesinde ilk defa duzenli kaldim.”" : '"Coach accountability made consistency finally stick."'}</strong>
            <span>${tr ? "Can · Elite uye" : "Can · Elite member"}</span>
          </article>
        </div>
      </section>

      <section className="plansSection" id="plans">
        <div className="sectionHead">
          <p className="cardKicker">${tr ? "Uyelik planlari" : "Membership tiers"}</p>
          <h2>${tr ? "Ilk ziyaretten uyelige gecisi kolaylastiran paketler." : "Membership packages designed to shorten the distance from visit to sign-up."}</h2>
        </div>
        <div className="planGrid">
          {tiers.map((tier) => (
            <article className={\`planCard \${tier.name === "${tr ? "Prime" : "Prime"}" ? "planCard--featured" : ""}\`} key={tier.name}>
              <p className="cardKicker">{tier.name}</p>
              <strong>{tier.price}</strong>
              <span className="planNote">{tier.note}</span>
              <ul>
                {tier.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <button className="planBtn">${tr ? "Bu plani sec" : "Choose this plan"}</button>
            </article>
          ))}
        </div>
      </section>

      <section className="visitSection" id="visit">
        <div>
          <p className="cardKicker">${tr ? "Ziyaret et" : "Visit the club"}</p>
          <h2>${tr ? "Besiktas'ta premium ama ulasilabilir bir kulup deneyimi." : "A premium but approachable club experience in Besiktas."}</h2>
          <p className="visitBody">
            ${
              tr
                ? "Konum, iletisim ve basvuru CTA'si ayni blokta toplandi. Boylece ziyaretci karar verirken sayfa icinde kaybolmuyor."
                : "Location, contact, and the registration CTA live in the same block so visitors do not lose momentum before they book."
            }
          </p>
        </div>
        <div className="visitCard">
          <span>${tr ? "Ciragan Cd. No:12" : "Ciragan Ave. No:12"}</span>
          <span>0212 345 67 89</span>
          <span>hello@forgeclub.co</span>
          <button className="ctaPrimary">${tr ? "Kulubu ziyaret et" : "Schedule a visit"}</button>
        </div>
      </section>
    </main>
  );
}
`,
    "styles.css": `:root {
  color-scheme: dark;
  --bg: #06070d;
  --panel: rgba(13, 18, 31, 0.76);
  --panel-strong: rgba(11, 16, 26, 0.94);
  --line: rgba(148, 163, 184, 0.16);
  --text: #f8fafc;
  --muted: #b6c2d3;
  --accent: #5eead4;
  --accent-2: #38bdf8;
  --accent-3: #f97316;
  --shadow: 0 35px 80px rgba(2, 6, 23, 0.45);
}
* { box-sizing: border-box; }
html, body, #root { min-height: 100%; }
body {
  margin: 0;
  font-family: "Space Grotesk", Inter, system-ui, sans-serif;
  color: var(--text);
  background:
    radial-gradient(circle at 18% 18%, rgba(94, 234, 212, 0.16), transparent 20%),
    radial-gradient(circle at 82% 16%, rgba(56, 189, 248, 0.2), transparent 24%),
    radial-gradient(circle at 50% 82%, rgba(249, 115, 22, 0.12), transparent 24%),
    linear-gradient(180deg, #07101b 0%, #06070d 100%);
}
a { color: inherit; text-decoration: none; }
button { font: inherit; }
.page { min-height: 100vh; padding: 28px; }
.heroShell {
  border: 1px solid var(--line);
  border-radius: 34px;
  padding: 28px;
  background:
    linear-gradient(135deg, rgba(10, 16, 28, 0.96), rgba(9, 14, 24, 0.82)),
    rgba(9, 14, 24, 0.92);
  box-shadow: var(--shadow);
}
.topbar, .heroGrid, .metrics, .programGrid, .quoteGrid, .planGrid, .visitSection {
  display: grid;
  gap: 18px;
}
.topbar {
  grid-template-columns: auto auto;
  align-items: center;
  justify-content: space-between;
}
.brand, .microcopy, .eyebrow, .panelKicker, .cardKicker { margin: 0; }
.brand, .eyebrow, .panelKicker, .cardKicker {
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 11px;
}
.brand, .eyebrow, .cardKicker { color: var(--accent); }
.microcopy, .panelKicker, .body, .programCard p, .visitBody, .storyCopy p, .planNote, .metrics span, .quoteGrid span {
  color: var(--muted);
}
.nav {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
  color: var(--muted);
  font-size: 14px;
}
.heroGrid {
  grid-template-columns: minmax(0, 1.35fr) minmax(320px, 0.8fr);
  align-items: stretch;
  margin-top: 26px;
}
.heroCopy {
  padding: clamp(18px, 3vw, 28px) 4px 12px 4px;
}
.heroCopy h1, .programCard h2, .storyCopy h2, .sectionHead h2, .visitSection h2 {
  margin: 10px 0 0;
  letter-spacing: -0.05em;
}
.heroCopy h1 {
  font-size: clamp(52px, 9vw, 96px);
  line-height: .9;
  max-width: 10ch;
}
.body, .visitBody, .storyCopy p {
  font-size: 17px;
  line-height: 1.75;
  max-width: 62ch;
}
.heroActions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 28px;
}
.ctaPrimary, .ctaGhost, .planBtn {
  min-height: 48px;
  padding: 0 18px;
  border-radius: 999px;
  border: 1px solid transparent;
  cursor: pointer;
}
.ctaPrimary, .planBtn {
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
  color: #031019;
  font-weight: 700;
}
.ctaGhost {
  background: transparent;
  color: var(--text);
  border-color: rgba(255,255,255,.14);
}
.heroStats {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 22px;
}
.heroStats span, .visitCard span {
  border: 1px solid rgba(255,255,255,.1);
  border-radius: 999px;
  padding: 8px 12px;
  background: rgba(255,255,255,.03);
  color: var(--muted);
  font-size: 13px;
}
.heroCard, .programCard, .quoteGrid article, .planCard, .visitCard, .metrics article {
  border: 1px solid var(--line);
  border-radius: 28px;
  background: var(--panel);
  backdrop-filter: blur(16px);
  box-shadow: var(--shadow);
}
.heroCard {
  padding: 24px;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}
.heroCard ul, .planCard ul {
  margin: 16px 0 0;
  padding-left: 18px;
  line-height: 1.85;
}
.miniQuote {
  margin-top: 20px;
  padding: 16px;
  border-radius: 18px;
  background: rgba(255,255,255,.04);
  color: var(--text);
}
.metrics {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin: 18px 0 0;
}
.metrics article {
  padding: 20px;
}
.metrics strong, .planCard strong {
  display: block;
  font-size: 30px;
  line-height: 1;
  letter-spacing: -0.04em;
}
.programGrid, .quoteGrid, .planGrid {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  margin-top: 20px;
}
.programCard, .planCard {
  padding: 24px;
}
.programCard h2 {
  font-size: 28px;
  line-height: 1.04;
}
.storyBand, .plansSection, .visitSection {
  margin-top: 22px;
}
.storyBand {
  display: grid;
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, .9fr);
  gap: 18px;
}
.quoteGrid article {
  padding: 20px;
}
.quoteGrid strong {
  display: block;
  font-size: 22px;
  line-height: 1.18;
  letter-spacing: -0.04em;
}
.quoteGrid span {
  display: inline-block;
  margin-top: 16px;
}
.sectionHead {
  max-width: 62ch;
}
.planCard {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.planCard--featured {
  border-color: rgba(94, 234, 212, 0.35);
  background: linear-gradient(180deg, rgba(94, 234, 212, 0.12), rgba(13, 18, 31, 0.9));
}
.planNote {
  font-size: 13px;
}
.planBtn {
  margin-top: auto;
}
.visitSection {
  grid-template-columns: minmax(0, 1.1fr) minmax(320px, .9fr);
  align-items: center;
}
.visitCard {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}
@media (max-width: 1040px) {
  .heroGrid, .storyBand, .visitSection, .programGrid, .quoteGrid, .planGrid, .metrics {
    grid-template-columns: 1fr;
  }
  .topbar {
    grid-template-columns: 1fr;
    justify-content: flex-start;
  }
  .heroCopy h1 {
    max-width: none;
  }
}
`,
    "index.html": `<div id="root"></div>`,
  };
}

function createReactCanvasFiles(args: {
  tr: boolean;
  concept: "gym" | "ecommerce" | "zoo" | "generic";
  title: string;
}) {
  const { tr, concept } = args;
  if (concept === "gym") {
    return createGymReactCanvasFiles(tr);
  }
  const content =
    concept === "ecommerce"
      ? {
          brand: tr ? "LUMA STORE" : "LUMA STORE",
          eyebrow: tr ? "E-ticaret landing page" : "E-commerce landing page",
          headline: tr
            ? "Yeni sezon urunlerini satin alma istegi uyandiran bir vitrin."
            : "A storefront that makes the new collection feel instantly buyable.",
          body: tr
            ? "Hero urun vitrini, kategori gecisleri, guven sinyalleri ve net satin alma CTA'lariyla tam sayfa bir e-commerce deneyimi kur."
            : "Build a full-page e-commerce experience with a hero product spotlight, category entry points, trust signals, and clear purchase CTAs.",
          nav1: tr ? "Koleksiyonlar" : "Collections",
          nav2: tr ? "Cok satanlar" : "Best sellers",
          nav3: tr ? "Kargo" : "Shipping",
          cta1: tr ? "Alisverise basla" : "Shop new arrivals",
          cta2: tr ? "Cok satanlari gor" : "View best sellers",
          meta2: tr ? "12 bin+ mutlu musteri" : "12k+ happy customers",
          meta3: tr ? "Ayni gun kargo" : "Same-day dispatch",
          focus: [
            tr
              ? "Hero urun vitrini ve kampanya bandi"
              : "Hero product spotlight and campaign banner",
            tr
              ? "Kategori kartlari ve cok satanlar"
              : "Category cards and best-seller blocks",
            tr
              ? "Teslimat, iade ve guven sinyalleri"
              : "Shipping, returns, and trust signals",
            tr ? "Mobilde hizli satin alma akisi" : "Fast mobile purchase flow",
          ],
          stat1: tr ? "yeni sezon cikisi" : "new season drop",
          stat2: tr ? "öne cikan kategori" : "featured categories",
          stat3: tr ? "ana satin alma CTA'si" : "primary purchase path",
          card1Label: tr ? "Vitrin" : "Storefront",
          card1Title: tr
            ? "Urunu ilk ekranda sat"
            : "Sell the hero product in the first screen",
          card1Body: tr
            ? "Fiyat, fayda ve kampanya mesajini ayni hero icinde birlestir."
            : "Combine price, product value, and the offer in one hero composition.",
          card2Label: tr ? "Urunler" : "Catalog",
          card2Title: tr
            ? "Kategorileri hizli gezdir"
            : "Let visitors scan the catalog quickly",
          card2Body: tr
            ? "Koleksiyonlar, bestseller bloklari ve filtre mantigini acik hissettir."
            : "Make collections, bestseller blocks, and filtering logic feel obvious at a glance.",
          card3Label: tr ? "Guven" : "Trust",
          card3Title: tr
            ? "Kargo ve iade bariyerini dusur"
            : "Reduce shipping and return hesitation",
          card3Body: tr
            ? "Alt bolumde teslimat, iade ve musteri memnuniyeti rozetlerini tekrar et."
            : "Repeat shipping, returns, and satisfaction badges near the lower CTA.",
        }
      : concept === "zoo"
        ? {
            brand: tr ? "WILD GARDENS" : "WILD GARDENS",
            eyebrow: tr ? "Hayvanat bahcesi ana sayfasi" : "Zoo front page",
            headline: tr
              ? "Ziyaret, bilet ve hayvan hikayelerini ayni ekranda birlestiren bir ana sayfa."
              : "A front page that brings ticketing, visiting info, and animal stories into one screen.",
            body: tr
              ? "Hero bilet CTA'si, one cikan hayvan alanlari, ziyaret saatleri ve aile odakli guven sinyalleriyle tam sayfa bir zoo sayfasi kur."
              : "Build a full-page zoo homepage with a ticketing hero, animal highlights, visiting information, and family-friendly trust signals.",
            nav1: tr ? "Hayvanlar" : "Animals",
            nav2: tr ? "Biletler" : "Tickets",
            nav3: tr ? "Ziyaret" : "Visit",
            cta1: tr ? "Bilet al" : "Buy tickets",
            cta2: tr ? "Haritayi gor" : "Explore the map",
            meta2: tr ? "40+ tur" : "40+ species",
            meta3: tr ? "Her gun acik" : "Open daily",
            focus: [
              tr
                ? "Aile odakli hero ve bilet CTA'si"
                : "Family-friendly hero and ticket CTA",
              tr ? "One cikan hayvan hikayeleri" : "Featured animal stories",
              tr
                ? "Saatler, konum ve etkinlikler"
                : "Hours, location, and daily events",
              tr
                ? "Mobilde hizli ziyaret planlama"
                : "Fast mobile visit planning",
            ],
            stat1: tr ? "gunluk gosteri saati" : "daily show times",
            stat2: tr ? "one cikan canli alani" : "featured habitats",
            stat3: tr ? "ziyaret akisi" : "visit planning steps",
            card1Label: tr ? "Karsilama" : "Welcome",
            card1Title: tr
              ? "Bilet ve ziyaret bilgisini ilk ekranda sun"
              : "Put ticketing and visit info in the first screen",
            card1Body: tr
              ? "Ailelerin ilk bakista saat, bilet ve one cikan deneyimi anlamasini sagla."
              : "Help families understand hours, tickets, and the main attraction at first glance.",
            card2Label: tr ? "Kesfet" : "Explore",
            card2Title: tr
              ? "One cikan hayvanlari bloklar halinde tanit"
              : "Showcase featured animals in clear blocks",
            card2Body: tr
              ? "Kisa hikayeler, fotograf alanlari ve gosteri bilgileriyle sayfayi zenginlestir."
              : "Use short stories, photo moments, and show details to give the page energy.",
            card3Label: tr ? "Planla" : "Plan",
            card3Title: tr
              ? "Harita, saat ve etkinlikleri yakinlastir"
              : "Bring map, timings, and events closer",
            card3Body: tr
              ? "Alt bolumde konum, acilis bilgisi ve tekrar eden bilet CTA'si ile karari kolaylastir."
              : "Use map, opening info, and a repeated ticket CTA lower on the page to shorten the decision path.",
          }
        : {
            brand: "SIGNAL STUDIO",
            eyebrow: tr
              ? "Dijital urun landing page"
              : "Digital product landing page",
            headline: tr
              ? "Fikri urune, urunu musteriye donusturen tam sayfa bir deneyim."
              : "A full-page experience that turns an idea into a product and a product into customers.",
            body: tr
              ? "Hero, ozellik bloklari, sosyal kanit ve net CTA akisini ayni canvas icinde kur."
              : "Build a hero, feature blocks, social proof, and a clear CTA flow inside the same canvas.",
            nav1: tr ? "Ozellikler" : "Features",
            nav2: tr ? "Fiyatlandirma" : "Pricing",
            nav3: tr ? "Hakkimizda" : "About",
            cta1: tr ? "Ucretsiz dene" : "Start free trial",
            cta2: tr ? "Demo izle" : "See a demo",
            meta2: tr ? "4.200+ aktif ekip" : "4,200+ active teams",
            meta3: tr ? "14 gunluk deneme" : "14-day trial",
            focus: [
              tr
                ? "Guclu hero ve marka vaadi"
                : "Strong hero and brand promise",
              tr
                ? "Ozellik bloklari ve faydalari net aktarim"
                : "Feature blocks with clear value transfer",
              tr
                ? "Sosyal kanit ve referanslar"
                : "Social proof and testimonials",
              tr
                ? "Fiyatlandirma ve donusum CTA'si"
                : "Pricing and conversion CTA",
            ],
            stat1: tr ? "ortalama onboarding suresi" : "avg. onboarding time",
            stat2: tr ? "entegrasyon" : "integrations",
            stat3: tr ? "ana donusum adimi" : "conversion steps",
            card1Label: tr ? "Deger" : "Value",
            card1Title: tr
              ? "Ilk ekranda urunu ve vaadi net ilet"
              : "Communicate the product and promise in the first screen",
            card1Body: tr
              ? "Hero basligi, alt metin ve cift CTA ile ziyaretciyi 5 saniyede karar noktasina tasi."
              : "Move the visitor to the decision point in 5 seconds with headline, sub-copy, and dual CTA.",
            card2Label: tr ? "Ozellikler" : "Features",
            card2Title: tr
              ? "Faydalari somut orneklerle goster"
              : "Show benefits with concrete examples",
            card2Body: tr
              ? "Her ozellik karti bir is problemini cozdugunü kanitlamali; genel vaatler degil."
              : "Each feature card should prove it solves a real job — not generic promises.",
            card3Label: tr ? "Guven" : "Trust",
            card3Title: tr
              ? "Sosyal kaniti donusumun yanina koy"
              : "Place social proof next to the conversion moment",
            card3Body: tr
              ? "Referanslar, logo bandi ve metrikler CTA'nin ustunde veya yaninda durmali."
              : "Testimonials, logo band, and metrics should live above or beside the CTA.",
          };

  return {
    "App.tsx": `export default function App() {
  return (
    <main className="page">
      <header className="topbar">
        <div>
          <p className="brand">${content.brand}</p>
          <p className="microcopy">${content.eyebrow}</p>
        </div>
        <nav className="nav">
          <a href="#programs">${content.nav1}</a>
          <a href="#plans">${content.nav2}</a>
          <a href="#visit">${content.nav3}</a>
        </nav>
      </header>

      <section className="hero">
        <div className="heroCopy">
          <p className="eyebrow">${content.eyebrow}</p>
          <h1>${content.headline}</h1>
          <p className="body">${content.body}</p>
          <div className="actions">
            <button className="cta">${content.cta1}</button>
            <button className="ghost">${content.cta2}</button>
          </div>
          <div className="heroMeta">
            <span>4.9/5</span>
            <span>${content.meta2}</span>
            <span>${content.meta3}</span>
          </div>
        </div>

        <aside className="heroPanel">
          <p className="panelKicker">${tr ? "Odak alanlari" : "Focus areas"}</p>
          <ul>
            <li>${content.focus[0]}</li>
            <li>${content.focus[1]}</li>
            <li>${content.focus[2]}</li>
            <li>${content.focus[3]}</li>
          </ul>
        </aside>
      </section>

      <section className="stats" aria-label="Landing stats">
        <article>
          <strong>06:00-24:00</strong>
          <span>${content.stat1}</span>
        </article>
        <article>
          <strong>12+</strong>
          <span>${content.stat2}</span>
        </article>
        <article>
          <strong>3</strong>
          <span>${content.stat3}</span>
        </article>
      </section>

      <section className="featureGrid" id="programs">
        <article className="featureCard">
          <p className="featureLabel">${content.card1Label}</p>
          <h2>${content.card1Title}</h2>
          <p>${content.card1Body}</p>
        </article>
        <article className="featureCard" id="plans">
          <p className="featureLabel">${content.card2Label}</p>
          <h2>${content.card2Title}</h2>
          <p>${content.card2Body}</p>
        </article>
        <article className="featureCard" id="visit">
          <p className="featureLabel">${content.card3Label}</p>
          <h2>${content.card3Title}</h2>
          <p>${content.card3Body}</p>
        </article>
      </section>
    </main>
  );
}
`,
    "styles.css": `:root {
  color-scheme: dark;
  --bg: #050816;
  --panel: rgba(10, 16, 30, 0.84);
  --line: rgba(148, 163, 184, 0.16);
  --text: #f8fafc;
  --muted: #b7c4d6;
  --accent: #38bdf8;
  --accent-2: #22c55e;
  --shadow: 0 35px 90px rgba(2, 6, 23, 0.48);
}
* { box-sizing: border-box; }
html, body, #root { min-height: 100%; }
body {
  margin: 0;
  font-family: Inter, system-ui, sans-serif;
  background:
    radial-gradient(circle at 75% 20%, rgba(56, 189, 248, 0.16), transparent 24%),
    radial-gradient(circle at 18% 14%, rgba(34, 197, 94, 0.14), transparent 22%),
    linear-gradient(180deg, #07101c 0%, #050816 100%);
  color: var(--text);
}
a { color: inherit; text-decoration: none; }
button { font: inherit; }
.page { min-height: 100vh; padding: 28px; }
.topbar { display: flex; align-items: center; justify-content: space-between; gap: 20px; padding-bottom: 24px; }
.brand, .microcopy, .eyebrow, .panelKicker, .featureLabel { margin: 0; }
.brand, .eyebrow, .panelKicker, .featureLabel { text-transform: uppercase; letter-spacing: 0.16em; font-size: 12px; }
.brand, .eyebrow { color: var(--accent); }
.microcopy, .panelKicker, .body, .featureCard p, .stats span { color: var(--muted); }
.nav { display: flex; flex-wrap: wrap; gap: 16px; color: var(--muted); }
.hero { display: grid; grid-template-columns: minmax(0, 1.3fr) minmax(280px, 0.9fr); gap: 24px; align-items: stretch; padding: 24px 0 18px; }
.heroCopy, .heroPanel, .featureCard, .stats article { border: 1px solid var(--line); background: var(--panel); backdrop-filter: blur(14px); box-shadow: var(--shadow); }
.heroCopy { border-radius: 32px; padding: clamp(28px, 5vw, 56px); }
.heroPanel { border-radius: 28px; padding: 28px; align-self: end; }
.heroCopy h1, .featureCard h2 { margin: 10px 0 0; letter-spacing: -0.05em; }
.heroCopy h1 { font-size: clamp(44px, 8vw, 86px); line-height: 0.92; max-width: 10ch; }
.body { margin-top: 18px; max-width: 58ch; font-size: 17px; line-height: 1.75; }
.actions { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 28px; }
.cta, .ghost { min-height: 48px; padding: 0 18px; border-radius: 999px; border: 1px solid transparent; cursor: pointer; }
.cta { background: linear-gradient(135deg, var(--accent), #67e8f9); color: #03111c; font-weight: 700; }
.ghost { border-color: var(--line); background: transparent; color: var(--text); }
.heroMeta { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 22px; color: var(--muted); font-size: 13px; }
.heroPanel ul { margin: 18px 0 0; padding-left: 18px; line-height: 1.8; }
.stats { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; margin: 18px 0 22px; }
.stats article { border-radius: 22px; padding: 20px; }
.stats strong { display: block; font-size: 30px; line-height: 1; letter-spacing: -0.04em; }
.featureGrid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 16px; }
.featureCard { border-radius: 24px; padding: 24px; }
.featureCard h2 { font-size: 28px; line-height: 1.04; }
@media (max-width: 960px) {
  .hero, .featureGrid, .stats { grid-template-columns: 1fr; }
  .topbar { flex-direction: column; align-items: flex-start; }
  .heroCopy h1 { max-width: none; }
}
`,
    "index.html": `<div id="root"></div>`,
  };
}

function createHtmlCanvasFiles(args: {
  tr: boolean;
  concept: "gym" | "ecommerce" | "zoo" | "generic";
  title: string;
}) {
  const reactFiles = createReactCanvasFiles(args);
  const appMarkup = reactFiles["App.tsx"]
    .replace(/^export default function App\(\) \{\s*return \(\s*/m, "")
    .replace(/\s*\);\s*\}\s*$/m, "")
    .replace(/className=/g, "class=");

  return {
    "index.html": appMarkup,
    "styles.css": reactFiles["styles.css"],
    "script.js": `console.log(${JSON.stringify(args.title)});`,
  };
}

function hasResumeCandidateData(input: string) {
  const text = input.trim();
  const lower = text.toLowerCase();
  if (text.length > 700) {
    return true;
  }

  const indicators = [
    /\b(adım|ismim|ben|my name is|i am)\b/i.test(text),
    /@/.test(text) || /\b(linkedin|github)\b/i.test(text),
    /\b(developer|engineer|designer|manager|analyst|yazılımcı|mühendis|tasarımcı|uzman|pozisyon|rol)\b/i.test(
      text,
    ),
    /\b(deneyim|experience|worked|çalıştım|şirket|company|20\d{2}|\d+\s*yıl)\b/i.test(
      text,
    ),
    /\b(üniversite|university|lisans|bachelor|master|degree|mezun|education)\b/i.test(
      text,
    ),
    /\b(react|typescript|javascript|python|rust|sql|figma|seo|sales|marketing|node|cloudflare)\b/i.test(
      lower,
    ),
  ];

  return indicators.filter(Boolean).length >= 3;
}

function requiresImageClarification(input: string) {
  const normalized = input.trim().toLowerCase();
  if (!normalized) {
    return false;
  }

  const hasMinorCodedTerm =
    /\b(girl|boy|kid|child|children|teen|teenager|schoolgirl|schoolboy|minor)\b/i.test(
      normalized,
    ) || /\b(kız|erkek çocuk|çocuk|genç kız|reşit olmayan)\b/i.test(normalized);
  const hasAdultMarker =
    /\b(adult|woman|man|lady|person|female|male)\b/i.test(normalized) ||
    /\b(yetişkin|kadın|erkek|insan)\b/i.test(normalized);

  return hasMinorCodedTerm && !hasAdultMarker;
}

function prefersTurkish(input: string) {
  return (
    /[çğıöşüİ]/i.test(input) ||
    /\b(ben|bana|için|ile|selam|merhaba|hangi|nedir|oluştur|yaz|yap)\b/i.test(
      input,
    )
  );
}

function preferredResponseLanguage(
  controls: Record<string, unknown> | undefined,
  input: string,
): { code: "tr" | "en"; label: "Turkish" | "English" } {
  const preferred =
    isRecord(controls) && typeof controls.preferredLanguage === "string"
      ? controls.preferredLanguage
      : "";

  if (preferred === "tr") {
    return { code: "tr", label: "Turkish" };
  }

  if (preferred === "en") {
    return { code: "en", label: "English" };
  }

  return prefersTurkish(input)
    ? { code: "tr", label: "Turkish" }
    : { code: "en", label: "English" };
}

function modeLabelForResponse(mode: ShellMode, tr: boolean) {
  const labels: Record<ShellMode, { en: string; tr: string }> = {
    chat: { en: "Chat AI", tr: "Sohbet AI" },
    content: { en: "Content Generator", tr: "İçerik Üretici" },
    code: { en: "Code Generator", tr: "Kod Üretici" },
    canvas: { en: "Canvas", tr: "Canvas" },
    email: { en: "Email Generator", tr: "E-posta Üretici" },
    video: { en: "Video Script", tr: "Video Senaryosu" },
    seo: { en: "SEO Analyzer", tr: "SEO Analizörü" },
    image: { en: "Image Generator", tr: "Görsel Üretici" },
    voice: { en: "Text-to-Speech Script", tr: "Ses Metni Üretici" },
    resume: { en: "Resume Builder", tr: "CV Oluşturucu" },
    bot: { en: "Bot Builder", tr: "Bot Oluşturucu" },
  };
  return tr ? labels[mode].tr : labels[mode].en;
}

function normalizeArtifact(
  mode: ShellMode,
  input: string,
  value: unknown,
): ModeArtifact {
  const source =
    isRecord(value) && isRecord(value.artifact) ? value.artifact : value;
  const data = isRecord(source) ? source : {};
  const title = normalizeString(data.title, titleFromMessage(input));
  const summary = normalizeString(data.summary, `${title} artifact is ready.`);
  const artifact: ModeArtifact = {
    mode,
    title,
    summary,
    sections: normalizeSections(data.sections, [
      {
        heading: "Result",
        body: summary,
      },
    ]),
    actions: normalizeStringArray(data.actions, []),
    images: normalizeGeneratedImages(data.images),
    metadata: normalizeMetadata(data.metadata),
  };

  if (mode === "resume") {
    artifact.resume = normalizeResumeArtifact(
      isRecord(data.resume) ? data.resume : data,
      input,
    );
  }

  if (mode === "bot") {
    artifact.bot = normalizeBotArtifact(
      isRecord(data.bot) ? data.bot : data,
      input,
    );
  }

  if (mode === "canvas") {
    artifact.canvas = normalizeCanvasArtifact(
      isRecord(data.canvas) ? data.canvas : data,
      isRecord(data.canvas) && data.canvas.template === "html"
        ? "html"
        : "react",
    );
  }

  return artifact;
}

function normalizeResumeArtifact(
  value: unknown,
  input: string,
): ResumeArtifactData {
  const data = isRecord(value) ? value : {};
  const contact = isRecord(data.contact) ? data.contact : {};

  return {
    fullName: normalizeString(data.fullName, "Candidate"),
    headline: normalizeString(data.headline, "Professional profile"),
    contact: {
      email: optionalString(contact.email),
      phone: optionalString(contact.phone),
      location: optionalString(contact.location),
      website: optionalString(contact.website),
      linkedin: optionalString(contact.linkedin),
      github: optionalString(contact.github),
    },
    summary: normalizeString(
      data.summary,
      clip(`Professional summary generated from: ${input}`, 500),
    ),
    skills: normalizeStringArray(data.skills, ["Communication", "Ownership"]),
    experience: normalizeExperienceList(data.experience),
    education: normalizeEducationList(data.education),
    projects: normalizeProjectList(data.projects),
    languages: normalizeStringArray(data.languages, []),
  };
}

function normalizeBotArtifact(
  value: unknown,
  fallbackDescription: string,
): BotArtifactData {
  const data = isRecord(value) ? value : {};
  const systemPrompt = normalizeString(
    data.systemPrompt ?? data.system_prompt,
    [
      "You are a focused custom assistant.",
      `Purpose: ${fallbackDescription}`,
      "Follow the user's language, be accurate, and ask only necessary clarifying questions.",
    ].join("\n"),
  );

  return {
    name: clip(
      normalizeString(data.name, titleFromMessage(fallbackDescription)),
      80,
    ),
    description: clip(
      normalizeString(data.description, fallbackDescription),
      500,
    ),
    systemPrompt: clip(systemPrompt, 12_000),
    tone: clip(normalizeString(data.tone, "helpful, clear, professional"), 160),
    boundaries: normalizeStringArray(data.boundaries, [
      "Do not invent facts when information is missing.",
      "Ask for clarification when a decision has meaningful consequences.",
    ]),
    starterPrompts: normalizeStringArray(
      data.starterPrompts ?? data.starter_prompts,
      ["What can you help me with?", "Start with a short plan."],
    ),
    memoryPolicy: clip(
      normalizeString(
        data.memoryPolicy ?? data.memory_policy,
        "Use relevant long-term memory only when it improves the answer.",
      ),
      500,
    ),
    tools: normalizeStringArray(data.tools, ["chat"]),
  };
}

function normalizeSections(value: unknown, fallback: ModeArtifact["sections"]) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const sections: ModeArtifact["sections"] = [];
  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }

    const section: ModeArtifact["sections"][number] = {
      heading: normalizeString(item.heading, "Section"),
    };
    const body = optionalString(item.body);
    const code = optionalString(item.code);
    const items = normalizeStringArray(item.items, []);

    if (body) {
      section.body = body;
    }
    if (items.length) {
      section.items = items;
    }
    if (code) {
      section.code = code;
    }
    if (
      item.priority === "low" ||
      item.priority === "medium" ||
      item.priority === "high"
    ) {
      section.priority = item.priority;
    }
    if (typeof item.score === "number") {
      section.score = item.score;
    }

    sections.push(section);
  }

  return sections.length ? sections : fallback;
}

function normalizeGeneratedImages(value: unknown) {
  if (!Array.isArray(value)) {
    return undefined;
  }

  const images: GeneratedImageArtifact[] = [];
  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }

    const dataUrl = optionalString(item.dataUrl);
    if (!dataUrl) {
      continue;
    }

    const image: GeneratedImageArtifact = {
      dataUrl,
    };
    const mimeType = optionalString(item.mimeType);
    const alt = optionalString(item.alt);
    const prompt = optionalString(item.prompt);
    if (mimeType) {
      image.mimeType = mimeType;
    }
    if (alt) {
      image.alt = alt;
    }
    if (prompt) {
      image.prompt = prompt;
    }
    if (typeof item.width === "number") {
      image.width = item.width;
    }
    if (typeof item.height === "number") {
      image.height = item.height;
    }
    images.push(image);
  }

  return images.length ? images : undefined;
}

function normalizeExperienceList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const experience: ResumeArtifactData["experience"] = [];
  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }

    const entry: ResumeArtifactData["experience"][number] = {
      role: normalizeString(item.role, "Role"),
      company: normalizeString(item.company, "Company"),
      period: normalizeString(item.period, "Dates"),
      bullets: normalizeStringArray(item.bullets, []),
    };
    const location = optionalString(item.location);
    if (location) {
      entry.location = location;
    }
    experience.push(entry);
  }

  return experience;
}

function normalizeEducationList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const education: ResumeArtifactData["education"] = [];
  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }

    const entry: ResumeArtifactData["education"][number] = {
      school: normalizeString(item.school, "School"),
      degree: normalizeString(item.degree, "Degree"),
      details: normalizeStringArray(item.details, []),
    };
    const period = optionalString(item.period);
    if (period) {
      entry.period = period;
    }
    education.push(entry);
  }

  return education;
}

function normalizeProjectList(value: unknown) {
  if (!Array.isArray(value)) {
    return [];
  }

  const projects: NonNullable<ResumeArtifactData["projects"]> = [];
  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }

    const project: NonNullable<ResumeArtifactData["projects"]>[number] = {
      name: normalizeString(item.name, "Project"),
      description: normalizeString(item.description, "Project description"),
    };
    const bullets = normalizeStringArray(item.bullets, []);
    const link = optionalString(item.link);
    if (bullets.length) {
      project.bullets = bullets;
    }
    if (link) {
      project.link = link;
    }
    projects.push(project);
  }

  return projects;
}

async function insertArtifact(env: Env, artifact: ArtifactRow) {
  await env.DB.prepare(
    "INSERT INTO artifacts (id, user_id, conversation_id, message_id, mode, type, title, payload, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(
      artifact.id,
      artifact.user_id,
      artifact.conversation_id,
      artifact.message_id,
      artifact.mode,
      artifact.type,
      artifact.title,
      artifact.payload,
      artifact.created_at,
      artifact.updated_at,
    )
    .run();
}

async function insertBot(
  env: Env,
  userId: string,
  bot: BotArtifactData,
): Promise<BotRow> {
  const now = Date.now();
  const row: BotRow = {
    id: randomId("bot"),
    user_id: userId,
    name: clip(bot.name, 80),
    description: clip(bot.description, 500),
    system_prompt: clip(bot.systemPrompt, 12_000),
    tone: clip(bot.tone, 160),
    boundaries: JSON.stringify(bot.boundaries),
    starter_prompts: JSON.stringify(bot.starterPrompts),
    memory_policy: clip(bot.memoryPolicy, 500),
    tools: JSON.stringify(bot.tools),
    created_at: now,
    updated_at: now,
    deleted_at: null,
  };

  await env.DB.prepare(
    "INSERT INTO bots (id, user_id, name, description, system_prompt, tone, boundaries, starter_prompts, memory_policy, tools, created_at, updated_at, deleted_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(
      row.id,
      row.user_id,
      row.name,
      row.description,
      row.system_prompt,
      row.tone,
      row.boundaries,
      row.starter_prompts,
      row.memory_policy,
      row.tools,
      row.created_at,
      row.updated_at,
      null,
    )
    .run();

  return row;
}

async function requireBot(env: Env, userId: string, botId: string) {
  const bot = await getBotById(env, userId, botId);
  if (!bot) {
    throw new HttpError(404, "Bot not found");
  }
  return bot;
}

async function getBotById(env: Env, userId: string, botId: string) {
  return env.DB.prepare(
    "SELECT id, user_id, name, description, system_prompt, tone, boundaries, starter_prompts, memory_policy, tools, created_at, updated_at, deleted_at FROM bots WHERE id = ? AND user_id = ? AND deleted_at IS NULL",
  )
    .bind(botId, userId)
    .first<BotRow>();
}

async function verifyTurnstileIfRequired(
  env: Env,
  token: string | undefined,
  request: Request,
) {
  if (env.REQUIRE_TURNSTILE !== "true") {
    return true;
  }

  if (!env.TURNSTILE_SECRET_KEY || !token) {
    return false;
  }

  const form = new FormData();
  form.append("secret", env.TURNSTILE_SECRET_KEY);
  form.append("response", token);
  form.append("remoteip", getClientIp(request));

  const result = await fetchJson<{ success: boolean }>(
    "https://challenges.cloudflare.com/turnstile/v0/siteverify",
    {
      method: "POST",
      body: form,
    },
  );
  return result.success;
}

async function incrementLimit(
  env: Env,
  key: string,
  limit: number,
  ttlSeconds: number,
) {
  if (!env.RATE_LIMIT) {
    return true;
  }

  const current = Number((await env.RATE_LIMIT.get(key)) || 0);
  if (current >= limit) {
    return false;
  }

  await env.RATE_LIMIT.put(key, String(current + 1), {
    expirationTtl: ttlSeconds,
  });
  return true;
}

async function fetchJson<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);
  if (!response.ok) {
    throw new Error(await response.text());
  }
  return (await response.json()) as T;
}

function appConfig(env: Env) {
  const supportEmail = env.SUPPORT_EMAIL?.trim() || "support@lavescar.com.tr";
  const turnstileEnabled =
    env.REQUIRE_TURNSTILE === "true" && Boolean(env.TURNSTILE_SITE_KEY);

  return {
    product: {
      name: PRODUCT_NAME,
      tier: "free-beta",
      signInRequired: true,
      canvasBeta: env.CANVAS_BETA !== "false",
    },
    auth: {
      providers: [
        { id: "google", enabled: Boolean(env.GOOGLE_CLIENT_ID) },
        { id: "github", enabled: Boolean(env.GITHUB_CLIENT_ID) },
      ],
    },
    turnstile: {
      enabled: turnstileEnabled,
      siteKey: turnstileEnabled ? env.TURNSTILE_SITE_KEY : undefined,
    },
    quotas: {
      chatDaily: dailyQuotaLimit(env, "chat"),
      modeDaily: dailyQuotaLimit(env, "mode"),
      imageDaily: dailyQuotaLimit(env, "image"),
      resumePdfDaily: dailyQuotaLimit(env, "resume_pdf"),
    },
    features: {
      attachments: false,
      screenshot: false,
      connectors: false,
      voiceInput: false,
      memoryToggle: false,
      canvasBeta: env.CANVAS_BETA !== "false",
    },
    links: {
      privacyUrl: "/privacy/",
      termsUrl: "/terms/",
      helpUrl: "/help/",
      supportEmail,
      supportMailto: `mailto:${supportEmail}`,
    },
  };
}

function todayKey(now = Date.now()) {
  return new Date(now).toISOString().slice(0, 10);
}

function nextResetIso(dayKey: string) {
  return new Date(`${dayKey}T00:00:00.000Z`).getTime() + 24 * 60 * 60 * 1000;
}

function dailyQuotaLimit(env: Env, capability: UsageCapability) {
  switch (capability) {
    case "chat":
      return Number(env.DAILY_CHAT_LIMIT || env.USER_DAILY_MESSAGE_LIMIT || 50);
    case "mode":
      return Number(env.DAILY_MODE_LIMIT || env.USER_DAILY_MESSAGE_LIMIT || 30);
    case "image":
      return Number(env.DAILY_IMAGE_LIMIT || 6);
    case "resume_pdf":
      return Number(env.DAILY_PDF_LIMIT || 5);
  }
}

async function getOrCreateUserSettings(env: Env, userId: string) {
  const existing = await env.DB.prepare(
    "SELECT user_id, preferred_language, onboarding_completed, created_at, updated_at FROM user_settings WHERE user_id = ?",
  )
    .bind(userId)
    .first<UserSettingsRow>();

  if (existing) {
    return existing;
  }

  const now = Date.now();
  const created: UserSettingsRow = {
    user_id: userId,
    preferred_language: "en",
    onboarding_completed: 0,
    created_at: now,
    updated_at: now,
  };

  await env.DB.prepare(
    "INSERT INTO user_settings (user_id, preferred_language, onboarding_completed, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
  )
    .bind(
      created.user_id,
      created.preferred_language,
      created.onboarding_completed,
      created.created_at,
      created.updated_at,
    )
    .run();

  return created;
}

async function updateUserSettings(
  env: Env,
  userId: string,
  patch: AccountSettingsRequest,
) {
  const current = await getOrCreateUserSettings(env, userId);
  const next: UserSettingsRow = {
    ...current,
    preferred_language:
      patch.preferredLanguage === "tr" ? "tr" : current.preferred_language,
    onboarding_completed:
      typeof patch.onboardingCompleted === "boolean"
        ? patch.onboardingCompleted
          ? 1
          : 0
        : current.onboarding_completed,
    updated_at: Date.now(),
  };

  await env.DB.prepare(
    "UPDATE user_settings SET preferred_language = ?, onboarding_completed = ?, updated_at = ? WHERE user_id = ?",
  )
    .bind(
      next.preferred_language,
      next.onboarding_completed,
      next.updated_at,
      userId,
    )
    .run();

  return next;
}

function toPublicUserSettings(row: UserSettingsRow) {
  return {
    preferredLanguage: row.preferred_language,
    onboardingCompleted: row.onboarding_completed === 1,
  };
}

async function getUsageSnapshot(env: Env, userId: string) {
  const dayKey = todayKey();
  const rows = await env.DB.prepare(
    "SELECT user_id, capability, day_key, count, updated_at FROM daily_usage_counters WHERE user_id = ? AND day_key = ?",
  )
    .bind(userId, dayKey)
    .all<DailyUsageCounterRow>();
  const counters = new Map(
    (rows.results ?? []).map((row) => [row.capability, row.count]),
  );

  const capabilities = USAGE_CAPABILITIES.map((capability) => {
    const limit = dailyQuotaLimit(env, capability);
    const used = counters.get(capability) ?? 0;
    return {
      key: capability,
      limit,
      used,
      remaining: Math.max(0, limit - used),
    };
  });

  return {
    dayKey,
    resetsAt: nextResetIso(dayKey),
    capabilities,
  };
}

async function incrementDailyUsage(
  env: Env,
  userId: string,
  capability: UsageCapability,
  amount = 1,
) {
  const dayKey = todayKey();
  const now = Date.now();
  await env.DB.prepare(
    "INSERT INTO daily_usage_counters (user_id, capability, day_key, count, updated_at) VALUES (?, ?, ?, ?, ?) ON CONFLICT(user_id, capability, day_key) DO UPDATE SET count = count + excluded.count, updated_at = excluded.updated_at",
  )
    .bind(userId, capability, dayKey, amount, now)
    .run();
}

async function blockOnQuota(
  env: Env,
  request: Request,
  userId: string,
  capability: UsageCapability,
  errorMessage: string,
  metadata: Record<string, unknown>,
) {
  const usage = await getUsageSnapshot(env, userId);
  const quota = usage.capabilities.find((item) => item.key === capability);
  if (quota && quota.used >= quota.limit) {
    await logUsageEvent({
      env,
      request,
      userId,
      eventType: "quota.blocked",
      model: capability,
      metadata: {
        capability,
        dayKey: usage.dayKey,
        limit: quota.limit,
        ...metadata,
      },
    });
    return json({ error: errorMessage }, 429, request, env);
  }

  return null;
}

async function logUsageEvent(args: {
  env: Env;
  request: Request;
  eventType: string;
  userId?: string | null;
  model?: string | null;
  metadata?: Record<string, unknown>;
}) {
  const { env, request, eventType, userId, model, metadata } = args;
  await env.DB.prepare(
    "INSERT INTO usage_events (id, user_id, ip_hash, event_type, model, count, metadata, created_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?)",
  )
    .bind(
      randomId("usage"),
      userId ?? null,
      await hashString(getClientIp(request)),
      eventType,
      model ?? null,
      1,
      JSON.stringify(normalizeMetadata(metadata)),
      Date.now(),
    )
    .run();
}

async function deleteConversationData(
  env: Env,
  userId: string,
  conversationId: string,
) {
  const statements = [
    env.DB.prepare(
      "DELETE FROM artifacts WHERE user_id = ? AND conversation_id = ?",
    ).bind(userId, conversationId),
    env.DB.prepare(
      "DELETE FROM canvas_workspaces WHERE user_id = ? AND conversation_id = ?",
    ).bind(userId, conversationId),
    env.DB.prepare(
      "DELETE FROM conversation_summaries WHERE user_id = ? AND conversation_id = ?",
    ).bind(userId, conversationId),
    env.DB.prepare(
      "DELETE FROM memory_items WHERE user_id = ? AND conversation_id = ?",
    ).bind(userId, conversationId),
    env.DB.prepare(
      "DELETE FROM tool_events WHERE user_id = ? AND conversation_id = ?",
    ).bind(userId, conversationId),
    env.DB.prepare(
      "DELETE FROM messages WHERE user_id = ? AND conversation_id = ?",
    ).bind(userId, conversationId),
    env.DB.prepare(
      "DELETE FROM conversations WHERE user_id = ? AND id = ?",
    ).bind(userId, conversationId),
  ];
  await env.DB.batch(statements);
}

async function deleteUserData(env: Env, userId: string) {
  const statements = [
    env.DB.prepare("DELETE FROM artifacts WHERE user_id = ?").bind(userId),
    env.DB.prepare("DELETE FROM bots WHERE user_id = ?").bind(userId),
    env.DB.prepare("DELETE FROM canvas_workspaces WHERE user_id = ?").bind(
      userId,
    ),
    env.DB.prepare("DELETE FROM conversation_summaries WHERE user_id = ?").bind(
      userId,
    ),
    env.DB.prepare("DELETE FROM daily_usage_counters WHERE user_id = ?").bind(
      userId,
    ),
    env.DB.prepare("DELETE FROM memory_items WHERE user_id = ?").bind(userId),
    env.DB.prepare("DELETE FROM messages WHERE user_id = ?").bind(userId),
    env.DB.prepare("DELETE FROM tool_events WHERE user_id = ?").bind(userId),
    env.DB.prepare("DELETE FROM usage_events WHERE user_id = ?").bind(userId),
    env.DB.prepare("DELETE FROM user_settings WHERE user_id = ?").bind(userId),
    env.DB.prepare("DELETE FROM conversations WHERE user_id = ?").bind(userId),
    env.DB.prepare("DELETE FROM sessions WHERE user_id = ?").bind(userId),
    env.DB.prepare("DELETE FROM oauth_accounts WHERE user_id = ?").bind(userId),
    env.DB.prepare("DELETE FROM users WHERE id = ?").bind(userId),
  ];
  await env.DB.batch(statements);
}

function requireAllowedMutationOrigin(request: Request, env: Env) {
  const origin = request.headers.get("Origin");
  const allowed = resolveAllowedOrigin(origin, env);

  if (!allowed) {
    return new HttpError(403, "Origin not allowed");
  }

  const url = new URL(request.url);
  if (new URL(allowed).origin !== url.origin) {
    return new HttpError(403, "Cross-site mutations are not allowed");
  }

  return null;
}

function sanitizeMode(mode: unknown): ShellMode {
  return typeof mode === "string" && MODE_SET.has(mode as ShellMode)
    ? (mode as ShellMode)
    : "chat";
}

function resolveOpenRouterModels(
  env: Env,
  mode: ShellMode,
  requestedModel?: string,
) {
  const candidates =
    mode === "canvas"
      ? [
          requestedModel,
          openRouterModeModel(env, mode),
          FREE_MODE_MODELS[mode],
          ...CANVAS_FALLBACK_MODELS,
          env.OPENROUTER_DEFAULT_MODEL,
          ...FREE_FALLBACK_MODELS,
        ]
      : [
          requestedModel,
          openRouterModeModel(env, mode),
          env.OPENROUTER_DEFAULT_MODEL,
          FREE_MODE_MODELS[mode],
          ...FREE_FALLBACK_MODELS,
        ];
  return Array.from(
    new Set(
      candidates
        .map((model) => model?.trim())
        .filter((model): model is string => Boolean(model)),
    ),
  );
}

async function openRouterHttpError(response: Response, model: string) {
  const body = await response.text();
  const message = extractOpenRouterMessage(body);
  return new HttpError(
    response.status,
    `OpenRouter ${response.status} on ${model}: ${message}`,
  );
}

function extractOpenRouterMessage(body: string) {
  try {
    const data = JSON.parse(body) as {
      error?: { message?: string; code?: number | string };
      message?: string;
    };
    return (
      data.error?.message ??
      data.message ??
      (data.error?.code ? `Provider code ${data.error.code}` : "")
    );
  } catch {
    return clip(body.replace(/\s+/g, " ").trim(), 500);
  }
}

function isRetryableOpenRouterError(error: HttpError) {
  return [429, 500, 502, 503, 504].includes(error.status);
}

function cleanOpenRouterFailure(error?: HttpError) {
  if (!error) {
    return new HttpError(
      503,
      "Ücretsiz OpenRouter modelleri şu anda cevap vermiyor. Biraz sonra tekrar dene.",
    );
  }

  if (error.status === 429) {
    return new HttpError(
      429,
      "Ücretsiz OpenRouter modelleri şu anda rate-limit verdi. Fallback modeller de dolu görünüyor; biraz sonra tekrar dene.",
    );
  }

  if (error.message.includes("invalid artifact JSON")) {
    return new HttpError(
      502,
      "Model yapılandırılmış artifact JSON'u döndürmedi. Daha net bir istekle tekrar dene.",
    );
  }

  return new HttpError(
    error.status >= 500 ? 503 : error.status,
    "OpenRouter sağlayıcısı şu anda sağlıklı cevap vermedi. Biraz sonra tekrar dene.",
  );
}

function cleanWorkersAiImageFailure(error: unknown, input: string) {
  if (error instanceof HttpError) {
    return error;
  }

  const message =
    error instanceof Error ? error.message : String(error ?? "unknown error");
  const tr = prefersTurkish(input);

  if (/nsfw|unsafe|safety|contains nsfw/i.test(message)) {
    return new HttpError(
      422,
      tr
        ? "Bu görsel isteği Workers AI güvenlik filtresine takıldı. Lütfen daha açık, yetişkin ve güvenli bir tanım kullan."
        : "This image request was blocked by Workers AI safety filters. Please use a clearer adult-safe description.",
    );
  }

  if (
    /rate.?limit|quota|capacity|overloaded|temporarily unavailable/i.test(
      message,
    )
  ) {
    return new HttpError(
      503,
      tr
        ? "Görsel modeli şu anda yoğun görünüyor. Biraz sonra tekrar dene."
        : "The image model looks busy right now. Please try again shortly.",
    );
  }

  return new HttpError(
    502,
    tr
      ? "Görsel üretimi sırasında Workers AI beklenmeyen bir hata döndürdü."
      : "Workers AI returned an unexpected error during image generation.",
  );
}

function openRouterModeModel(env: Env, mode: ShellMode) {
  switch (mode) {
    case "chat":
      return env.OPENROUTER_MODEL_CHAT;
    case "content":
      return env.OPENROUTER_MODEL_CONTENT;
    case "code":
      return env.OPENROUTER_MODEL_CODE;
    case "canvas":
      return env.OPENROUTER_MODEL_CANVAS;
    case "email":
      return env.OPENROUTER_MODEL_EMAIL;
    case "video":
      return env.OPENROUTER_MODEL_VIDEO;
    case "seo":
      return env.OPENROUTER_MODEL_SEO;
    case "image":
      return env.OPENROUTER_MODEL_IMAGE;
    case "voice":
      return env.OPENROUTER_MODEL_VOICE;
    case "resume":
      return env.OPENROUTER_MODEL_RESUME;
    case "bot":
      return env.OPENROUTER_MODEL_BOT;
  }
}

function toPublicUser(user: UserRow) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    avatarUrl: user.avatar_url || undefined,
  };
}

function toConversationSummary(conversation: ConversationRow) {
  return {
    id: conversation.id,
    title: conversation.title,
    mode: conversation.mode,
    model: conversation.model || undefined,
    updatedAt: conversation.updated_at,
  };
}

function toApiMessage(message: MessageRow) {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    mode: message.mode,
    createdAt: message.created_at,
    metadata: parseJsonObject(message.metadata),
  };
}

function toBotSummary(row: BotRow) {
  return {
    id: row.id,
    name: row.name,
    description: row.description,
    tone: row.tone,
    starterPrompts: parseStringArray(row.starter_prompts),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function parseJsonObject(value: string | null | undefined) {
  if (!value) {
    return undefined;
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return isRecord(parsed) ? parsed : undefined;
  } catch {
    return undefined;
  }
}

function parseStringArray(value: string | null | undefined) {
  if (!value) {
    return [];
  }

  try {
    const parsed = JSON.parse(value) as unknown;
    return normalizeStringArray(parsed, []);
  } catch {
    return [];
  }
}

function normalizeMetadata(value: unknown) {
  if (!isRecord(value)) {
    return {};
  }

  const metadata: Record<string, string | number | boolean | string[]> = {};
  for (const [key, item] of Object.entries(value)) {
    if (
      typeof item === "string" ||
      typeof item === "number" ||
      typeof item === "boolean"
    ) {
      metadata[key] = item;
    } else if (Array.isArray(item)) {
      metadata[key] = normalizeStringArray(item, []);
    }
  }
  return metadata;
}

function normalizeString(value: unknown, fallback: string) {
  return typeof value === "string" && value.trim() ? value.trim() : fallback;
}

function optionalString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function normalizeStringArray(value: unknown, fallback: string[] = []) {
  if (!Array.isArray(value)) {
    return fallback;
  }

  const items = value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
  return items.length ? items : fallback;
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function titleFromMessage(message: string) {
  const singleLine = message.replace(/\s+/g, " ").trim();
  return clip(singleLine || "New conversation", 72);
}

function clip(value: string, maxLength: number) {
  return value.length > maxLength
    ? `${value.slice(0, Math.max(0, maxLength - 3))}...`
    : value;
}

function safeFileName(value: string) {
  return (
    value
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "resume"
  );
}

async function renderResumePdf(
  resume: ResumeArtifactData,
  template: ResumeTemplate,
  request: Request,
  env: Env,
) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(
    fontkit as unknown as Parameters<typeof pdfDoc.registerFontkit>[0],
  );

  const fontBytes = await getResumeFontBytes(request, env);
  const regularFont = await pdfDoc.embedFont(fontBytes.regular, {
    subset: true,
  });
  const boldFont = await pdfDoc.embedFont(fontBytes.bold, { subset: true });
  const contentWidth = PDF_PAGE.width - PDF_PAGE.margin * 2;
  let page = pdfDoc.addPage([PDF_PAGE.width, PDF_PAGE.height]);
  let y = 744;

  const addPage = () => {
    page = pdfDoc.addPage([PDF_PAGE.width, PDF_PAGE.height]);
    y = 744;
    if (template === "modern-visual") {
      drawRect(page, 36, 54, 4, 684, PDF_COLORS.accent);
    }
  };
  const ensureSpace = (height: number) => {
    if (y - height < PDF_PAGE.bottom) {
      addPage();
    }
  };
  const addLine = (
    text: string,
    options: {
      x?: number;
      size?: number;
      font?: PDFFont;
      color?: PdfColor;
      leading?: number;
      maxWidth?: number;
    } = {},
  ) => {
    const size = options.size ?? 10;
    const font = options.font ?? regularFont;
    const leading = options.leading ?? size + 4;
    const maxWidth = options.maxWidth ?? contentWidth;

    for (const line of wrapPdfText(text, font, size, maxWidth)) {
      ensureSpace(leading);
      page.drawText(line, {
        x: options.x ?? PDF_PAGE.margin,
        y,
        size,
        font,
        color: options.color ?? PDF_COLORS.black,
      });
      y -= leading;
    }
  };
  const addSection = (heading: string) => {
    ensureSpace(32);
    y -= 8;
    addLine(heading.toLocaleUpperCase("tr-TR"), {
      size: 11,
      font: boldFont,
      color:
        template === "modern-visual" ? PDF_COLORS.accent : PDF_COLORS.black,
      leading: 16,
    });
    drawRect(page, PDF_PAGE.margin, y + 8, contentWidth, 0.7, PDF_COLORS.rule);
    y -= 4;
  };
  const addBullets = (items: string[]) => {
    for (const item of items) {
      addLine(`• ${item}`, {
        x: PDF_PAGE.margin + 10,
        maxWidth: contentWidth - 10,
        leading: 13,
      });
    }
  };

  if (template === "modern-visual") {
    drawRect(page, 0, 690, PDF_PAGE.width, 102, PDF_COLORS.header);
    drawRect(page, 0, 690, 12, 102, PDF_COLORS.teal);
    addLine(resume.fullName, {
      size: 22,
      font: boldFont,
      color: PDF_COLORS.headerText,
      leading: 28,
      maxWidth: contentWidth,
    });
    addLine(resume.headline, {
      size: 11,
      color: PDF_COLORS.headerMuted,
      leading: 16,
      maxWidth: contentWidth,
    });
    addLine(contactLine(resume), {
      size: 9,
      color: PDF_COLORS.headerMuted,
      leading: 16,
      maxWidth: contentWidth,
    });
    y = 660;
  } else {
    addLine(resume.fullName, {
      size: 18,
      font: boldFont,
      leading: 24,
      maxWidth: contentWidth,
    });
    addLine(resume.headline, { size: 11, leading: 16 });
    addLine(contactLine(resume), { size: 9, leading: 16 });
    y -= 6;
  }

  addSection("Summary");
  addLine(resume.summary);

  addSection("Skills");
  addLine(resume.skills.join(" | "));

  if (resume.experience.length) {
    addSection("Experience");
    for (const item of resume.experience) {
      addLine(`${item.role} - ${item.company}`, {
        font: boldFont,
        leading: 14,
      });
      addLine([item.location, item.period].filter(Boolean).join(" | "), {
        size: 9,
        color: PDF_COLORS.muted,
        leading: 12,
      });
      addBullets(item.bullets);
      y -= 4;
    }
  }

  if (resume.projects?.length) {
    addSection("Projects");
    for (const project of resume.projects) {
      addLine(project.name, { font: boldFont, leading: 14 });
      addLine(project.description);
      addBullets(project.bullets ?? []);
      if (project.link) {
        addLine(project.link, { size: 9 });
      }
      y -= 4;
    }
  }

  if (resume.education.length) {
    addSection("Education");
    for (const item of resume.education) {
      addLine(`${item.degree} - ${item.school}`, {
        font: boldFont,
        leading: 14,
      });
      if (item.period) {
        addLine(item.period, {
          size: 9,
          color: PDF_COLORS.muted,
          leading: 12,
        });
      }
      addBullets(item.details ?? []);
    }
  }

  if (resume.languages?.length) {
    addSection("Languages");
    addLine(resume.languages.join(" | "));
  }

  return pdfDoc.save();
}

function contactLine(resume: ResumeArtifactData) {
  return [
    resume.contact.email,
    resume.contact.phone,
    resume.contact.location,
    resume.contact.website,
    resume.contact.linkedin,
    resume.contact.github,
  ]
    .filter(Boolean)
    .join(" | ");
}

async function getResumeFontBytes(request: Request, env: Env) {
  pdfFontBytesCache ??= Promise.all([
    fetchFontBytes(
      env.PDF_FONT_REGULAR_URL ?? fontAssetUrl(request, env, "Inter-400.ttf"),
    ),
    fetchFontBytes(
      env.PDF_FONT_BOLD_URL ?? fontAssetUrl(request, env, "Inter-700.ttf"),
    ),
  ]).then(([regular, bold]) => ({ regular, bold }));

  return pdfFontBytesCache;
}

function fontAssetUrl(request: Request, env: Env, fileName: string) {
  const origin = env.PUBLIC_ORIGIN || new URL(request.url).origin;
  return new URL(`/fonts/${fileName}`, origin).toString();
}

async function fetchFontBytes(url: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new HttpError(503, `PDF font asset unavailable: ${url}`);
  }

  return new Uint8Array(await response.arrayBuffer());
}

function wrapPdfText(
  text: string,
  font: PDFFont,
  size: number,
  maxWidth: number,
) {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let line = "";

  for (const word of words) {
    const next = line ? `${line} ${word}` : word;
    if (font.widthOfTextAtSize(next, size) > maxWidth && line) {
      lines.push(line);
      line = word;
    } else {
      line = next;
    }
  }

  if (line) {
    lines.push(line);
  }

  return lines.length ? lines : [""];
}

function drawRect(
  page: PDFPage,
  x: number,
  y: number,
  width: number,
  height: number,
  color: PdfColor,
) {
  page.drawRectangle({ x, y, width, height, color });
}

function callbackUrl(
  provider: "google" | "github",
  request: Request,
  env: Env,
) {
  const origin = env.API_PUBLIC_ORIGIN || new URL(request.url).origin;
  return `${origin}/api/auth/${provider}/callback`;
}

function sessionCookieValue(
  name: string,
  token: string,
  maxAge: number,
  request: Request,
) {
  const secure = new URL(request.url).protocol === "https:" ? "; Secure" : "";
  return `${name}=${token}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}${secure}`;
}

function appendSessionCookies(
  headers: Headers,
  token: string,
  request: Request,
) {
  headers.append(
    "Set-Cookie",
    sessionCookieValue(SESSION_COOKIE, token, SESSION_TTL_SECONDS, request),
  );
  headers.append(
    "Set-Cookie",
    sessionCookieValue(LEGACY_SESSION_COOKIE, "", 0, request),
  );
}

function appendClearSessionCookies(headers: Headers, request: Request) {
  headers.append(
    "Set-Cookie",
    sessionCookieValue(SESSION_COOKIE, "", 0, request),
  );
  headers.append(
    "Set-Cookie",
    sessionCookieValue(LEGACY_SESSION_COOKIE, "", 0, request),
  );
}

function sessionTokenFromRequest(request: Request) {
  const cookies = parseCookies(request.headers.get("Cookie"));
  return cookies.get(SESSION_COOKIE) ?? cookies.get(LEGACY_SESSION_COOKIE);
}

function parseCookies(header: string | null) {
  const cookies = new Map<string, string>();
  for (const part of (header || "").split(";")) {
    const [key, ...rest] = part.trim().split("=");
    if (key) {
      cookies.set(key, rest.join("="));
    }
  }
  return cookies;
}

function randomId(prefix: string) {
  return `${prefix}_${randomToken().slice(0, 24)}`;
}

function randomToken() {
  const bytes = new Uint8Array(32);
  crypto.getRandomValues(bytes);
  return base64Url(bytes);
}

async function pkceChallenge(verifier: string) {
  return base64Url(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(verifier)),
    ),
  );
}

async function hashString(value: string) {
  return base64Url(
    new Uint8Array(
      await crypto.subtle.digest("SHA-256", new TextEncoder().encode(value)),
    ),
  );
}

function base64Url(bytes: Uint8Array) {
  let binary = "";
  for (const byte of bytes) {
    binary += String.fromCharCode(byte);
  }
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=+$/g, "");
}

function getClientIp(request: Request) {
  return (
    request.headers.get("CF-Connecting-IP") ||
    request.headers.get("X-Forwarded-For")?.split(",")[0]?.trim() ||
    "unknown"
  );
}

function json(
  data: unknown,
  status: number,
  request: Request,
  env: Env,
  headers?: HeadersInit,
) {
  return withCors(
    new Response(JSON.stringify(data), {
      status,
      headers: {
        "Content-Type": "application/json; charset=utf-8",
        ...headers,
      },
    }),
    request,
    env,
  );
}

function withCors(response: Response, request: Request, env: Env) {
  const headers = new Headers(response.headers);
  const origin = request.headers.get("Origin");
  const allowed = resolveAllowedOrigin(origin, env);

  if (allowed) {
    headers.set("Access-Control-Allow-Origin", allowed);
    headers.set("Access-Control-Allow-Credentials", "true");
    headers.set("Vary", "Origin");
  }

  headers.set(
    "Access-Control-Allow-Methods",
    "GET,POST,PUT,PATCH,DELETE,OPTIONS",
  );
  headers.set("Access-Control-Allow-Headers", "Content-Type,Authorization");
  headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  headers.set("X-Content-Type-Options", "nosniff");
  headers.set("X-Frame-Options", "DENY");
  headers.set("Permissions-Policy", "camera=(), microphone=(), geolocation=()");
  headers.set("Cross-Origin-Resource-Policy", "same-site");
  headers.set(
    "Content-Security-Policy",
    "default-src 'none'; frame-ancestors 'none'; base-uri 'none'; form-action 'none'",
  );

  if (new URL(request.url).protocol === "https:") {
    headers.set(
      "Strict-Transport-Security",
      "max-age=31536000; includeSubDomains; preload",
    );
  }

  return new Response(response.body, {
    status: response.status,
    statusText: response.statusText,
    headers,
  });
}

function resolveAllowedOrigin(origin: string | null, env: Env) {
  if (!origin) {
    return null;
  }

  const allowList = (env.ALLOWED_ORIGIN || env.PUBLIC_ORIGIN || "")
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  if (allowList.includes("*") || allowList.includes(origin)) {
    return origin;
  }

  return null;
}

async function writeSse(
  writer: WritableStreamDefaultWriter<Uint8Array>,
  event: string,
  data: unknown,
) {
  await writer.write(
    new TextEncoder().encode(
      `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`,
    ),
  );
}

class HttpError extends Error {
  constructor(
    readonly status: number,
    message: string,
  ) {
    super(message);
  }
}
