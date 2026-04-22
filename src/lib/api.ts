import type {
  AccountUsage,
  AppConfig,
  BotSummary,
  CanvasWorkspaceData,
  ConversationSummary,
  Message,
  ModeArtifact,
  ResumeTemplate,
  ShellMode,
  UserSettings,
  UserProfile,
} from "~/lib/types";

const env = import.meta.env as Record<string, string | undefined>;

export const API_BASE_URL = (env.PUBLIC_API_BASE_URL ?? env.VITE_API_BASE_URL ?? "").replace(/\/$/, "");

export interface MeResponse {
  user: UserProfile | null;
  settings: UserSettings | null;
}

export interface ConversationListResponse {
  conversations: ConversationSummary[];
}

export interface MessageListResponse {
  messages: ApiMessage[];
}

export interface ApiMessage {
  id: string;
  role: Message["role"];
  content: string;
  mode: ShellMode;
  createdAt: number;
  metadata?: {
    artifact?: ModeArtifact;
    artifactId?: string;
    botId?: string;
  };
}

export interface ChatStreamRequest {
  conversationId?: string | null;
  mode: ShellMode;
  model?: string;
  message: string;
  turnstileToken?: string;
  botId?: string | null;
}

export interface RunModeRequest {
  conversationId?: string | null;
  mode: ShellMode;
  input: string;
  model?: string;
  turnstileToken?: string;
  controls?: Record<string, unknown>;
}

export interface RunModeResponse {
  conversationId: string;
  messageId: string;
  artifactId: string;
  artifact: ModeArtifact;
  model: string;
  assistantContent?: string;
  botId?: string;
}

export interface BotListResponse {
  bots: BotSummary[];
}

export interface CanvasWorkspaceResponse {
  workspace: CanvasWorkspaceData | null;
}

export interface CreateConversationResponse {
  conversation: ConversationSummary;
}

export interface AccountSettingsResponse {
  settings: UserSettings;
}

export interface ChatStreamDone {
  conversationId: string;
  messageId: string;
  title?: string;
}

export interface StreamHandlers {
  onDelta: (delta: string) => void;
  onDone?: (payload: ChatStreamDone) => void;
  onMemoryUpdated?: (payload: unknown) => void;
}

export interface ModeStreamHandlers {
  onDelta?: (delta: string) => void;
  onStatus?: (payload: { label: string; step?: number; total?: number }) => void;
  onArtifactDone: (payload: RunModeResponse) => void;
}

export function apiUrl(path: string) {
  return `${API_BASE_URL}${path}`;
}

async function requestJson<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(apiUrl(path), {
    credentials: "include",
    ...init,
    headers: {
      Accept: "application/json",
      ...init?.headers,
    },
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return (await response.json()) as T;
}

async function getErrorMessage(response: Response) {
  try {
    const data = (await response.json()) as { error?: string; message?: string };
    return data.error ?? data.message ?? `Request failed with ${response.status}`;
  } catch {
    return `Request failed with ${response.status}`;
  }
}

export function getCurrentUser() {
  return requestJson<MeResponse>("/api/me");
}

export function getAppConfig() {
  return requestJson<AppConfig>("/api/app-config");
}

export function getConversations() {
  return requestJson<ConversationListResponse>("/api/conversations").then((data) => data.conversations);
}

export function createConversation(request: {
  title?: string;
  mode?: ShellMode;
  model?: string;
}) {
  return requestJson<CreateConversationResponse>("/api/conversations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  }).then((data) => data.conversation);
}

export function getMessages(conversationId: string) {
  return requestJson<MessageListResponse>(`/api/conversations/${encodeURIComponent(conversationId)}/messages`).then(
    (data) => data.messages,
  );
}

export function deleteConversation(conversationId: string) {
  return requestJson<{ ok: true }>(
    `/api/conversations/${encodeURIComponent(conversationId)}`,
    {
      method: "DELETE",
    },
  );
}

export function getCanvasWorkspace(conversationId: string) {
  return requestJson<CanvasWorkspaceResponse>(
    `/api/conversations/${encodeURIComponent(conversationId)}/canvas`,
  ).then((data) => data.workspace);
}

export function saveCanvasWorkspace(
  conversationId: string,
  workspace: CanvasWorkspaceData,
) {
  return requestJson<CanvasWorkspaceResponse>(
    `/api/conversations/${encodeURIComponent(conversationId)}/canvas`,
    {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ workspace }),
    },
  ).then((data) => data.workspace);
}

export function getBots() {
  return requestJson<BotListResponse>("/api/bots").then((data) => data.bots);
}

export function getAccountUsage() {
  return requestJson<AccountUsage>("/api/account/usage");
}

export function updateAccountSettings(request: {
  preferredLanguage?: "en" | "tr";
  onboardingCompleted?: boolean;
}) {
  return requestJson<AccountSettingsResponse>("/api/account/settings", {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  }).then((data) => data.settings);
}

export function runMode(request: RunModeRequest) {
  return requestJson<RunModeResponse>("/api/modes/run", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });
}

export async function downloadResumePdf(artifact: ModeArtifact, template: ResumeTemplate) {
  const response = await fetch(apiUrl("/api/resume/pdf"), {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "application/pdf",
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ artifact, template }),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return response.blob();
}

export async function logout() {
  await requestJson<{ ok: true }>("/api/auth/logout", { method: "POST" });
}

export async function exportAccountData() {
  const response = await fetch(apiUrl("/api/account/export"), {
    method: "GET",
    credentials: "include",
    headers: {
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  return {
    blob: await response.blob(),
    fileName:
      response.headers
        .get("Content-Disposition")
        ?.match(/filename=\"?([^"]+)\"?$/)?.[1] ?? "shadow-account-export.json",
  };
}

export async function deleteAccount() {
  return requestJson<{ ok: true }>("/api/account", { method: "DELETE" });
}

export async function streamChat(request: ChatStreamRequest, handlers: StreamHandlers) {
  const response = await fetch(apiUrl("/api/chat/stream"), {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (!response.body) {
    throw new Error("Streaming is not available in this browser.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let streamError: Error | null = null;

  const handleEvent = (eventName: string, rawData: string) => {
    if (!rawData || rawData === "[DONE]") {
      return;
    }

    const payload = JSON.parse(rawData) as Record<string, unknown>;

    if (eventName === "message.delta") {
      handlers.onDelta(String(payload.delta ?? ""));
      return;
    }

    if (eventName === "message.done") {
      handlers.onDone?.(payload as unknown as ChatStreamDone);
      return;
    }

    if (eventName === "memory.updated") {
      handlers.onMemoryUpdated?.(payload);
      return;
    }

    if (eventName === "error") {
      streamError = new Error(String(payload.error ?? payload.message ?? "Streaming failed"));
    }
  };

  const parseChunk = (chunk: string) => {
    buffer += chunk;
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      let eventName = "message";
      const data: string[] = [];

      for (const line of frame.split("\n")) {
        if (line.startsWith("event:")) {
          eventName = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          data.push(line.slice(5).trimStart());
        }
      }

      handleEvent(eventName, data.join("\n"));
    }
  };

  while (true) {
    const { done, value } = await reader.read();

    if (done) {
      break;
    }

    parseChunk(decoder.decode(value, { stream: true }));

    if (streamError) {
      throw streamError;
    }
  }

  parseChunk(decoder.decode());

  if (buffer.trim()) {
    parseChunk("\n\n");
  }

  if (streamError) {
    throw streamError;
  }
}

export async function streamModeRun(
  request: RunModeRequest,
  handlers: ModeStreamHandlers,
) {
  const response = await fetch(apiUrl("/api/modes/run/stream"), {
    method: "POST",
    credentials: "include",
    headers: {
      Accept: "text/event-stream",
      "Content-Type": "application/json",
    },
    body: JSON.stringify(request),
  });

  if (!response.ok) {
    throw new Error(await getErrorMessage(response));
  }

  if (!response.body) {
    throw new Error("Streaming is not available in this browser.");
  }

  const reader = response.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let streamError: Error | null = null;

  const handleEvent = (eventName: string, rawData: string) => {
    if (!rawData || rawData === "[DONE]") {
      return;
    }

    const payload = JSON.parse(rawData) as Record<string, unknown>;

    if (eventName === "message.delta") {
      handlers.onDelta?.(String(payload.delta ?? ""));
      return;
    }

    if (eventName === "status") {
      handlers.onStatus?.({
        label: String(payload.label ?? ""),
        step: typeof payload.step === "number" ? payload.step : undefined,
        total: typeof payload.total === "number" ? payload.total : undefined,
      });
      return;
    }

    if (eventName === "artifact.done") {
      handlers.onArtifactDone(payload as unknown as RunModeResponse);
      return;
    }

    if (eventName === "error") {
      streamError = new Error(String(payload.error ?? payload.message ?? "Streaming failed"));
    }
  };

  const parseChunk = (chunk: string) => {
    buffer += chunk;
    const frames = buffer.split("\n\n");
    buffer = frames.pop() ?? "";

    for (const frame of frames) {
      let eventName = "message";
      const data: string[] = [];

      for (const line of frame.split("\n")) {
        if (line.startsWith("event:")) {
          eventName = line.slice(6).trim();
        } else if (line.startsWith("data:")) {
          data.push(line.slice(5).trimStart());
        }
      }

      handleEvent(eventName, data.join("\n"));
    }
  };

  while (true) {
    const { done, value } = await reader.read();
    if (done) {
      break;
    }
    parseChunk(decoder.decode(value, { stream: true }));
  }

  parseChunk(decoder.decode());

  if (streamError) {
    throw streamError;
  }
}
