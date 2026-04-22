import { component$ } from "@builder.io/qwik";
import { QwikCityProvider, RouterOutlet } from "@builder.io/qwik-city";

import { RouterHead } from "./components/router-head/router-head";
import "./global.css";

const DEV_GLOBAL_STYLESHEET = import.meta.env.DEV
  ? "/src/global.css?direct"
  : null;

export default component$(() => {
  return (
    <QwikCityProvider>
      <head>
        <RouterHead />
        {DEV_GLOBAL_STYLESHEET && (
          <link rel="stylesheet" href={DEV_GLOBAL_STYLESHEET} />
        )}
      </head>
      <body class="min-h-screen flex flex-col font-sans relative overflow-x-hidden antialiased bg-black text-white">
        <RouterOutlet />
      </body>
    </QwikCityProvider>
  );
});
