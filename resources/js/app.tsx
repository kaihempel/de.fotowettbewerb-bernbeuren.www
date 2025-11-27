import "../css/app.css";

// Initialize i18n before React renders
import "./i18n/config";

import { createInertiaApp } from "@inertiajs/react";
import { resolvePageComponent } from "laravel-vite-plugin/inertia-helpers";
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { initializeTheme } from "./hooks/use-appearance";
import { initializeI18n } from "./i18n/config";

const appName = import.meta.env.VITE_APP_NAME || "Laravel";

createInertiaApp({
  title: (title) => (title ? `${title} - ${appName}` : appName),
  resolve: (name) =>
    resolvePageComponent(
      `./pages/${name}.tsx`,
      import.meta.glob("./pages/**/*.tsx"),
    ),
  setup({ el, App, props }) {
    // Initialize i18n with locale from server props
    const locale = props.initialPage.props.locale as string | undefined;
    initializeI18n(locale);

    const root = createRoot(el);

    root.render(
      <StrictMode>
        <App {...props} />
      </StrictMode>,
    );
  },
  progress: {
    color: "#4B5563",
  },
});

// This will set light / dark mode on load...
initializeTheme();
