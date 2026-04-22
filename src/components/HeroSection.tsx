import { component$ } from "@builder.io/qwik";

export const HeroSection = component$(() => {
  return (
    <div class="relative w-full min-h-[440px] flex items-center">
      <div class="w-full lg:w-[65%] z-10 pr-10">
        <h2 class="text-[22px] font-bold mb-[12px] tracking-tight text-[#00d26a]">
          Shadow AI › Workspace
        </h2>
        <h1 class="text-[72px] font-[800] leading-[1.08] mb-[24px] tracking-[-0.03em] text-white">
          Compact launcher for
          <br />
          the local AI demos
        </h1>
        <p class="text-[30px] text-[#e5e5e5] mb-[40px] font-normal tracking-tight leading-snug">
          This page now follows the same shell language as the tool views
          instead of reading like a marketing landing page.
        </p>
        <div class="flex gap-6 mt-[20px]">
          <div class="border-l-2 border-[#7d52fa] pl-4">
            <h4 class="text-white font-bold text-[16px]">Runtime</h4>
            <p class="text-[#8e8e99] text-[14px]">
              Routes stay self-contained, local-first, and ready for product
              walkthroughs.
            </p>
          </div>
          <div class="border-l-2 border-[#00d26a] pl-4">
            <h4 class="text-white font-bold text-[16px]">Layout</h4>
            <p class="text-[#8e8e99] text-[14px]">
              Sidebar shell, simple topbar, mono metadata, and direct route
              access.
            </p>
          </div>
        </div>
      </div>

      <div class="mesh-container hidden lg:block">
        <div class="swirl-base"></div>
        <div class="swirl-green"></div>
        <div class="swirl-green-core"></div>
        <div class="swirl-cyan"></div>

        <div class="absolute top-[48%] left-[62%] -translate-x-1/2 -translate-y-1/2 z-10 ai-logo-box w-[104px] h-[104px]">
          <div class="relative flex items-center justify-center w-full h-full">
            <span class="text-white font-bold text-[48px] leading-none tracking-tighter">
              AI
            </span>
            <div class="absolute bottom-[23px] right-[24px] w-[20px] h-[4px] bg-[#00d26a]"></div>
          </div>
        </div>
      </div>
    </div>
  );
});
