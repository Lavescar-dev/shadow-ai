import { component$ } from "@builder.io/qwik";

interface ToolCardProps {
  title: string;
  description: string;
  route: string;
  colorClass: string;
  colorBg: string;
}

export const ToolCard = component$<ToolCardProps>((props) => {
  return (
    <a
      href={props.route}
      class="block bg-[#090612] border border-[#1f1738] rounded-[12px] p-[28px] hover:border-[#382b66] transition-colors cursor-pointer flex flex-col justify-between"
    >
      <div class="flex justify-between items-start mb-[16px]">
        <h3 class="text-[26px] font-bold tracking-tight text-white leading-none">
          {props.title}
        </h3>
        <span
          class={`px-[8px] py-[4px] rounded text-[12px] font-mono font-medium ${props.colorBg} ${props.colorClass}`}
        >
          {props.route}
        </span>
      </div>
      <p class="text-[#8e8e99] text-[15px] font-normal tracking-tight">
        {props.description}
      </p>
    </a>
  );
});
