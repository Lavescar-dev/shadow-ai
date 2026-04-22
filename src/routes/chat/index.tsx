import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import { ChatShell } from "~/components/chat-shell/chat-shell";

export default component$(() => {
  return <ChatShell />;
});

export const head: DocumentHead = {
  title: "Shadow AI Workspace",
  meta: [
    {
      name: "description",
      content:
        "AI Shell — Chat, Code, Content, Email, Video, SEO, Images, Voice, Resume, and Bot builder modes in one bilingual Shadow AI workspace.",
    },
    { name: "theme-color", content: "#080810" },
  ],
};
