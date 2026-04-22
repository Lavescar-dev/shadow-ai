import type { ModeArtifact } from "../../shared/mode-contracts";
export type {
  BotSummary,
  CanvasArtifactData,
  CanvasTemplate,
  CanvasWorkspaceData,
  ModeArtifact,
  ResumeTemplate,
  ShellMode,
} from "../../shared/mode-contracts";

import type { ShellMode } from "../../shared/mode-contracts";

export interface ModeConfig {
  id: ShellMode;
  label: string;
  command: string;
  icon: string;
  description: string;
  color: string;
  placeholder: string;
}

const icon = (paths: string) =>
  `<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

export const MODES: ModeConfig[] = [
  {
    id: "chat",
    label: "Chat AI",
    command: "/chat",
    icon: icon('<path d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h14a2 2 0 012 2z"/>'),
    description: "Streaming assistant conversation",
    color: "#6366f1",
    placeholder: "Ask me anything…",
  },
  {
    id: "content",
    label: "Content Generator",
    command: "/content",
    icon: icon('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><line x1="10" y1="9" x2="8" y2="9"/>'),
    description: "Structured content with streamed output",
    color: "#22d3ee",
    placeholder: "Describe the content you need…",
  },
  {
    id: "code",
    label: "Code Generator",
    command: "/code",
    icon: icon('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'),
    description: "Developer-focused code generation",
    color: "#34d399",
    placeholder: "Describe what to build…",
  },
  {
    id: "canvas",
    label: "Canvas",
    command: "/canvas",
    icon: icon('<rect x="3" y="3" width="18" height="18" rx="2"/><path d="M8 7h8M8 12h5M8 17h3"/><path d="M15 14l2 2 4-4"/>'),
    description: "Live frontend canvas with editor and preview",
    color: "#38bdf8",
    placeholder: "Describe the UI you want to build…",
  },
  {
    id: "email",
    label: "Email Generator",
    command: "/email",
    icon: icon('<path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/>'),
    description: "Compact email drafting with preview",
    color: "#f472b6",
    placeholder: "What's the email about?",
  },
  {
    id: "video",
    label: "Video Script",
    command: "/video",
    icon: icon('<circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/>'),
    description: "Script generation for video content",
    color: "#fb923c",
    placeholder: "Video topic & target audience…",
  },
  {
    id: "seo",
    label: "SEO Analyzer",
    command: "/seo",
    icon: icon('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/><polyline points="8 11 10 13 14 9"/>'),
    description: "Structured SEO audit results",
    color: "#a78bfa",
    placeholder: "Enter URL or content to analyze…",
  },
  {
    id: "image",
    label: "Image Generator",
    command: "/image",
    icon: icon('<rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>'),
    description: "Prompt input with visual preview",
    color: "#f59e0b",
    placeholder: "Describe the image you want…",
  },
  {
    id: "voice",
    label: "Text-to-Speech",
    command: "/voice",
    icon: icon('<path d="M12 1a3 3 0 00-3 3v8a3 3 0 006 0V4a3 3 0 00-3-3z"/><path d="M19 10v2a7 7 0 01-14 0v-2"/><line x1="12" y1="19" x2="12" y2="23"/><line x1="8" y1="23" x2="16" y2="23"/>'),
    description: "Speech synthesis with audio preview",
    color: "#ec4899",
    placeholder: "Enter text to convert to speech…",
  },
  {
    id: "resume",
    label: "Resume Builder",
    command: "/resume",
    icon: icon('<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>'),
    description: "Profile-driven resume generation",
    color: "#14b8a6",
    placeholder: "Describe your background & target role…",
  },
  {
    id: "bot",
    label: "Bot Builder",
    command: "/bot",
    icon: icon('<rect x="4" y="4" width="16" height="16" rx="2"/><rect x="9" y="9" width="2" height="2"/><rect x="13" y="9" width="2" height="2"/><path d="M9 14s.5 1 3 1 3-1 3-1"/><line x1="12" y1="4" x2="12" y2="2"/>'),
    description: "Persona setup & live bot chat",
    color: "#8b5cf6",
    placeholder: "Define your bot's persona…",
  },
];

export interface Message {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  mode: ShellMode;
  timestamp: number;
  streaming?: boolean;
  metadata?: {
    artifact?: ModeArtifact;
    artifactId?: string;
    botId?: string;
  } & Record<string, unknown>;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  avatarUrl?: string;
}

export interface UserSettings {
  preferredLanguage: "en" | "tr";
  onboardingCompleted: boolean;
}

export type UsageCapability = "chat" | "mode" | "image" | "resume_pdf";

export interface UsageQuota {
  key: UsageCapability;
  limit: number;
  used: number;
  remaining: number;
}

export interface AccountUsage {
  dayKey: string;
  resetsAt: number;
  capabilities: UsageQuota[];
}

export interface AppConfig {
  product: {
    name: string;
    tier: string;
    signInRequired: boolean;
    canvasBeta: boolean;
  };
  auth: {
    providers: Array<{
      id: "google" | "github";
      enabled: boolean;
    }>;
  };
  turnstile: {
    enabled: boolean;
    siteKey?: string;
  };
  quotas: {
    chatDaily: number;
    modeDaily: number;
    imageDaily: number;
    resumePdfDaily: number;
  };
  features: {
    attachments: boolean;
    screenshot: boolean;
    connectors: boolean;
    voiceInput: boolean;
    memoryToggle: boolean;
    canvasBeta: boolean;
  };
  links: {
    privacyUrl: string;
    termsUrl: string;
    helpUrl: string;
    supportEmail: string;
    supportMailto: string;
  };
}

export interface ConversationSummary {
  id: string;
  title: string;
  mode: ShellMode;
  model?: string;
  updatedAt: number;
}

export interface AttachmentItem {
  id: string;
  label: string;
  icon: string;
  action: string;
  children?: AttachmentItem[];
}

const aicon = (paths: string) =>
  `<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">${paths}</svg>`;

export const ATTACHMENT_MENU: AttachmentItem[] = [
  {
    id: "files",
    label: "Add files or photos",
    icon: aicon('<path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48"/>'),
    action: "file",
    children: [
      { id: "file-doc", label: "Documents (.pdf, .docx, .txt)", icon: aicon('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>'), action: "file-doc" },
      { id: "file-image", label: "Images (.png, .jpg, .webp)", icon: aicon('<rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/>'), action: "file-image" },
      { id: "file-code", label: "Code files (.js, .py, .ts…)", icon: aicon('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'), action: "file-code" },
      { id: "file-data", label: "Data (.csv, .json, .xlsx)", icon: aicon('<rect x="3" y="3" width="18" height="18" rx="1"/><path d="M3 9h18M3 15h18M9 3v18"/>'), action: "file-data" },
    ],
  },
  {
    id: "screenshot",
    label: "Take a screenshot",
    icon: aicon('<path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/><circle cx="12" cy="13" r="4"/>'),
    action: "screenshot",
  },
  {
    id: "project",
    label: "Add to project",
    icon: aicon('<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/>'),
    action: "project",
    children: [
      { id: "proj-new", label: "New project", icon: aicon('<path d="M22 19a2 2 0 01-2 2H4a2 2 0 01-2-2V5a2 2 0 012-2h5l2 3h9a2 2 0 012 2z"/><line x1="12" y1="11" x2="12" y2="17"/><line x1="9" y1="14" x2="15" y2="14"/>'), action: "project-new" },
      { id: "proj-recent", label: "Recent projects", icon: aicon('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>'), action: "project-recent" },
      { id: "proj-import", label: "Import from URL", icon: aicon('<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>'), action: "project-import" },
    ],
  },
  {
    id: "github",
    label: "Add from GitHub",
    icon: aicon('<path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 00-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0020 4.77 5.07 5.07 0 0019.91 1S18.73.65 16 2.48a13.38 13.38 0 00-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 005 4.77a5.44 5.44 0 00-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 009 18.13V22"/>'),
    action: "github",
    children: [
      { id: "gh-repo", label: "Link repository", icon: aicon('<path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>'), action: "github-repo" },
      { id: "gh-file", label: "Import file", icon: aicon('<path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/><polyline points="14 2 14 8 20 8"/>'), action: "github-file" },
      { id: "gh-gist", label: "Paste Gist URL", icon: aicon('<path d="M10 13a5 5 0 007.54.54l3-3a5 5 0 00-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 00-7.54-.54l-3 3a5 5 0 007.07 7.07l1.71-1.71"/>'), action: "github-gist" },
    ],
  },
  {
    id: "skills",
    label: "Skills",
    icon: aicon('<polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>'),
    action: "skills",
    children: [
      { id: "skill-web", label: "Web Search", icon: aicon('<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>'), action: "skill-web" },
      { id: "skill-code", label: "Code Execution", icon: aicon('<polyline points="16 18 22 12 16 6"/><polyline points="8 6 2 12 8 18"/>'), action: "skill-code" },
      { id: "skill-calc", label: "Calculator", icon: aicon('<rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="8" y1="10" x2="16" y2="10"/><line x1="8" y1="14" x2="12" y2="14"/>'), action: "skill-calc" },
      { id: "skill-chart", label: "Chart Maker", icon: aicon('<line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/>'), action: "skill-chart" },
    ],
  },
  {
    id: "connectors",
    label: "Add connectors",
    icon: aicon('<path d="M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>'),
    action: "connectors",
    children: [
      { id: "conn-notion", label: "Notion", icon: aicon('<path d="M4 4h16v16H4z"/><path d="M8 8h3l5 8"/><path d="M8 16V8"/>'), action: "conn-notion" },
      { id: "conn-slack", label: "Slack", icon: aicon('<path d="M14.5 10c-.83 0-1.5-.67-1.5-1.5v-5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5z"/><path d="M20.5 10H19V8.5c0-.83.67-1.5 1.5-1.5s1.5.67 1.5 1.5-.67 1.5-1.5 1.5z"/><path d="M9.5 14c.83 0 1.5.67 1.5 1.5v5c0 .83-.67 1.5-1.5 1.5S8 21.33 8 20.5v-5c0-.83.67-1.5 1.5-1.5z"/><path d="M3.5 14H5v1.5c0 .83-.67 1.5-1.5 1.5S2 16.33 2 15.5 2.67 14 3.5 14z"/><path d="M14 14.5c0-.83.67-1.5 1.5-1.5h5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-5c-.83 0-1.5-.67-1.5-1.5z"/><path d="M15.5 19H14v1.5c0 .83.67 1.5 1.5 1.5s1.5-.67 1.5-1.5-.67-1.5-1.5-1.5z"/><path d="M10 9.5C10 8.67 9.33 8 8.5 8h-5C2.67 8 2 8.67 2 9.5S2.67 11 3.5 11h5c.83 0 1.5-.67 1.5-1.5z"/><path d="M8.5 5H10V3.5C10 2.67 9.33 2 8.5 2S7 2.67 7 3.5 7.67 5 8.5 5z"/>'), action: "conn-slack" },
      { id: "conn-drive", label: "Google Drive", icon: aicon('<path d="M22 20l-7-12H9L2 20h20z"/><path d="M2 20l5-8h10l5 8"/><line x1="9" y1="8" x2="15" y2="8"/>'), action: "conn-drive" },
      { id: "conn-jira", label: "Jira", icon: aicon('<path d="M12 2L2 12l4 4 6-6 6 6 4-4L12 2z"/><path d="M12 22l-4-4 4-4 4 4-4 4z"/>'), action: "conn-jira" },
      { id: "conn-linear", label: "Linear", icon: aicon('<circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 014 10 15.3 15.3 0 01-4 10 15.3 15.3 0 01-4-10 15.3 15.3 0 014-10z"/>'), action: "conn-linear" },
    ],
  },
];
