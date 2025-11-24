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

  useEffect(() => {
    // Load hCaptcha script
    const script = document.createElement("script");
    script.src = "https://js.hcaptcha.com/1/api.js";
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (containerRef.current && window.hcaptcha) {
        widgetIdRef.current = window.hcaptcha.render(containerRef.current, {
          sitekey: siteKey,
          callback: onVerify,
          "expired-callback": onExpire,
          "error-callback": onError,
        });
      }
    };

    return () => {
      if (widgetIdRef.current && window.hcaptcha) {
        window.hcaptcha.remove(widgetIdRef.current);
      }
      document.body.removeChild(script);
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
