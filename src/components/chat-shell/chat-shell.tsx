import {
  $,
  component$,
  useSignal,
  useStore,
  useVisibleTask$,
} from "@builder.io/qwik";

import {
  apiUrl,
  createConversation,
  deleteAccount,
  deleteConversation,
  exportAccountData,
  getAccountUsage,
  getAppConfig,
  getBots,
  getCanvasWorkspace,
  getConversations,
  getCurrentUser,
  getMessages,
  logout,
  runMode,
  saveCanvasWorkspace,
  streamChat,
  streamModeRun,
  updateAccountSettings,
} from "~/lib/api";
import type { ApiMessage, ChatStreamDone, RunModeResponse } from "~/lib/api";
import { AUTO_MODEL_VALUE, getModelOptionsForMode } from "~/lib/model-options";
import type {
  AccountUsage,
  AppConfig,
  BotSummary,
  CanvasArtifactData,
  CanvasWorkspaceData,
  ConversationSummary,
  Message,
  ShellMode,
  UserSettings,
  UserProfile,
} from "~/lib/types";
import { MODES } from "~/lib/types";
import { isInternalRouterModel } from "../../../shared/branding";
import { routeUserInput } from "../../../shared/intent-router";
import {
  applyCanvasArtifactToWorkspace,
  createDefaultCanvasWorkspace,
  diffWorkspaceLines,
  localCanvasStorageKey,
  normalizeCanvasWorkspace,
  seedCanvasWorkspaceFromMessage,
  upgradeLegacyCanvasWorkspace,
} from "~/lib/canvas";
import {
  getStoredLanguage,
  modePlaceholder,
  setStoredLanguage,
  t,
  type Language,
} from "~/lib/i18n";
import { acquireTurnstileToken } from "~/lib/turnstile";
import { CanvasWorkbench } from "~/components/canvas/canvas-workbench";
import { InputBar } from "~/components/chat-shell/input-bar";
import {
  MessageBubble,
  TypingIndicator,
  WelcomeScreen,
} from "~/components/chat-shell/message-bubble";
import {
  CodeToolbar,
  EmailControls,
  ImageControls,
  ModeHeader,
  SEOControls,
  VideoControls,
  VoiceControls,
} from "~/components/modes/mode-panels";
import { Sidebar } from "~/components/sidebar/sidebar";

function generateId() {
  return Math.random().toString(36).slice(2, 11);
}

function formatClock() {
  return new Intl.DateTimeFormat("tr-TR", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  }).format(new Date());
}

function getModeIdFromHash(hash: string): ShellMode | null {
  const match = hash.match(
    /^#\/(chat|content|code|canvas|email|video|seo|image|voice|resume|bot)$/,
  );
  return match ? (match[1] as ShellMode) : null;
}

function toUiMessage(message: ApiMessage): Message {
  return {
    id: message.id,
    role: message.role,
    content: message.content,
    mode: message.mode,
    timestamp: message.createdAt,
    metadata: message.metadata,
  };
}

const activeModeById = (modeId: ShellMode) =>
  MODES.find((mode) => mode.id === modeId) ?? MODES[0];

const DEFAULT_APP_CONFIG: AppConfig = {
  product: {
    name: "Shadow AI",
    tier: "free-beta",
    signInRequired: true,
    canvasBeta: true,
  },
  auth: {
    providers: [
      { id: "google", enabled: true },
      { id: "github", enabled: true },
    ],
  },
  turnstile: {
    enabled: false,
  },
  quotas: {
    chatDaily: 50,
    modeDaily: 30,
    imageDaily: 6,
    resumePdfDaily: 5,
  },
  features: {
    attachments: false,
    screenshot: false,
    connectors: false,
    voiceInput: false,
    memoryToggle: false,
    canvasBeta: true,
  },
  links: {
    privacyUrl: "/privacy/",
    termsUrl: "/terms/",
    helpUrl: "/help/",
    supportEmail: "support@lavescar.com.tr",
    supportMailto: "mailto:support@lavescar.com.tr",
  },
};

function capabilityForMode(mode: ShellMode) {
  if (mode === "chat") {
    return "chat";
  }
  if (mode === "image") {
    return "image";
  }
  return "mode";
}

function isAuthFailure(error: unknown) {
  return (
    error instanceof Error &&
    /authentication required|request failed with 401/i.test(error.message)
  );
}

function quotaLabel(key: string, language: Language) {
  if (key === "resume_pdf") {
    return language === "tr" ? "PDF" : "PDF";
  }
  if (key === "image") {
    return language === "tr" ? "Görsel" : "Image";
  }
  if (key === "mode") {
    return language === "tr" ? "Mod" : "Mode";
  }
  return language === "tr" ? "Sohbet" : "Chat";
}

function formatResetTime(timestamp: number, language: Language) {
  return new Intl.DateTimeFormat(language === "tr" ? "tr-TR" : "en-US", {
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(timestamp));
}

function defaultControls(mode: ShellMode) {
  const controls: Record<string, unknown> = {
    localePolicy: "follow-input",
  };

  if (mode === "resume") {
    controls.templates = ["ats-professional", "modern-visual"];
    controls.target = "professional resume";
  }

  if (mode === "bot") {
    controls.persist = true;
    controls.memoryPolicy = "use relevant long-term memory only";
  }

  if (mode === "image") {
    controls.aspectRatio = "16:9";
    controls.style = "Photorealistic";
  }

  return controls;
}

const MODEL_PREFS_STORAGE_KEY = "shadow-model-prefs";

const CANVAS_PROGRESS_STEPS = [
  {
    message: "Analyzing canvas brief...",
    status: "Analyzing canvas request...",
  },
  {
    message: "Planning page layout and sections...",
    status: "Planning layout and sections...",
  },
  {
    message: "Writing canvas files...",
    status: "Writing canvas files...",
  },
  {
    message: "Preparing live preview...",
    status: "Preparing live preview...",
  },
] as const;

function formatCanvasAssistantReply(
  artifact: CanvasArtifactData | undefined,
  summary: string,
  model: string,
  language: Language,
  metadata?: Record<string, unknown>,
) {
  const changedFiles = artifact?.changedFiles?.length
    ? artifact.changedFiles.join(", ")
    : language === "tr"
      ? "App.tsx, styles.css, index.html"
      : "App.tsx, styles.css, index.html";
  const templateLabel = artifact?.template === "html" ? "HTML" : "React";
  const isFallback =
    metadata?.routeReason === "canvas-fallback-scaffold" ||
    isInternalRouterModel(model);
  const attemptedModel =
    typeof metadata?.attemptedModel === "string" ? metadata.attemptedModel : "";
  const modelLabel = isFallback && attemptedModel ? attemptedModel : model;

  if (language === "tr") {
    if (isFallback) {
      return [
        `Canvas icin ${templateLabel} workspace yazdim ama provider dogrudan calisan kod yerine timeout/uyumsuz cevap verdigi icin guvenli fallback scaffold uyguladim.`,
        `Degisen dosyalar: ${changedFiles}.`,
        `Model hatti: ${modelLabel}.`,
        summary,
      ].join(" ");
    }

    return [
      `Canvas icin ${templateLabel} workspace'i guncelledim.`,
      `Degisen dosyalar: ${changedFiles}.`,
      `Model: ${modelLabel}.`,
      summary,
    ].join(" ");
  }

  if (isFallback) {
    return [
      `I prepared a ${templateLabel} canvas workspace, but the provider timed out or returned an unusable payload so I applied a safe fallback scaffold.`,
      `Changed files: ${changedFiles}.`,
      `Model path: ${modelLabel}.`,
      summary,
    ].join(" ");
  }

  return [
    `I updated the ${templateLabel} canvas workspace.`,
    `Changed files: ${changedFiles}.`,
    `Model: ${modelLabel}.`,
    summary,
  ].join(" ");
}

export const ChatShell = component$(() => {
  const activeMode = useSignal<ShellMode>("chat");
  const streaming = useSignal(false);
  const clock = useSignal(formatClock());
  const scrollRef = useSignal<HTMLDivElement>();
  const turnstileRef = useSignal<HTMLDivElement>();
  const currentConversationId = useSignal<string | null>(null);
  const apiStatus = useSignal("Checking session...");
  const selectedBotId = useSignal<string | null>(null);
  const language = useSignal<Language>("en");
  const authModalOpen = useSignal(false);
  const accountMenuOpen = useSignal(false);
  const onboardingOpen = useSignal(false);
  const accountBusy = useSignal("");
  const authIntent = useSignal<"signin" | "signup">("signin");
  const user = useStore<{ current: UserProfile | null; loaded: boolean }>({
    current: null,
    loaded: false,
  });
  const userSettings = useStore<{ current: UserSettings | null }>({
    current: null,
  });
  const appConfig = useStore<{ current: AppConfig }>({
    current: DEFAULT_APP_CONFIG,
  });
  const accountUsage = useStore<{ current: AccountUsage | null }>({
    current: null,
  });
  const conversations = useStore<{ list: ConversationSummary[] }>({ list: [] });
  const bots = useStore<{ list: BotSummary[] }>({ list: [] });
  const messages = useStore<{ list: Message[] }>({ list: [] });
  const selectedModels = useStore<Partial<Record<ShellMode, string>>>({});
  const canvasWorkspace = useSignal<CanvasWorkspaceData>(
    createDefaultCanvasWorkspace("react"),
  );
  const canvasStatus = useSignal("");
  const canvasBusy = useSignal(false);
  const canvasBusyLabel = useSignal("");
  const canvasBusyStep = useSignal(0);
  const canvasMobileTab = useSignal<"chat" | "code" | "preview">("chat");
  const loadedCanvasKey = useSignal<string>("");
  const canvasHistory = useStore<{ snapshots: CanvasWorkspaceData[] }>({
    snapshots: [],
  });
  const canvasDiff = useSignal<Record<string, number[]> | null>(null);

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const tick = () => {
      clock.value = formatClock();
    };

    tick();
    const interval = window.setInterval(tick, 1000);
    return () => window.clearInterval(interval);
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const storedLanguage = getStoredLanguage();
    language.value = storedLanguage;
    setStoredLanguage(storedLanguage);
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    try {
      const raw = globalThis.localStorage.getItem(MODEL_PREFS_STORAGE_KEY);
      if (!raw) {
        return;
      }

      const parsed = JSON.parse(raw) as Partial<Record<ShellMode, string>>;
      for (const mode of MODES) {
        const value = parsed[mode.id];
        if (typeof value === "string" && value) {
          selectedModels[mode.id] = value;
        }
      }
    } catch {
      // Keep selections in memory if local storage is unavailable.
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    const syncModeFromHash = () => {
      const hashMode = getModeIdFromHash(globalThis.location.hash);
      if (hashMode) {
        activeMode.value = hashMode;
      }
    };

    syncModeFromHash();
    globalThis.addEventListener("hashchange", syncModeFromHash);
    return () => globalThis.removeEventListener("hashchange", syncModeFromHash);
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    try {
      appConfig.current = await getAppConfig();
    } catch {
      appConfig.current = DEFAULT_APP_CONFIG;
    }

    try {
      const me = await getCurrentUser();
      user.current = me.user;
      userSettings.current = me.settings;
      user.loaded = true;

      if (me.settings?.preferredLanguage) {
        language.value = me.settings.preferredLanguage;
        setStoredLanguage(me.settings.preferredLanguage);
      }

      if (!me.user) {
        accountUsage.current = null;
        apiStatus.value = "Sign in to start your free beta workspace.";
        if (
          new URLSearchParams(globalThis.location.search).get("auth") === "1"
        ) {
          authModalOpen.value = true;
        }
        return;
      }

      try {
        accountUsage.current = await getAccountUsage();
      } catch {
        accountUsage.current = null;
      }
      conversations.list = await getConversations();
      bots.list = await getBots();
      apiStatus.value = "Connected to Cloudflare edge memory.";
      onboardingOpen.value = !me.settings?.onboardingCompleted;

      if (conversations.list[0]) {
        currentConversationId.value = conversations.list[0].id;
        activeMode.value = conversations.list[0].mode;
        globalThis.location.hash = `#/${conversations.list[0].mode}`;
        const storedMessages = await getMessages(conversations.list[0].id);
        messages.list = storedMessages.map(toUiMessage);
      }
    } catch (error) {
      user.loaded = true;
      apiStatus.value =
        error instanceof Error ? error.message : "API is unavailable.";
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    track(() => messages.list.length);
    track(() => streaming.value);

    const frame = window.requestAnimationFrame(() => {
      if (scrollRef.value) {
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
      }
    });

    cleanup(() => window.cancelAnimationFrame(frame));
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async ({ track }) => {
    const mode = track(() => activeMode.value);
    const conversationId = track(() => currentConversationId.value);
    const userId = track(() => user.current?.id ?? "");

    if (mode !== "canvas") {
      return;
    }

    const loadKey = `${userId || "anon"}:${conversationId || "local"}`;
    if (loadedCanvasKey.value === loadKey) {
      return;
    }

    let nextWorkspace = createDefaultCanvasWorkspace("react");
    try {
      if (user.current && conversationId) {
        const stored = await getCanvasWorkspace(conversationId);
        if (stored) {
          const upgraded = upgradeLegacyCanvasWorkspace(
            normalizeCanvasWorkspace(stored, stored.template),
          );
          nextWorkspace = upgraded.workspace;
          canvasStatus.value = upgraded.upgraded
            ? "Canvas starter refreshed."
            : "Canvas workspace ready.";
        } else {
          try {
            const raw = localStorage.getItem(
              localCanvasStorageKey(conversationId),
            );
            if (raw) {
              const upgraded = upgradeLegacyCanvasWorkspace(
                normalizeCanvasWorkspace(JSON.parse(raw), "react"),
              );
              nextWorkspace = upgraded.workspace;
              canvasStatus.value = upgraded.upgraded
                ? "Canvas starter refreshed."
                : "Canvas workspace ready.";
            } else {
              nextWorkspace = createDefaultCanvasWorkspace("react");
            }
          } catch {
            nextWorkspace = createDefaultCanvasWorkspace("react");
          }
        }
      } else {
        try {
          const raw = localStorage.getItem(
            localCanvasStorageKey(conversationId),
          );
          if (raw) {
            const upgraded = upgradeLegacyCanvasWorkspace(
              normalizeCanvasWorkspace(JSON.parse(raw), "react"),
            );
            nextWorkspace = upgraded.workspace;
            canvasStatus.value = upgraded.upgraded
              ? "Canvas starter refreshed."
              : "Canvas saved locally.";
          } else {
            nextWorkspace = createDefaultCanvasWorkspace("react");
          }
        } catch {
          nextWorkspace = createDefaultCanvasWorkspace("react");
        }
        if (!canvasStatus.value) {
          canvasStatus.value = "Canvas saved locally.";
        }
      }
    } catch (error) {
      try {
        const raw = localStorage.getItem(localCanvasStorageKey(conversationId));
        nextWorkspace = raw
          ? normalizeCanvasWorkspace(JSON.parse(raw), "react")
          : createDefaultCanvasWorkspace("react");
      } catch {
        nextWorkspace = createDefaultCanvasWorkspace("react");
      }
      canvasStatus.value =
        error instanceof Error ? error.message : "Canvas saved locally.";
    }

    canvasWorkspace.value = nextWorkspace;
    loadedCanvasKey.value = loadKey;
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track, cleanup }) => {
    const mode = track(() => activeMode.value);
    const conversationId = track(() => currentConversationId.value);
    const userId = track(() => user.current?.id ?? "");
    track(() => JSON.stringify(canvasWorkspace.value));

    if (mode !== "canvas") {
      return;
    }

    const timer = window.setTimeout(async () => {
      const snapshot = canvasWorkspace.value;
      try {
        localStorage.setItem(
          localCanvasStorageKey(conversationId),
          JSON.stringify(snapshot),
        );
      } catch {
        // Ignore local storage write failures.
      }

      if (!userId || !conversationId) {
        canvasStatus.value = "Canvas saved locally.";
        return;
      }

      try {
        canvasStatus.value = "Saving canvas...";
        await saveCanvasWorkspace(conversationId, snapshot);
        canvasStatus.value = "Canvas saved.";
      } catch (error) {
        canvasStatus.value =
          error instanceof Error ? error.message : "Canvas saved locally.";
      }
    }, 520);

    cleanup(() => window.clearTimeout(timer));
  });

  const refreshUsage = $(async () => {
    if (!user.current) {
      accountUsage.current = null;
      return;
    }

    try {
      accountUsage.current = await getAccountUsage();
    } catch {
      // Keep the last known snapshot visible if usage refresh fails.
    }
  });

  const syncLanguagePreference = $(async (nextLanguage: Language) => {
    if (!user.current) {
      return;
    }

    try {
      userSettings.current = await updateAccountSettings({
        preferredLanguage: nextLanguage,
      });
    } catch {
      // Keep local language even if the profile update fails.
    }
  });

  const closeOnboarding = $(async () => {
    onboardingOpen.value = false;
    if (!user.current) {
      return;
    }

    try {
      userSettings.current = await updateAccountSettings({
        onboardingCompleted: true,
        preferredLanguage: language.value,
      });
    } catch {
      // Best effort only.
    }
  });

  const openAuthModal = $((intent: "signin" | "signup" = "signin") => {
    authIntent.value = intent;
    authModalOpen.value = true;
  });

  const ensureTurnstileToken = $(async () => {
    const turnstile = appConfig.current.turnstile;
    if (!turnstile.enabled || !turnstile.siteKey) {
      return undefined;
    }

    if (!turnstileRef.value) {
      throw new Error("Security verification is still loading.");
    }

    return await acquireTurnstileToken(turnstile.siteKey, turnstileRef.value);
  });

  const refreshConversations = $(async () => {
    if (!user.current) {
      return;
    }

    conversations.list = await getConversations();
  });

  const ensureCanvasConversation = $(async () => {
    if (!user.current || currentConversationId.value) {
      return currentConversationId.value;
    }

    const conversation = await createConversation({
      title: "Canvas workspace",
      mode: "canvas",
    });
    currentConversationId.value = conversation.id;
    await refreshConversations();
    return conversation.id;
  });

  const updateSelectedModel = $((model: string) => {
    selectedModels[activeMode.value] = model;
    try {
      globalThis.localStorage.setItem(
        MODEL_PREFS_STORAGE_KEY,
        JSON.stringify(selectedModels),
      );
    } catch {
      // Keep the in-memory selection if persistence fails.
    }
  });

  const selectConversation = $(async (conversationId: string) => {
    currentConversationId.value = conversationId;
    streaming.value = false;
    const selectedMode = conversations.list.find(
      (item) => item.id === conversationId,
    )?.mode;
    if (selectedMode) {
      activeMode.value = selectedMode;
      globalThis.location.hash = `#/${selectedMode}`;
    }
    const storedMessages = await getMessages(conversationId);
    messages.list = storedMessages.map(toUiMessage);
  });

  const switchMode = $(async (mode: ShellMode) => {
    if (mode === "canvas") {
      await ensureCanvasConversation();
      canvasMobileTab.value = "chat";
    }
    activeMode.value = mode;
    globalThis.location.hash = `#/${mode}`;
  });

  const updateCanvasWorkspace = $((workspace: CanvasWorkspaceData) => {
    canvasWorkspace.value = workspace;
  });

  const resetCanvasWorkspace = $(() => {
    const template = canvasWorkspace.value.template;
    canvasWorkspace.value = createDefaultCanvasWorkspace(template);
    canvasHistory.snapshots = [];
    canvasDiff.value = null;
    canvasStatus.value = "Canvas reset to latest starter.";
    canvasMobileTab.value = "code";
  });

  const undoCanvasChange = $(() => {
    const snap = canvasHistory.snapshots.pop();
    if (snap) canvasWorkspace.value = snap;
    canvasDiff.value = null;
  });

  const acceptCanvasDiff = $(() => {
    canvasDiff.value = null;
  });

  const revertCanvasDiff = $(() => {
    const snap = canvasHistory.snapshots.pop();
    if (snap) canvasWorkspace.value = snap;
    canvasDiff.value = null;
  });

  const applyCanvasArtifact = $(async (artifact: CanvasArtifactData) => {
    if (activeMode.value !== "canvas") {
      await switchMode("canvas");
    }

    const prev = canvasWorkspace.value;
    canvasHistory.snapshots = [...canvasHistory.snapshots.slice(-4), prev];
    const next = applyCanvasArtifactToWorkspace(prev, artifact);
    canvasDiff.value = diffWorkspaceLines(prev, next);
    canvasWorkspace.value = next;
    canvasStatus.value = "Canvas workspace ready.";
    canvasMobileTab.value = "preview";
  });

  const openCanvasFromCode = $(async () => {
    await switchMode("canvas");
    canvasStatus.value = "Canvas workspace ready.";
  });

  const openMessageInCanvas = $(async (content: string) => {
    await switchMode("canvas");
    const seeded = seedCanvasWorkspaceFromMessage(content);
    if (seeded) {
      canvasWorkspace.value = seeded;
      canvasStatus.value = "Canvas imported from message.";
      canvasMobileTab.value = "code";
      return;
    }

    canvasStatus.value =
      "Could not auto-import this answer. Ask again in /canvas or paste the code into the editor.";
    canvasMobileTab.value = "code";
  });

  const toggleLanguage = $(async () => {
    const nextLanguage = language.value === "tr" ? "en" : "tr";
    language.value = nextLanguage;
    setStoredLanguage(nextLanguage);
    await syncLanguagePreference(nextLanguage);
  });

  const resetConversation = $(() => {
    messages.list = [];
    streaming.value = false;
    currentConversationId.value = null;
    loadedCanvasKey.value = "";
    activeMode.value = "chat";
    globalThis.location.hash = "#/chat";
  });

  const clearConversation = $(() => {
    messages.list = [];
    streaming.value = false;
    currentConversationId.value = null;
    loadedCanvasKey.value = "";
  });

  const signIn = $((provider: "google" | "github") => {
    globalThis.location.href = apiUrl(`/api/auth/${provider}/start`);
  });

  const signOut = $(async () => {
    await logout();
    user.current = null;
    userSettings.current = null;
    accountUsage.current = null;
    conversations.list = [];
    bots.list = [];
    messages.list = [];
    currentConversationId.value = null;
    selectedBotId.value = null;
    loadedCanvasKey.value = "";
    accountMenuOpen.value = false;
    authModalOpen.value = false;
    onboardingOpen.value = false;
    apiStatus.value = "Signed out.";
  });

  const exportData = $(async () => {
    try {
      accountBusy.value = "Preparing export...";
      const exported = await exportAccountData();
      const url = URL.createObjectURL(exported.blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = exported.fileName;
      document.body.appendChild(link);
      link.click();
      link.remove();
      URL.revokeObjectURL(url);
      accountBusy.value = "Export ready";
      accountMenuOpen.value = false;
    } catch (error) {
      accountBusy.value =
        error instanceof Error ? error.message : "Export failed";
    }
  });

  const removeAccount = $(async () => {
    const confirmed = window.confirm(
      language.value === "tr"
        ? "Hesabını, konuşmalarını ve kayıtlı botlarını kalıcı olarak silmek istediğine emin misin?"
        : "Are you sure you want to permanently delete your account, conversations, and saved bots?",
    );
    if (!confirmed) {
      return;
    }

    try {
      accountBusy.value = "Deleting account...";
      await deleteAccount();
      user.current = null;
      userSettings.current = null;
      accountUsage.current = null;
      conversations.list = [];
      bots.list = [];
      messages.list = [];
      currentConversationId.value = null;
      loadedCanvasKey.value = "";
      accountMenuOpen.value = false;
      onboardingOpen.value = false;
      apiStatus.value = "Account deleted.";
    } catch (error) {
      accountBusy.value =
        error instanceof Error ? error.message : "Delete failed";
    }
  });

  const removeConversation = $(async (conversationId: string) => {
    const confirmed = window.confirm(
      language.value === "tr"
        ? "Bu konuşmayı silmek istiyor musun?"
        : "Delete this conversation?",
    );
    if (!confirmed) {
      return;
    }

    try {
      if (user.current) {
        await deleteConversation(conversationId);
      }

      conversations.list = conversations.list.filter(
        (item) => item.id !== conversationId,
      );

      if (currentConversationId.value === conversationId) {
        messages.list = [];
        currentConversationId.value = null;
        loadedCanvasKey.value = "";
        const nextConversation = conversations.list[0];
        if (nextConversation) {
          await selectConversation(nextConversation.id);
        }
      }
    } catch (error) {
      apiStatus.value =
        error instanceof Error ? error.message : "Delete failed";
    }
  });

  const selectBot = $((event: Event) => {
    const value = (event.target as HTMLSelectElement).value;
    selectedBotId.value = value || null;
  });

  const sendMessage = $(async (text: string) => {
    if (streaming.value) {
      return;
    }

    const query = text.trim();
    if (!query) {
      return;
    }

    if (!user.current) {
      apiStatus.value = "Sign in to start your free beta workspace.";
      await openAuthModal("signin");
      return;
    }

    const previousMode = activeMode.value;
    const route = routeUserInput(query, previousMode);
    const effectiveMode = route.mode;
    const requestedModel =
      selectedModels[effectiveMode] &&
      selectedModels[effectiveMode] !== AUTO_MODEL_VALUE
        ? selectedModels[effectiveMode]
        : undefined;
    if (route.kind !== "meta" && effectiveMode !== previousMode) {
      await switchMode(effectiveMode);
    }
    let turnstileToken: string | undefined;
    try {
      turnstileToken = await ensureTurnstileToken();
    } catch (error) {
      apiStatus.value =
        error instanceof Error
          ? error.message
          : "Security verification failed. Please try again.";
      return;
    }

    const userMsg: Message = {
      id: generateId(),
      role: "user",
      content: query,
      mode: effectiveMode,
      timestamp: Date.now(),
    };

    const assistantMsg: Message = {
      id: generateId(),
      role: "assistant",
      content: "",
      mode: effectiveMode,
      timestamp: Date.now(),
      streaming: true,
    };

    const appendMessage = (message: Message) => {
      messages.list = [...messages.list, message];
    };
    const patchMessage = (index: number, patch: Partial<Message>) => {
      const current = messages.list[index];
      if (!current) {
        return;
      }
      const next = messages.list.slice();
      next[index] = {
        ...current,
        ...patch,
      };
      messages.list = next;
    };
    const appendToMessageContent = (index: number, delta: string) => {
      const current = messages.list[index];
      if (!current) {
        return;
      }
      patchMessage(index, {
        content: `${current.content}${delta}`,
      });
    };

    appendMessage(userMsg);

    if (effectiveMode !== "chat") {
      const isCanvasRun = effectiveMode === "canvas";
      const requestControls = {
        ...defaultControls(effectiveMode),
        preferredLanguage: language.value,
        autoRoutedFrom: previousMode,
        routeReason: route.reason,
        metaIntent: route.kind === "meta",
        ...(effectiveMode === "canvas"
          ? {
              canvasTemplate: canvasWorkspace.value.template,
              canvasActiveFile: canvasWorkspace.value.activeFile,
              canvasFiles: canvasWorkspace.value.files,
            }
          : {}),
      };
      const pendingMsg: Message = {
        ...assistantMsg,
        content: isCanvasRun
          ? ""
          : t("Generating structured artifact...", language.value),
        streaming: true,
      };
      appendMessage(pendingMsg);
      streaming.value = true;
      const assistantIndex = messages.list.length - 1;
      let pendingDelta = "";
      let deltaFrame = 0;
      const flushPendingDelta = () => {
        if (!pendingDelta) {
          return;
        }

        appendToMessageContent(assistantIndex, pendingDelta);
        pendingDelta = "";
        if (scrollRef.value) {
          scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
        }
      };
      const scheduleDeltaFlush = () => {
        if (deltaFrame) {
          return;
        }

        deltaFrame = globalThis.requestAnimationFrame(() => {
          deltaFrame = 0;
          flushPendingDelta();
        });
      };
      const cancelDeltaFlush = () => {
        if (!deltaFrame) {
          return;
        }

        globalThis.cancelAnimationFrame(deltaFrame);
        deltaFrame = 0;
      };

      try {
        if (isCanvasRun) {
          canvasBusy.value = true;
          canvasBusyLabel.value = "Preparing canvas workspace...";
          canvasBusyStep.value = 1;
          canvasStatus.value = "Preparing canvas workspace...";

          let streamResult: RunModeResponse | null = null;

          await streamModeRun(
            {
              conversationId: currentConversationId.value,
              mode: effectiveMode,
              input: query,
              model: requestedModel,
              turnstileToken,
              controls: requestControls,
            },
            {
              onDelta: (delta: string) => {
                pendingDelta += delta;
                scheduleDeltaFlush();
              },
              onStatus: (payload) => {
                if (payload.label) {
                  canvasStatus.value = payload.label;
                  canvasBusyLabel.value = payload.label;
                }
                if (typeof payload.step === "number") {
                  canvasBusyStep.value = payload.step;
                }
              },
              onArtifactDone: (payload) => {
                streamResult = payload;
              },
            },
          );

          cancelDeltaFlush();
          flushPendingDelta();

          if (!streamResult) {
            throw new Error("Canvas stream finished without an artifact.");
          }

          const finalResult = streamResult as RunModeResponse;

          currentConversationId.value = finalResult.conversationId;
          patchMessage(assistantIndex, {
            id: finalResult.messageId,
            content:
              finalResult.assistantContent ||
              formatCanvasAssistantReply(
                finalResult.artifact.canvas,
                finalResult.artifact.summary,
                finalResult.model,
                language.value,
                finalResult.artifact.metadata,
              ),
            metadata: {
              artifact: finalResult.artifact,
              artifactId: finalResult.artifactId,
              selectedModel: finalResult.model,
              botId: finalResult.botId,
            },
            streaming: false,
          });

          if (finalResult.artifact.canvas) {
            const prev = canvasWorkspace.value;
            canvasHistory.snapshots = [
              ...canvasHistory.snapshots.slice(-4),
              prev,
            ];
            const next = applyCanvasArtifactToWorkspace(
              prev,
              finalResult.artifact.canvas,
            );
            canvasDiff.value = diffWorkspaceLines(prev, next);
            canvasWorkspace.value = next;
            canvasStatus.value = "Canvas workspace ready.";
            canvasMobileTab.value = "preview";
          }

          streaming.value = false;
          globalThis.setTimeout(() => {
            canvasBusy.value = false;
            canvasBusyLabel.value = "";
            canvasBusyStep.value = 0;
          }, 520);
          await refreshConversations();
          await refreshUsage();
          return;
        }

        const result = await runMode({
          conversationId: currentConversationId.value,
          mode: effectiveMode,
          input: query,
          model: requestedModel,
          turnstileToken,
          controls: requestControls,
        });

        currentConversationId.value = result.conversationId;
        patchMessage(assistantIndex, {
          id: result.messageId,
          content: result.artifact.summary,
          metadata: {
            artifact: result.artifact,
            artifactId: result.artifactId,
            selectedModel: result.model,
            botId: result.botId,
          },
          streaming: false,
        });

        streaming.value = false;
        if (isCanvasRun) {
          globalThis.setTimeout(() => {
            canvasBusy.value = false;
            canvasBusyLabel.value = "";
            canvasBusyStep.value = 0;
          }, 520);
        }
        await refreshConversations();
        await refreshUsage();
        if (effectiveMode === "bot") {
          bots.list = await getBots();
          selectedBotId.value = result.botId ?? selectedBotId.value;
        }
      } catch (error) {
        if (isAuthFailure(error)) {
          authModalOpen.value = true;
          user.current = null;
          accountUsage.current = null;
        }
        patchMessage(assistantIndex, {
          streaming: false,
          content:
            error instanceof Error
              ? `Backend error: ${error.message}`
              : t("Backend error: the mode run failed.", language.value),
        });
        if (isCanvasRun) {
          canvasStatus.value =
            error instanceof Error
              ? error.message
              : "Backend error: the mode run failed.";
          canvasBusy.value = false;
          canvasBusyLabel.value = "";
          canvasBusyStep.value = 0;
        }
        streaming.value = false;
      } finally {
        cancelDeltaFlush();
      }

      return;
    }

    appendMessage(assistantMsg);
    streaming.value = true;
    const assistantIndex = messages.list.length - 1;
    let pendingDelta = "";
    let deltaFrame = 0;
    const flushPendingDelta = () => {
      if (!pendingDelta) {
        return;
      }

      appendToMessageContent(assistantIndex, pendingDelta);
      pendingDelta = "";
      if (scrollRef.value) {
        scrollRef.value.scrollTop = scrollRef.value.scrollHeight;
      }
    };
    const scheduleDeltaFlush = () => {
      if (deltaFrame) {
        return;
      }

      deltaFrame = globalThis.requestAnimationFrame(() => {
        deltaFrame = 0;
        flushPendingDelta();
      });
    };
    const cancelDeltaFlush = () => {
      if (!deltaFrame) {
        return;
      }

      globalThis.cancelAnimationFrame(deltaFrame);
      deltaFrame = 0;
    };

    try {
      await streamChat(
        {
          conversationId: currentConversationId.value,
          mode: effectiveMode,
          model: requestedModel,
          message: query,
          turnstileToken,
          botId: selectedBotId.value,
        },
        {
          onDelta: (delta: string) => {
            pendingDelta += delta;
            scheduleDeltaFlush();
          },
          onDone: (payload: ChatStreamDone) => {
            cancelDeltaFlush();
            flushPendingDelta();
            currentConversationId.value = payload.conversationId;
            patchMessage(assistantIndex, {
              id: payload.messageId,
              streaming: false,
            });
          },
        },
      );

      cancelDeltaFlush();
      flushPendingDelta();
      patchMessage(assistantIndex, {
        streaming: false,
      });
      streaming.value = false;
      await refreshConversations();
      await refreshUsage();
    } catch (error) {
      if (isAuthFailure(error)) {
        authModalOpen.value = true;
        user.current = null;
        accountUsage.current = null;
      }
      cancelDeltaFlush();
      flushPendingDelta();
      patchMessage(assistantIndex, {
        streaming: false,
        content:
          error instanceof Error
            ? `Backend error: ${error.message}`
            : t(
                "Backend error: the stream ended unexpectedly.",
                language.value,
              ),
      });
      streaming.value = false;
    }
  });

  const config = activeModeById(activeMode.value);
  const currentModelOptions = getModelOptionsForMode(
    activeMode.value,
    language.value,
  );
  const selectedModelValue =
    selectedModels[activeMode.value] ?? AUTO_MODEL_VALUE;
  const modeQuota =
    accountUsage.current?.capabilities.find(
      (item) => item.key === capabilityForMode(activeMode.value),
    ) ?? null;
  const enabledProviders = appConfig.current.auth.providers.filter(
    (provider) => provider.enabled,
  );

  return (
    <main class="flex h-dvh overflow-hidden bg-[var(--bg-void)] text-[var(--text-bright)] font-sans">
      <div
        ref={turnstileRef}
        aria-hidden="true"
        class="absolute -left-[9999px] top-0 w-px h-px overflow-hidden"
      />
      <Sidebar
        activeMode={activeMode.value}
        conversations={conversations.list}
        activeConversationId={currentConversationId.value}
        language={language.value}
        onModeChange$={switchMode}
        onConversationSelect$={selectConversation}
        onConversationDelete$={removeConversation}
        onNewChat$={resetConversation}
      />

      <div class="flex-1 flex flex-col min-w-0 overflow-hidden">
        <header class="flex items-end justify-between gap-3 px-4 pb-3 border-b border-[var(--border-dim)] flex-shrink-0 min-h-[64px]">
          <div class="flex-1">
            <ModeHeader mode={activeMode.value} language={language.value} />
          </div>
          <div class="flex items-center gap-1 pb-1 relative">
            <div class="hidden lg:flex flex-col items-end mr-2">
              <span class="text-[.66rem] text-[var(--text-dim)] font-mono">
                {clock.value}
              </span>
              <span class="text-[.66rem] text-[var(--text-muted)] font-mono max-w-[280px] truncate">
                {t(
                  activeMode.value === "canvas" && canvasStatus.value
                    ? canvasStatus.value
                    : apiStatus.value,
                  language.value,
                )}
              </span>
            </div>

            {user.current && modeQuota && accountUsage.current && (
              <div class="hidden xl:flex items-center gap-2 mr-2">
                <div class="usage-pill">
                  <span>{quotaLabel(modeQuota.key, language.value)}</span>
                  <span class="usage-pill-strong">
                    {modeQuota.remaining}/{modeQuota.limit}
                  </span>
                </div>
                <div class="usage-pill muted">
                  <span>{t("Resets", language.value)}</span>
                  <span class="usage-pill-strong">
                    {formatResetTime(
                      accountUsage.current.resetsAt,
                      language.value,
                    )}
                  </span>
                </div>
              </div>
            )}

            <button
              class="topbar-btn lang"
              title={t(
                language.value === "tr"
                  ? "Switch to English"
                  : "Switch to Turkish",
                language.value,
              )}
              onClick$={toggleLanguage}
              type="button"
            >
              <span>{language.value === "tr" ? "EN" : "TR"}</span>
            </button>

            {activeMode.value === "chat" && bots.list.length > 0 && (
              <select
                class="hidden lg:block h-8 max-w-[180px] bg-[var(--bg-elevated)] border border-[var(--border-dim)] rounded-[3px] px-2 text-[.72rem] text-[var(--text-base)] outline-none"
                value={selectedBotId.value ?? ""}
                onChange$={selectBot}
                title={t("Chat with a saved bot persona", language.value)}
              >
                <option value="">{t("Base Shadow AI", language.value)}</option>
                {bots.list.map((bot) => (
                  <option key={bot.id} value={bot.id}>
                    {bot.name}
                  </option>
                ))}
              </select>
            )}

            {activeMode.value === "code" && (
              <button
                class="topbar-btn"
                title={t("Open in Canvas", language.value)}
                onClick$={openCanvasFromCode}
                type="button"
              >
                <span>{t("Open in Canvas", language.value)}</span>
              </button>
            )}

            {user.current ? (
              <div class="relative">
                <button
                  class="account-chip"
                  type="button"
                  onClick$={() => {
                    accountMenuOpen.value = !accountMenuOpen.value;
                  }}
                >
                  {user.current.avatarUrl && (
                    <img
                      class="w-5 h-5 rounded-full"
                      src={user.current.avatarUrl}
                      width={20}
                      height={20}
                      alt=""
                    />
                  )}
                  <div class="hidden sm:flex flex-col items-start min-w-0">
                    <span class="account-chip-name">
                      {user.current.name || user.current.email}
                    </span>
                    <span class="account-chip-meta">
                      {t("Free beta", language.value)}
                    </span>
                  </div>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M18 9l-6 6-6-6"
                      stroke="currentColor"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                </button>

                {accountMenuOpen.value && (
                  <div class="account-menu">
                    <div class="account-menu-section">
                      <div class="account-menu-title">
                        {t("Remaining today", language.value)}
                      </div>
                      <div class="account-menu-usage">
                        {(accountUsage.current?.capabilities ?? []).map(
                          (item) => (
                            <div key={item.key} class="account-menu-usage-row">
                              <span>
                                {quotaLabel(item.key, language.value)}
                              </span>
                              <strong>
                                {item.remaining}/{item.limit}
                              </strong>
                            </div>
                          ),
                        )}
                      </div>
                      {accountUsage.current && (
                        <p class="account-menu-note">
                          {t("Resets", language.value)}{" "}
                          {formatResetTime(
                            accountUsage.current.resetsAt,
                            language.value,
                          )}
                        </p>
                      )}
                    </div>

                    <div class="account-menu-section">
                      <button
                        class="account-menu-btn"
                        type="button"
                        onClick$={exportData}
                      >
                        {t("Export data", language.value)}
                      </button>
                      <a
                        class="account-menu-link"
                        href={appConfig.current.links.helpUrl}
                      >
                        {t("Help", language.value)}
                      </a>
                      <a
                        class="account-menu-link"
                        href={appConfig.current.links.privacyUrl}
                      >
                        {t("Privacy", language.value)}
                      </a>
                      <a
                        class="account-menu-link"
                        href={appConfig.current.links.termsUrl}
                      >
                        {t("Terms", language.value)}
                      </a>
                    </div>

                    <div class="account-menu-section">
                      <button
                        class="account-menu-btn danger"
                        type="button"
                        onClick$={removeAccount}
                      >
                        {t("Delete account", language.value)}
                      </button>
                      <button
                        class="account-menu-btn"
                        type="button"
                        onClick$={signOut}
                      >
                        {t("Sign out", language.value)}
                      </button>
                    </div>

                    {accountBusy.value && (
                      <p class="account-menu-note">
                        {t(accountBusy.value, language.value)}
                      </p>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                <button
                  class="topbar-btn"
                  title={t("Sign in", language.value)}
                  onClick$={() => openAuthModal("signin")}
                  type="button"
                >
                  <span>{t("Sign in", language.value)}</span>
                </button>
                <button
                  class="topbar-btn accent"
                  title={t("Create account", language.value)}
                  onClick$={() => openAuthModal("signup")}
                  type="button"
                >
                  <span>{t("Create account", language.value)}</span>
                </button>
              </>
            )}

            <button
              class="topbar-btn danger"
              title={t("Clear conversation", language.value)}
              onClick$={clearConversation}
              type="button"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none">
                <polyline
                  points="3 6 5 6 21 6"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M19 6l-1 14a2 2 0 01-2 2H8a2 2 0 01-2-2L5 6"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
                <path
                  d="M10 11v6M14 11v6M9 6V4a1 1 0 011-1h4a1 1 0 011 1v2"
                  stroke="currentColor"
                  stroke-width="1.5"
                  stroke-linecap="round"
                />
              </svg>
              <span>{t("Clear", language.value)}</span>
            </button>
          </div>
        </header>

        {activeMode.value === "code" && (
          <CodeToolbar language={language.value} />
        )}
        {activeMode.value === "email" && (
          <EmailControls language={language.value} />
        )}
        {activeMode.value === "seo" && (
          <SEOControls language={language.value} />
        )}
        {activeMode.value === "voice" && (
          <VoiceControls language={language.value} />
        )}
        {activeMode.value === "image" && (
          <ImageControls language={language.value} />
        )}
        {activeMode.value === "video" && (
          <VideoControls language={language.value} />
        )}

        {activeMode.value === "canvas" ? (
          <div class="flex-1 min-h-0 flex flex-col">
            <div class="canvas-shell-tabs lg:hidden px-4 py-2 border-b border-[var(--border-dim)]">
              {[
                ["chat", t("Chat", language.value)],
                ["code", t("Code", language.value)],
                ["preview", t("Preview", language.value)],
              ].map(([tab, label]) => (
                <button
                  key={tab}
                  class={`canvas-shell-tab ${canvasMobileTab.value === tab ? "active" : ""}`}
                  type="button"
                  onClick$={() => {
                    canvasMobileTab.value = tab as "chat" | "code" | "preview";
                  }}
                >
                  {label}
                </button>
              ))}
            </div>

            <div class="flex-1 min-h-0 flex flex-col lg:flex-row">
              <div
                class={`${canvasMobileTab.value === "chat" ? "flex" : "hidden lg:flex"} flex-col min-h-0 flex-[0.92] border-r border-[var(--border-dim)]`}
              >
                <div
                  class="flex-1 overflow-y-auto flex flex-col scroll-smooth"
                  ref={scrollRef}
                >
                  {messages.list.length === 0 ? (
                    <WelcomeScreen
                      mode={activeMode.value}
                      placeholder={modePlaceholder(
                        config.id,
                        config.placeholder,
                        language.value,
                      )}
                      language={language.value}
                      userName={user.current?.name}
                      onModeChange$={switchMode}
                    />
                  ) : (
                    <div class="py-5 px-6 flex flex-col gap-5 max-w-[860px] w-full mx-auto">
                      {messages.list.map((message, index) => (
                        <MessageBubble
                          key={message.id}
                          message={message}
                          index={index}
                          language={language.value}
                          onApplyCanvasArtifact$={applyCanvasArtifact}
                          onOpenInCanvas$={openMessageInCanvas}
                        />
                      ))}
                      {streaming.value &&
                        messages.list[messages.list.length - 1]?.role ===
                          "user" && (
                          <TypingIndicator language={language.value} />
                        )}
                    </div>
                  )}
                </div>

                <InputBar
                  currentMode={activeMode.value}
                  onModeChange$={switchMode}
                  onSubmit$={sendMessage}
                  onModelChange$={updateSelectedModel}
                  disabled={streaming.value}
                  language={language.value}
                  selectedModel={selectedModelValue}
                  modelOptions={currentModelOptions}
                  features={appConfig.current.features}
                />
              </div>

              <div
                class={`${canvasMobileTab.value === "chat" ? "hidden lg:flex" : "flex"} min-h-0 flex-[1.08]`}
              >
                <CanvasWorkbench
                  workspace={canvasWorkspace.value}
                  language={language.value}
                  status={t(
                    canvasStatus.value || "Canvas workspace ready.",
                    language.value,
                  )}
                  isGenerating={canvasBusy.value}
                  generationLabel={t(
                    canvasBusyLabel.value || "Canvas is generating...",
                    language.value,
                  )}
                  generationStep={canvasBusyStep.value}
                  generationTotal={CANVAS_PROGRESS_STEPS.length}
                  mobileTab={canvasMobileTab.value}
                  onWorkspaceChange$={updateCanvasWorkspace}
                  canUndoHistory={canvasHistory.snapshots.length > 0}
                  onUndo$={undoCanvasChange}
                  onReset$={resetCanvasWorkspace}
                  diffLines={canvasDiff.value}
                  onAcceptDiff$={acceptCanvasDiff}
                  onRevertDiff$={revertCanvasDiff}
                />
              </div>
            </div>
          </div>
        ) : (
          <>
            <div
              class="flex-1 overflow-y-auto flex flex-col scroll-smooth"
              ref={scrollRef}
            >
              {messages.list.length === 0 ? (
                <WelcomeScreen
                  mode={activeMode.value}
                  placeholder={modePlaceholder(
                    config.id,
                    config.placeholder,
                    language.value,
                  )}
                  language={language.value}
                />
              ) : (
                <div class="py-5 px-6 flex flex-col gap-5 max-w-[860px] w-full mx-auto">
                  {messages.list.map((message, index) => (
                    <MessageBubble
                      key={message.id}
                      message={message}
                      index={index}
                      language={language.value}
                      onApplyCanvasArtifact$={applyCanvasArtifact}
                      onOpenInCanvas$={openMessageInCanvas}
                    />
                  ))}
                  {streaming.value &&
                    messages.list[messages.list.length - 1]?.role ===
                      "user" && <TypingIndicator language={language.value} />}
                </div>
              )}
            </div>

            <InputBar
              currentMode={activeMode.value}
              onModeChange$={switchMode}
              onSubmit$={sendMessage}
              onModelChange$={updateSelectedModel}
              disabled={streaming.value}
              language={language.value}
              selectedModel={selectedModelValue}
              modelOptions={currentModelOptions}
              features={appConfig.current.features}
            />
          </>
        )}
      </div>

      {authModalOpen.value && (
        <div class="surface-overlay" role="dialog" aria-modal="true">
          <div class="surface-modal">
            <div class="surface-modal-glow" />

            <button
              class="surface-close"
              type="button"
              onClick$={() => {
                authModalOpen.value = false;
              }}
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <div class="surface-header">
              <p class="surface-eyebrow">
                {authIntent.value === "signup"
                  ? t("Create account", language.value)
                  : t("Sign in", language.value)}
              </p>
              <h2 class="surface-title">
                {t("Start your Shadow AI workspace.", language.value)}
              </h2>
              <p class="surface-copy">
                {t(
                  "Free beta access uses Google or GitHub sign-in. Your conversations, usage limits, and saved bots stay under one account.",
                  language.value,
                )}
              </p>
            </div>

            <div class="quota-bar">
              <div class="quota-stat">
                <div class="quota-stat-icon quota-stat-icon--chat">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div class="quota-stat-body">
                  <span class="quota-stat-value">
                    {appConfig.current.quotas.chatDaily}
                    <span class="quota-stat-per">/day</span>
                  </span>
                  <span class="quota-stat-label">
                    {quotaLabel("chat", language.value)}
                  </span>
                </div>
              </div>

              <div class="quota-stat-sep" />

              <div class="quota-stat">
                <div class="quota-stat-icon quota-stat-icon--mode">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
                  </svg>
                </div>
                <div class="quota-stat-body">
                  <span class="quota-stat-value">
                    {appConfig.current.quotas.modeDaily}
                    <span class="quota-stat-per">/day</span>
                  </span>
                  <span class="quota-stat-label">
                    {quotaLabel("mode", language.value)}
                  </span>
                </div>
              </div>

              <div class="quota-stat-sep" />

              <div class="quota-stat">
                <div class="quota-stat-icon quota-stat-icon--image">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div class="quota-stat-body">
                  <span class="quota-stat-value">
                    {appConfig.current.quotas.imageDaily}
                    <span class="quota-stat-per">/day</span>
                  </span>
                  <span class="quota-stat-label">
                    {quotaLabel("image", language.value)}
                  </span>
                </div>
              </div>

              <div class="quota-stat-sep" />

              <div class="quota-stat">
                <div class="quota-stat-icon quota-stat-icon--pdf">
                  <svg
                    width="15"
                    height="15"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <polyline points="14 2 14 8 20 8" />
                    <line x1="9" y1="13" x2="15" y2="13" />
                    <line x1="9" y1="17" x2="12" y2="17" />
                  </svg>
                </div>
                <div class="quota-stat-body">
                  <span class="quota-stat-value">
                    {appConfig.current.quotas.resumePdfDaily}
                    <span class="quota-stat-per">/day</span>
                  </span>
                  <span class="quota-stat-label">
                    {quotaLabel("resume_pdf", language.value)}
                  </span>
                </div>
              </div>
            </div>

            <div class="provider-stack">
              {enabledProviders.map((provider) => (
                <button
                  key={provider.id}
                  class={`provider-btn provider-btn--${provider.id}`}
                  type="button"
                  onClick$={() => signIn(provider.id)}
                >
                  {provider.id === "google" ? (
                    <svg
                      class="provider-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                    >
                      <path
                        fill="#4285F4"
                        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                      />
                      <path
                        fill="#34A853"
                        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                      />
                      <path
                        fill="#FBBC05"
                        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                      />
                      <path
                        fill="#EA4335"
                        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                      />
                    </svg>
                  ) : (
                    <svg
                      class="provider-icon"
                      width="18"
                      height="18"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                    >
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.44 9.8 8.21 11.39.6.11.79-.26.79-.58v-2.23c-3.34.73-4.03-1.42-4.03-1.42-.55-1.39-1.34-1.76-1.34-1.76-1.09-.74.08-.73.08-.73 1.2.08 1.84 1.24 1.84 1.24 1.07 1.83 2.81 1.3 3.49 1 .11-.78.42-1.31.76-1.61-2.67-.3-5.47-1.33-5.47-5.93 0-1.31.47-2.38 1.24-3.22-.12-.3-.54-1.52.12-3.18 0 0 1.01-.32 3.3 1.23a11.5 11.5 0 0 1 6.01 0c2.29-1.55 3.3-1.23 3.3-1.23.66 1.66.24 2.88.12 3.18.77.84 1.23 1.91 1.23 3.22 0 4.61-2.81 5.63-5.48 5.92.43.37.82 1.1.82 2.22v3.29c0 .32.19.69.8.58C20.57 21.8 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                  )}
                  <span>
                    {provider.id === "google"
                      ? t("Continue with Google", language.value)
                      : t("Continue with GitHub", language.value)}
                  </span>
                </button>
              ))}
            </div>

            <p class="surface-note">
              {t("By continuing, you agree to the", language.value)}{" "}
              <a href={appConfig.current.links.termsUrl}>
                {t("Terms", language.value)}
              </a>{" "}
              {t("and", language.value)}{" "}
              <a href={appConfig.current.links.privacyUrl}>
                {t("Privacy", language.value)}
              </a>
              .
            </p>
          </div>
        </div>
      )}

      {onboardingOpen.value && user.current && (
        <div class="surface-overlay" role="dialog" aria-modal="true">
          <div class="surface-modal surface-modal--onboarding">
            <div class="surface-modal-glow" />

            <button
              class="surface-close"
              type="button"
              onClick$={closeOnboarding}
              aria-label="Close"
            >
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  d="M18 6L6 18M6 6l12 12"
                  stroke="currentColor"
                  stroke-width="2"
                  stroke-linecap="round"
                />
              </svg>
            </button>

            <div class="surface-header">
              <p class="surface-eyebrow">{t("Welcome", language.value)}</p>
              <h2 class="surface-title">
                {t("Your free beta workspace is ready.", language.value)}
              </h2>
              <p class="surface-copy">
                {t(
                  "Pick a starting lane now. You can switch modes any time from the command bar.",
                  language.value,
                )}
              </p>
            </div>

            <div class="provider-stack starter-stack">
              <button
                class="starter-option starter-option--chat"
                type="button"
                onClick$={async () => {
                  await switchMode("chat");
                  await closeOnboarding();
                }}
              >
                <div class="starter-option-icon starter-option-icon--chat">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
                  </svg>
                </div>
                <div class="starter-option-body">
                  <span class="starter-label">{t("Chat", language.value)}</span>
                  <strong>
                    {t("General help and daily work", language.value)}
                  </strong>
                </div>
                <span class="starter-option-arrow">→</span>
              </button>
              <button
                class="starter-option starter-option--canvas"
                type="button"
                onClick$={async () => {
                  await switchMode("canvas");
                  await closeOnboarding();
                }}
              >
                <div class="starter-option-icon starter-option-icon--canvas">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M8 8h8M8 12h8M8 16h5" />
                  </svg>
                </div>
                <div class="starter-option-body">
                  <span class="starter-label">
                    {t("Canvas beta", language.value)}
                  </span>
                  <strong>
                    {t("Live frontend preview and iteration", language.value)}
                  </strong>
                </div>
                <span class="starter-option-arrow">→</span>
              </button>
              <button
                class="starter-option starter-option--image"
                type="button"
                onClick$={async () => {
                  await switchMode("image");
                  await closeOnboarding();
                }}
              >
                <div class="starter-option-icon starter-option-icon--image">
                  <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <circle cx="8.5" cy="8.5" r="1.5" />
                    <polyline points="21 15 16 10 5 21" />
                  </svg>
                </div>
                <div class="starter-option-body">
                  <span class="starter-label">
                    {t("Image", language.value)}
                  </span>
                  <strong>
                    {t("Generate visuals with daily limits", language.value)}
                  </strong>
                </div>
                <span class="starter-option-arrow">→</span>
              </button>
            </div>

            <div class="surface-footer">
              <button
                class="topbar-btn accent"
                type="button"
                onClick$={closeOnboarding}
              >
                {t("Continue to workspace", language.value)}
              </button>
            </div>
          </div>
        </div>
      )}

      <style
        dangerouslySetInnerHTML={`
        .topbar-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          padding: 5px 10px;
          border-radius: var(--r-sm);
          border: 1px solid var(--border-dim);
          background: none;
          color: var(--text-muted);
          cursor: pointer;
          font-size: .72rem;
          font-family: var(--font-body);
          transition: all var(--t-fast);
        }
        .topbar-btn:hover {
          background: var(--bg-hover);
          border-color: var(--border-mid);
          color: var(--text-base);
        }
        .topbar-btn.accent {
          color: #08090d;
          background: var(--accent-pri);
          border-color: color-mix(in srgb, var(--accent-pri) 60%, transparent);
        }
        .topbar-btn.accent:hover {
          color: #08090d;
          background: #7aa2ff;
        }
        .topbar-btn.lang {
          font-family: var(--font-mono);
          font-weight: 700;
          letter-spacing: .06em;
        }
        .topbar-btn.danger:hover {
          color: #f87171;
          border-color: rgba(248, 113, 113, .3);
          background: rgba(248, 113, 113, .08);
        }
        .canvas-shell-tabs {
          display: flex;
          gap: 8px;
        }
        .canvas-shell-tab {
          min-height: 30px;
          padding: 0 12px;
          border-radius: var(--r-sm);
          border: 1px solid var(--border-mid);
          background: rgba(8, 9, 13, .42);
          color: var(--text-muted);
          font-size: .72rem;
          cursor: pointer;
        }
        .canvas-shell-tab.active {
          border-color: rgba(56, 189, 248, .35);
          color: #38bdf8;
          background: rgba(56, 189, 248, .08);
        }
        .usage-pill {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          min-height: 30px;
          padding: 0 10px;
          border-radius: 999px;
          border: 1px solid var(--border-dim);
          background: var(--bg-elevated);
          color: var(--text-muted);
          font-size: .68rem;
          font-family: var(--font-mono);
        }
        .usage-pill.muted {
          background: transparent;
        }
        .usage-pill-strong {
          color: var(--text-base);
        }
        .account-chip {
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 32px;
          padding: 4px 10px;
          border-radius: 6px;
          border: 1px solid var(--border-dim);
          background: var(--bg-elevated);
          color: var(--text-base);
          cursor: pointer;
        }
        .account-chip-name {
          max-width: 150px;
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
          font-size: .72rem;
        }
        .account-chip-meta {
          font-size: .62rem;
          color: var(--text-dim);
          font-family: var(--font-mono);
        }
        .account-menu {
          position: absolute;
          right: 0;
          top: calc(100% + 8px);
          width: 260px;
          border-radius: 10px;
          border: 1px solid var(--border-mid);
          background: rgba(10, 12, 18, .96);
          box-shadow: var(--shadow-lg);
          padding: 12px;
          display: flex;
          flex-direction: column;
          gap: 12px;
          z-index: 40;
        }
        .account-menu-section {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .account-menu-title {
          font-size: .68rem;
          color: var(--text-dim);
          text-transform: uppercase;
          letter-spacing: .12em;
          font-family: var(--font-mono);
        }
        .account-menu-usage {
          display: grid;
          gap: 6px;
        }
        .account-menu-usage-row {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          font-size: .76rem;
          color: var(--text-base);
        }
        .account-menu-link,
        .account-menu-btn {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 34px;
          padding: 0 10px;
          border-radius: 6px;
          border: 1px solid var(--border-dim);
          background: transparent;
          color: var(--text-base);
          cursor: pointer;
          font-size: .76rem;
          text-decoration: none;
        }
        .account-menu-btn.danger {
          color: #fca5a5;
          border-color: rgba(248, 113, 113, .22);
        }
        .account-menu-note {
          font-size: .68rem;
          color: var(--text-dim);
          margin: 0;
        }
        .surface-overlay {
          position: fixed;
          inset: 0;
          background: rgba(3, 5, 10, .78);
          backdrop-filter: blur(16px);
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          z-index: 80;
          animation: overlay-in 180ms ease;
        }
        @keyframes overlay-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        .surface-modal {
          position: relative;
          width: min(480px, 100%);
          border-radius: 20px;
          border: 1px solid rgba(255,255,255,.08);
          background: linear-gradient(160deg, rgba(16,20,32,.98) 0%, rgba(9,11,18,.98) 100%);
          box-shadow: 0 24px 64px rgba(0,0,0,.6), 0 0 0 1px rgba(255,255,255,.04) inset;
          padding: 28px 24px 24px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          animation: modal-in 220ms cubic-bezier(.16,1,.3,1);
          overflow: hidden;
        }
        @keyframes modal-in {
          from { opacity: 0; transform: translateY(12px) scale(.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        .surface-modal-glow {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg, transparent, var(--accent-pri), transparent);
          opacity: .7;
          pointer-events: none;
        }
        .surface-close {
          position: absolute;
          top: 16px;
          right: 16px;
          width: 28px;
          height: 28px;
          border-radius: 999px;
          border: 1px solid rgba(255,255,255,.08);
          background: rgba(255,255,255,.04);
          color: var(--text-dim);
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: background 150ms, color 150ms, border-color 150ms;
        }
        .surface-close:hover {
          background: rgba(255,255,255,.1);
          color: var(--text-bright);
          border-color: rgba(255,255,255,.16);
        }
        .surface-header {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .surface-eyebrow {
          margin: 0;
          font-size: .64rem;
          text-transform: uppercase;
          letter-spacing: .18em;
          color: var(--accent-pri);
          font-family: var(--font-mono);
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .surface-eyebrow::before {
          content: '';
          display: block;
          width: 5px;
          height: 5px;
          border-radius: 999px;
          background: var(--accent-pri);
          flex-shrink: 0;
        }
        .surface-title {
          margin: 0;
          font-size: clamp(1.45rem, 4vw, 1.85rem);
          line-height: 1.1;
          letter-spacing: -.02em;
        }
        .surface-copy {
          margin: 0;
          color: var(--text-muted);
          line-height: 1.65;
          font-size: .84rem;
        }
        .surface-note {
          margin: 0;
          color: var(--text-muted);
          line-height: 1.7;
          font-size: .78rem;
          text-align: center;
        }
        .surface-note a {
          color: var(--text-dim);
          text-decoration: underline;
          text-underline-offset: 2px;
        }
        .starter-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }
        .starter-stack {
          gap: 12px;
        }
        .quota-bar {
          display: flex;
          align-items: center;
          background: rgba(255,255,255,.03);
          border: 1px solid rgba(255,255,255,.07);
          border-radius: 16px;
          padding: 16px 6px;
          gap: 0;
        }
        .quota-stat {
          flex: 1;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          padding: 0 4px;
        }
        .quota-stat-sep {
          width: 1px;
          height: 38px;
          background: rgba(255,255,255,.07);
          flex-shrink: 0;
        }
        .quota-stat-icon {
          width: 34px;
          height: 34px;
          border-radius: 9px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .quota-stat-icon--chat  { background: rgba(56,189,248,.12);  color: #38bdf8; }
        .quota-stat-icon--mode  { background: rgba(167,139,250,.12); color: #a78bfa; }
        .quota-stat-icon--image { background: rgba(52,211,153,.12);  color: #34d399; }
        .quota-stat-icon--pdf   { background: rgba(251,146,60,.12);  color: #fb923c; }
        .quota-stat-body {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }
        .quota-stat-value {
          font-size: 1.2rem;
          font-weight: 700;
          color: var(--text-bright);
          letter-spacing: -.02em;
          line-height: 1;
        }
        .quota-stat-per {
          font-size: .6rem;
          font-weight: 500;
          color: var(--text-dim);
          letter-spacing: 0;
          margin-left: 1px;
        }
        .quota-stat-label {
          font-size: .58rem;
          font-family: var(--font-mono);
          text-transform: uppercase;
          letter-spacing: .13em;
          color: var(--text-dim);
        }
        .starter-label {
          font-size: .62rem;
          text-transform: uppercase;
          letter-spacing: .14em;
          color: var(--text-dim);
          font-family: var(--font-mono);
        }
        .starter-option {
          min-height: 72px;
          border-radius: 14px;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.04);
          color: var(--text-bright);
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 14px 16px;
          text-align: left;
          transition: background 150ms, border-color 150ms, transform 80ms, box-shadow 150ms;
        }
        .starter-option:hover {
          background: rgba(255,255,255,.08);
          border-color: rgba(255,255,255,.16);
          box-shadow: 0 14px 30px rgba(0,0,0,.26);
        }
        .starter-option:active {
          transform: scale(.99);
        }
        .starter-option-icon {
          width: 38px;
          height: 38px;
          border-radius: 10px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .starter-option-icon--chat {
          color: #38bdf8;
          background: rgba(56,189,248,.12);
          border: 1px solid rgba(56,189,248,.18);
        }
        .starter-option-icon--canvas {
          color: #a78bfa;
          background: rgba(167,139,250,.12);
          border: 1px solid rgba(167,139,250,.18);
        }
        .starter-option-icon--image {
          color: #34d399;
          background: rgba(52,211,153,.12);
          border: 1px solid rgba(52,211,153,.18);
        }
        .starter-option-body {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }
        .starter-option-body strong {
          color: var(--text-bright);
          line-height: 1.32;
          letter-spacing: -.01em;
        }
        .starter-option-arrow {
          margin-left: auto;
          color: var(--text-dim);
          font-size: 1rem;
          flex-shrink: 0;
        }
        .starter-card {
          display: flex;
          flex-direction: column;
          gap: 6px;
          min-height: 92px;
          padding: 14px;
          border-radius: 12px;
          border: 1px solid var(--border-mid);
          background: rgba(255, 255, 255, .02);
          text-align: left;
        }
        .starter-card strong {
          color: var(--text-bright);
          line-height: 1.35;
        }
        .provider-stack,
        .surface-footer {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .provider-btn {
          min-height: 46px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,.1);
          background: rgba(255,255,255,.06);
          color: var(--text-bright);
          cursor: pointer;
          font-size: .84rem;
          font-weight: 600;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          transition: background 150ms, border-color 150ms, transform 80ms;
          letter-spacing: -.01em;
        }
        .provider-btn:hover {
          background: rgba(255,255,255,.1);
          border-color: rgba(255,255,255,.16);
        }
        .provider-btn:active {
          transform: scale(.98);
        }
        .provider-btn--google {
          background: rgba(255,255,255,.92);
          border-color: rgba(255,255,255,.92);
          color: #1a1a1a;
        }
        .provider-btn--google:hover {
          background: #fff;
          border-color: #fff;
        }
        .provider-btn--github {
          background: rgba(36,41,50,.9);
          border-color: rgba(255,255,255,.12);
          color: #fff;
        }
        .provider-btn--github:hover {
          background: rgba(50,58,70,.95);
          border-color: rgba(255,255,255,.2);
        }
        .provider-icon {
          flex-shrink: 0;
        }
        @media (max-width: 480px) {
          .quota-bar {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 0;
            padding: 8px 4px;
          }
          .quota-stat-sep {
            display: none;
          }
          .quota-stat {
            padding: 10px 8px;
          }
          .starter-grid {
            grid-template-columns: 1fr;
          }
        }
      `}
      />
    </main>
  );
});
