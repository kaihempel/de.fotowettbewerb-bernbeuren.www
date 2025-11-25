import { useEffect, useRef } from "react";

interface HCaptchaProps {
  siteKey: string;
  onVerify: (token: string) => void;
  onExpire?: () => void;
  onError?: (error: string) => void;
}

export function HCaptcha({
  siteKey,
  onVerify,
  onExpire,
  onError,
}: HCaptchaProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const widgetIdRef = useRef<string | null>(null);
  const scriptRef = useRef<HTMLScriptElement | null>(null);

  useEffect(() => {
    // Check if hCaptcha script is already loaded
    const existingScript = document.querySelector(
      'script[src="https://js.hcaptcha.com/1/api.js"]',
    );

    const renderCaptcha = () => {
      if (containerRef.current && window.hcaptcha && !widgetIdRef.current) {
        try {
          widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
            sitekey: siteKey,
            callback: onVerify,
            "expired-callback": onExpire,
            "error-callback": onError,
          });
        } catch (error) {
          console.error("Failed to render hCaptcha:", error);
          if (onError) {
            onError(String(error));
          }
        }
      }
    };

    if (existingScript) {
      // Script already exists, just render if hCaptcha is ready
      if (window.hcaptcha) {
        renderCaptcha();
      } else {
        // Wait for the existing script to load
        existingScript.addEventListener("load", renderCaptcha);
      }
    } else {
      // Load hCaptcha script for the first time
      const script = document.createElement("script");
      script.src = "https://js.hcaptcha.com/1/api.js";
      script.async = true;
      script.defer = true;
      scriptRef.current = script;

      script.onload = renderCaptcha;
      script.onerror = () => {
        console.error("Failed to load hCaptcha script");
        if (onError) {
          onError("Failed to load hCaptcha script");
        }
      };

      document.body.appendChild(script);
    }

    return () => {
      // Only remove the widget, not the script
      if (widgetIdRef.current && window.hcaptcha) {
        try {
          window.hcaptcha.remove(widgetIdRef.current);
        } catch (error) {
          // Silently handle removal errors
          console.debug("hCaptcha widget cleanup:", error);
        }
        widgetIdRef.current = null;
      }
    };
  }, [siteKey, onVerify, onExpire, onError]);

  return <div ref={containerRef} />;
}

// Type declaration for hCaptcha
interface HCaptchaConfig {
  sitekey: string;
  callback?: (token: string) => void;
  "expired-callback"?: () => void;
  "error-callback"?: (error: string) => void;
}

declare global {
  interface Window {
    hcaptcha: {
      render: (container: HTMLElement, config: HCaptchaConfig) => string;
      remove: (widgetId: string) => void;
      reset: (widgetId: string) => void;
    };
  }
}
