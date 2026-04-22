interface TurnstileApi {
  render(
    container: HTMLElement,
    options: Record<string, unknown>,
  ): string | number;
  execute(widgetId: string | number): void;
  remove?(widgetId: string | number): void;
}

declare global {
  interface Window {
    turnstile?: TurnstileApi;
    __shadowTurnstileLoader?: Promise<void>;
  }
}

async function loadTurnstileScript() {
  if (typeof window === "undefined") {
    throw new Error("Turnstile is only available in the browser.");
  }

  if (window.turnstile) {
    return;
  }

  if (!window.__shadowTurnstileLoader) {
    window.__shadowTurnstileLoader = new Promise<void>((resolve, reject) => {
      const script = document.createElement("script");
      script.src =
        "https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit";
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () =>
        reject(new Error("Security verification script could not be loaded."));
      document.head.appendChild(script);
    });
  }

  await window.__shadowTurnstileLoader;
}

export async function acquireTurnstileToken(
  siteKey: string,
  container: HTMLElement,
) {
  await loadTurnstileScript();

  const api = window.turnstile;
  if (!api) {
    throw new Error("Security verification is not available.");
  }

  container.innerHTML = "";

  return await new Promise<string>((resolve, reject) => {
    let settled = false;

    const settle = (callback: (value: string) => void, value: string) => {
      if (settled) {
        return;
      }
      settled = true;
      callback(value);
    };

    const widgetId = api.render(container, {
      sitekey: siteKey,
      size: "invisible",
      callback: (token: string) => {
        api.remove?.(widgetId);
        container.innerHTML = "";
        settle(resolve, token);
      },
      "error-callback": () => {
        api.remove?.(widgetId);
        container.innerHTML = "";
        reject(new Error("Security verification failed. Please try again."));
      },
      "expired-callback": () => {
        api.remove?.(widgetId);
        container.innerHTML = "";
        reject(new Error("Security verification expired. Please try again."));
      },
    });

    try {
      api.execute(widgetId);
    } catch (error) {
      api.remove?.(widgetId);
      container.innerHTML = "";
      reject(
        error instanceof Error
          ? error
          : new Error("Security verification failed. Please try again."),
      );
    }
  });
}
