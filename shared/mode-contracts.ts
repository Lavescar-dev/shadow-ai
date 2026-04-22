export type ShellMode =
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

export type ResumeTemplate = "ats-professional" | "modern-visual";
export type CanvasTemplate = "react" | "html";

export interface ArtifactSection {
  heading: string;
  body?: string;
  items?: string[];
  code?: string;
  priority?: "low" | "medium" | "high";
  score?: number;
}

export interface ResumeExperience {
  role: string;
  company: string;
  location?: string;
  period: string;
  bullets: string[];
}

export interface ResumeEducation {
  school: string;
  degree: string;
  period?: string;
  details?: string[];
}

export interface ResumeProject {
  name: string;
  description: string;
  bullets?: string[];
  link?: string;
}

export interface ResumeArtifactData {
  fullName: string;
  headline: string;
  contact: {
    email?: string;
    phone?: string;
    location?: string;
    website?: string;
    linkedin?: string;
    github?: string;
  };
  summary: string;
  skills: string[];
  experience: ResumeExperience[];
  education: ResumeEducation[];
  projects?: ResumeProject[];
  languages?: string[];
}

export interface BotArtifactData {
  name: string;
  description: string;
  systemPrompt: string;
  tone: string;
  boundaries: string[];
  starterPrompts: string[];
  memoryPolicy: string;
  tools: string[];
}

export interface CanvasChange {
  path: string;
  operation: "upsert" | "delete";
  content?: string;
}

export interface CanvasArtifactData {
  template: CanvasTemplate;
  changes: CanvasChange[];
  changedFiles: string[];
  previewNotes?: string[];
}

export interface CanvasWorkspaceData {
  template: CanvasTemplate;
  files: Record<string, string>;
  activeFile: string;
  updatedAt?: number;
}

export interface GeneratedImageArtifact {
  dataUrl: string;
  mimeType?: string;
  alt?: string;
  prompt?: string;
  width?: number;
  height?: number;
}

export interface ModeArtifact {
  mode: ShellMode;
  title: string;
  summary: string;
  sections: ArtifactSection[];
  actions?: string[];
  canvas?: CanvasArtifactData;
  images?: GeneratedImageArtifact[];
  resume?: ResumeArtifactData;
  bot?: BotArtifactData;
  metadata?: Record<string, string | number | boolean | string[]>;
}

export interface BotSummary {
  id: string;
  name: string;
  description: string;
  tone: string;
  starterPrompts: string[];
  createdAt: number;
  updatedAt: number;
}

export const ARTIFACT_SCHEMA_DESCRIPTION = `Return only valid JSON matching:
{
  "mode": "chat|content|code|canvas|email|video|seo|image|voice|resume|bot",
  "title": "short artifact title",
  "summary": "1-3 sentence result summary",
  "sections": [{"heading":"string","body":"string optional","items":["string"],"code":"string optional","priority":"low|medium|high optional","score": number optional}],
  "actions": ["optional next actions"],
  "canvas": { "template":"react|html", "changes":[{"path":"App.tsx","operation":"upsert|delete","content":"file contents optional"}], "changedFiles":["App.tsx"], "previewNotes":["optional note"] },
  "images": [{"dataUrl":"data:image/png;base64,...","mimeType":"image/png optional","alt":"string optional","prompt":"string optional","width": 1024,"height": 1024}],
  "resume": { "fullName":"", "headline":"", "contact":{}, "summary":"", "skills":[], "experience":[], "education":[], "projects":[], "languages":[] },
  "bot": { "name":"", "description":"", "systemPrompt":"", "tone":"", "boundaries":[], "starterPrompts":[], "memoryPolicy":"", "tools":[] },
  "metadata": {}
}`;
