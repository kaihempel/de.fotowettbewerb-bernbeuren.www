import "i18next";

// Import translation resources for type inference
import type deCommon from "./locales/de/common.json";
import type deContent from "./locales/de/content.json";
import type deSettings from "./locales/de/settings.json";
import type deSubmissions from "./locales/de/submissions.json";
import type deValidation from "./locales/de/validation.json";

// Define the structure of all translation namespaces
declare module "i18next" {
  interface CustomTypeOptions {
    // Default namespace used when calling t() without specifying namespace
    defaultNS: "common";

    // Define the resources structure for type-safe translations
    resources: {
      common: typeof deCommon;
      content: typeof deContent;
      settings: typeof deSettings;
      submissions: typeof deSubmissions;
      validation: typeof deValidation;
      auth: Record<string, unknown>;
      dashboard: Record<string, unknown>;
      gallery: Record<string, unknown>;
    };

    // Enable return type of t() to be string | undefined
    returnNull: false;
    returnEmptyString: false;
  }
}

export {};
