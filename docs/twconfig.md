### Configure Tailwind CSS v4 with legacy JavaScript file

Source: https://tailwindcss.com/docs/functions-and-directives

Demonstrates how to load a legacy JavaScript-based configuration file in Tailwind CSS v4 using the `@config` directive. It's important to note that `corePlugins`, `safelist`, and `separator` options from legacy configs are not supported in v4. For safelisting utilities, `@source inline()` should be used instead.

```css
@config "../../tailwind.config.js";
```

--------------------------------

### Explicitly Load JavaScript Config Files in Tailwind CSS v4

Source: https://tailwindcss.com/docs/upgrade-guide

Tailwind CSS v4 no longer automatically detects JavaScript configuration files. If your project still relies on a JavaScript config for backward compatibility, you must explicitly load it using the `@config` directive. This snippet shows how to reference your `tailwind.config.js` file.

```CSS
@config "../../tailwind.config.js";
```

--------------------------------

### Enable Tailwind Watcher in Elixir Development Config

Source: https://tailwindcss.com/docs/installation/framework-guides/phoenix

Add a Tailwind watcher to your list of development watchers in the `./config/dev.exs` file. This configuration enables automatic recompilation of CSS during development, providing live reloading capabilities as you make changes to your Tailwind-related files.

```Elixir
watchers: [
  # Start the esbuild watcher by calling Esbuild.install_and_run(:default, args)
  esbuild: {Esbuild, :install_and_run, [:myproject, ~w(--sourcemap=inline --watch)]},
  tailwind: {Tailwind, :install_and_run, [:myproject, ~w(--watch)]}
]
```

--------------------------------

### Configure Tailwind Plugin in Elixir

Source: https://tailwindcss.com/docs/installation/framework-guides/phoenix

Configure the Tailwind plugin in your `config/config.exs` file. This involves specifying the desired Tailwind CSS version and defining the input and output paths for your CSS assets, directing Tailwind to process `assets/css/app.css` and output to `priv/static/assets/app.css`.

```Elixir
config :tailwind,
  version: "4.1.10",
  myproject: [
    args: ~w(
      --input=assets/css/app.css
      --output=priv/static/assets/app.css
    ),
    cd: Path.expand("..", __DIR__)
  ]
```

--------------------------------

### Configure @tailwindcss/postcss in postcss.config.js

Source: https://tailwindcss.com/docs/installation/framework-guides/gatsby

This `postcss.config.js` file configures PostCSS to use the `@tailwindcss/postcss` plugin. This setup ensures that Tailwind CSS is correctly processed and integrated into your styles by PostCSS during the build process.

```javascript
module.exports = {  plugins: {    "@tailwindcss/postcss": {},  },};
```

--------------------------------

### Configure Tailwind CSS Vite plugin in vite.config.ts

Source: https://tailwindcss.com/docs/installation/framework-guides/sveltekit

Adds the `@tailwindcss/vite` plugin to the `vite.config.ts` file, ensuring Tailwind CSS is properly processed by Vite during development and build. The SvelteKit plugin is also included for Svelte-specific optimizations.

```TypeScript
import { sveltekit } from '@sveltejs/kit/vite';import { defineConfig } from 'vite';import tailwindcss from '@tailwindcss/vite';export default defineConfig({
  plugins: [
    tailwindcss(),
    sveltekit()
  ]
});
```

--------------------------------

### Configure Tailwind CSS Vite plugin

Source: https://tailwindcss.com/docs/index

Integrates the `@tailwindcss/vite` plugin into your `vite.config.ts` file. This configuration step is crucial for allowing Vite to correctly process and compile your Tailwind CSS utility classes.

```typescript
import { defineConfig } from 'vite'import tailwindcss from '@tailwindcss/vite'export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

--------------------------------

### Configure HTML Viewport Meta Tag for Responsive Design

Source: https://tailwindcss.com/docs/responsive-design

Ensures proper scaling and responsiveness across various devices by setting the viewport width and initial zoom level in the document's head, which is crucial for mobile-first design.

```html
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
```

--------------------------------

### Configure Vite plugin for Tailwind CSS

Source: https://tailwindcss.com/docs/installation/using-vite

Adds the `@tailwindcss/vite` plugin to the `plugins` array within your `vite.config.ts` file. This configuration ensures that Vite recognizes and processes Tailwind CSS during development and build, allowing its styles to be generated.

```TypeScript
import { defineConfig } from 'vite'import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
  ],
})
```

--------------------------------

### Configure Asset Deployment Alias for Tailwind in Elixir

Source: https://tailwindcss.com/docs/installation/framework-guides/phoenix

Modify the `assets.deploy` alias in your `mix.exs` file to include the Tailwind build command with minification. This step ensures that Tailwind CSS is properly compiled and optimized as part of your application's deployment pipeline.

```Elixir
defp aliases do  [
    # …
    "assets.deploy": [
      "tailwind myproject --minify",
      "esbuild myproject --minify",
      "phx.digest"
    ]
  ]end
```

--------------------------------

### Configure Vite for Tailwind CSS

Source: https://tailwindcss.com/docs/installation/framework-guides/adonisjs

Integrates the `@tailwindcss/vite` plugin into the `vite.config.ts` file. This configuration ensures that Tailwind CSS is correctly processed and compiled by Vite during the development and build processes.

```TypeScript
import { defineConfig } from 'vite'import adonisjs from '@adonisjs/vite/client'import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    adonisjs({
      // …
    }),
  ],
})
```

--------------------------------

### Enable gatsby-plugin-postcss in gatsby-config.js

Source: https://tailwindcss.com/docs/installation/framework-guides/gatsby

This JavaScript configuration snippet for `gatsby-config.js` enables the `gatsby-plugin-postcss` plugin. It is crucial for Gatsby to correctly process PostCSS and Tailwind CSS directives, allowing styles to be compiled during the build process.

```javascript
module.exports = {  plugins: [    'gatsby-plugin-postcss',    // ...  ],}
```

--------------------------------

### Support Literal Values with --value('literal') in CSS

Source: https://tailwindcss.com/docs/adding-custom-styles

Define a set of literal string values using `--value("literal1", "literal2", ...)` for utilities. This allows for direct matching of predefined string values such as `tab-inherit` or `tab-unset`.

```CSS
@utility tab-* {
  tab-size: --value("inherit", "initial", "unset");
}
```

--------------------------------

### Apply Arbitrary CSS Variables with Tailwind Modifiers in HTML

Source: https://tailwindcss.com/docs/adding-custom-styles

This HTML snippet illustrates setting CSS variables as arbitrary properties, particularly useful when these variables need to change under different conditions. For example, '--scroll-offset' can be set differently for large screens ('lg:[--scroll-offset:44px]').

```html
<div class="[--scroll-offset:56px] lg:[--scroll-offset:44px]">  <!-- ... --></div>
```

--------------------------------

### Configure Tailwind CSS Vite Plugin

Source: https://tailwindcss.com/docs/installation/framework-guides/tanstack-start

Add the `@tailwindcss/vite` plugin to your Vite configuration file (`vite.config.ts`). This ensures Tailwind CSS is processed correctly during the build and development phases of your TanStack Start application.

```typescript
import { tanstackStart } from '@tanstack/react-start/plugin/vite';import { defineConfig } from 'vite';import tsConfigPaths from 'vite-tsconfig-paths';import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    tanstackStart(),
    tsConfigPaths(),
  ]
});
```

--------------------------------

### Apply Custom Padding Values with Tailwind CSS

Source: https://tailwindcss.com/docs/padding

Explains how to set arbitrary padding values using bracket notation, like `p-[5px]`, and how to reference CSS variables using `p-(<custom-property>)` for dynamic padding in HTML.

```html
<div class="p-[5px] ...">  <!-- ... --></div>
```

```html
<div class="p-(--my-padding) ...">  <!-- ... --></div>
```

--------------------------------

### Configure Tailwind CSS Vite Plugin in Qwik

Source: https://tailwindcss.com/docs/installation/framework-guides/qwik

Integrates the `@tailwindcss/vite` plugin into the `vite.config.ts` file. This configuration ensures that Vite processes Tailwind CSS directives during the build process, enabling utility classes to be compiled.

```typescript
import { defineConfig } from 'vite'import { qwikVite } from "@builder.io/qwik/optimizer";import { qwikCity } from "@builder.io/qwik-city/vite";// …import tailwindcss from '@tailwindcss/vite'export default defineConfig(({ command, mode }): UserConfig => {  return {    plugins: [      tailwindcss(),      qwikCity(),      qwikVite(),      tsconfigPaths(),    ],    // …  }})
```

--------------------------------

### Set Width and Height Simultaneously with Tailwind CSS `size` Utilities

Source: https://tailwindcss.com/docs/height

Explains how to use `size-<value>` utilities like `size-px`, `size-4`, and `size-full` to set both the width and height of an element to the same value at once.

```html
<div class="size-16 ...">size-16</div><div class="size-20 ...">size-20</div><div class="size-24 ...">size-24</div><div class="size-32 ...">size-32</div><div class="size-40 ...">size-40</div>
```

--------------------------------

### Apply Arbitrary Background Color, Font Size, and Pseudo-element Content in Tailwind HTML

Source: https://tailwindcss.com/docs/adding-custom-styles

This HTML snippet illustrates the versatility of arbitrary values for various CSS properties, including background colors, font sizes, and pseudo-element content. It allows for inline definition of values like 'bg-[#bada55]', 'text-[22px]', and 'before:content-['Festivus']'.

```html
<div class="bg-[#bada55] text-[22px] before:content-['Festivus']">  <!-- ... --></div>
```

--------------------------------

### Apply Custom Height Values with Tailwind CSS

Source: https://tailwindcss.com/docs/height

Demonstrates using arbitrary value syntax `h-[<value>]` to set a custom height, and `h-(<custom-property>)` for CSS variables as a shorthand for `h-[var(<custom-property>)]`.

```html
<div class="h-[32rem] ...">  <!-- ... --></div>
```

```html
<div class="h-(--my-height) ...">  <!-- ... --></div>
```

--------------------------------

### Apply Complex Tailwind CSS Selectors with Multiple Variants

Source: https://tailwindcss.com/docs/styling-with-utility-classes

Demonstrates combining multiple Tailwind variants (e.g., dark mode, breakpoint, data attribute, and hover) to apply highly specific styles. This allows for conditional styling based on a combination of user interaction and environment factors.

```HTML
<button class="dark:lg:data-current:hover:bg-indigo-600 ...">  <!-- ... --></button>
```

```CSS
@media (prefers-color-scheme: dark) and (width >= 64rem) {
  button[data-current]:hover {
    background-color: var(--color-indigo-600);
  }
}
```

--------------------------------

### Customize Tailwind CSS Container Utility in v4

Source: https://tailwindcss.com/docs/upgrade-guide

Tailwind CSS v4 removes container configuration options like `center` and `padding` that were available in v3. To customize the `container` utility in v4, users should extend it using the `@utility` directive within their CSS.

```css
@utility container {
  margin-inline: auto;
  padding-inline: 2rem;
}
```

--------------------------------

### Configure PostCSS to use Tailwind CSS plugin

Source: https://tailwindcss.com/docs/installation/using-postcss

This JavaScript snippet for `postcss.config.mjs` integrates the `@tailwindcss/postcss` plugin into your PostCSS build process. It ensures that PostCSS processes and generates the necessary Tailwind CSS utility classes. This configuration is crucial for proper Tailwind CSS compilation.

```javascript
export default {  plugins: {    "@tailwindcss/postcss": {},  }}
```

--------------------------------

### Configure Vite for Tailwind CSS and SolidJS

Source: https://tailwindcss.com/docs/installation/framework-guides/solidjs

Modifies the `vite.config.ts` file to include both the `@tailwindcss/vite` and `vite-plugin-solid` plugins. This configuration enables Tailwind CSS processing and SolidJS compilation within the Vite build system.

```typescript
import { defineConfig } from 'vite';import solidPlugin from 'vite-plugin-solid';import tailwindcss from '@tailwindcss/vite';export default defineConfig({
  plugins: [
    tailwindcss(),
    solidPlugin(),
  ],
  server: {
    port: 3000,
  },
  build: {
    target: 'esnext',
  },
});
```

--------------------------------

### Configure PostCSS Plugin for Tailwind CSS in Next.js

Source: https://tailwindcss.com/docs/installation/framework-guides/nextjs

Creates or updates `postcss.config.mjs` to include `@tailwindcss/postcss` in the PostCSS plugin configuration. This setup ensures that Tailwind CSS directives are processed correctly during the Next.js build process.

```JavaScript
const config = {
  plugins: {
    "@tailwindcss/postcss": {},
  },
};
export default config;
```

--------------------------------

### Customize Tailwind CSS Column Theme Variables

Source: https://tailwindcss.com/docs/columns

This CSS snippet demonstrates how to customize the `--container-*` theme variables within your Tailwind CSS configuration. Modifying these variables allows you to define custom fixed-width column sizes, such as `--container-4xs`, for use with corresponding utility classes.

```css
@theme {
  --container-4xs: 14rem; 
}
```

--------------------------------

### Apply custom gap values with Tailwind CSS

Source: https://tailwindcss.com/docs/gap

Shows how to define custom gap sizes using bracket notation, `gap-[<value>]`, such as `gap-[10vw]`, and how to reference CSS variables with `gap-(<custom-property>)`. This provides flexibility beyond Tailwind's default spacing scale.

```html
<div class="gap-[10vw] ...">  <!-- ... --></div>
```

```html
<div class="gap-(--my-gap) ...">  <!-- ... --></div>
```

--------------------------------

### Configure Tailwind CSS Vite Plugin in Astro

Source: https://tailwindcss.com/docs/installation/framework-guides/astro

Modifies the `astro.config.mjs` file to integrate the `@tailwindcss/vite` plugin into Astro's Vite configuration. This ensures that Tailwind CSS is processed correctly during the build.

```javascript
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";

// https://astro.build/config
export default defineConfig({
  vite: {
    plugins: [tailwindcss()],
  },
});
```

--------------------------------

### Apply Fixed Widths with Tailwind CSS Spacing Scale

Source: https://tailwindcss.com/docs/width

Demonstrates how to use `w-<number>` utilities (e.g., `w-96`, `w-24`) to set a fixed width for elements based on Tailwind's internal spacing scale. These utilities map to `width: calc(var(--spacing) * <number>);` in the generated CSS.

```html
<div class="w-96 ...">w-96</div><div class="w-80 ...">w-80</div><div class="w-64 ...">w-64</div><div class="w-48 ...">w-48</div><div class="w-40 ...">w-40</div><div class="w-32 ...">w-32</div><div class="w-24 ...">w-24</div>
```

--------------------------------

### Configure Tailwind CSS Vite Plugin

Source: https://tailwindcss.com/docs/installation/framework-guides/laravel/vite

Adds the `@tailwindcss/vite` plugin to your Vite configuration file (`vite.config.ts`) to enable Tailwind CSS processing within the project.

```TypeScript
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    tailwindcss(),
    // …
  ],
})
```

--------------------------------

### Configure and Generate Tailwind CSS Prefixed Theme Variables (CSS)

Source: https://tailwindcss.com/docs/upgrade-guide

Illustrates how to configure theme variables with `@import "tailwindcss" prefix(tw);` and define theme properties without the prefix in v4.0. It also shows the resulting generated CSS variables with the applied prefix to prevent conflicts.

```css
@import "tailwindcss" prefix(tw);
@theme {
  --font-display: "Satoshi", "sans-serif";
  --breakpoint-3xl: 120rem;
  --color-avocado-100: oklch(0.99 0 0);
  --color-avocado-200: oklch(0.98 0.04 113.22);
  --color-avocado-300: oklch(0.94 0.11 115.03);
  /* ... */
}
```

```css
:root {
  --tw-font-display: "Satoshi", "sans-serif";
  --tw-breakpoint-3xl: 120rem;
  --tw-color-avocado-100: oklch(0.99 0 0);
  --tw-color-avocado-200: oklch(0.98 0.04 113.22);
  --tw-color-avocado-300: oklch(0.94 0.11 115.03);
  /* ... */
}
```

--------------------------------

### Define custom grid-auto-columns values in Tailwind CSS

Source: https://tailwindcss.com/docs/grid-auto-columns

This example shows how to use the `auto-cols-[<value>]` syntax to set a custom size for implicitly-created grid columns. It also illustrates the shorthand `auto-cols-(<custom-property>)` for CSS variables, which automatically adds the `var()` function.

```html
<div class="auto-cols-[minmax(0,2fr)] ...">  <!-- ... --></div>
```

```html
<div class="auto-cols-(--my-auto-cols) ...">  <!-- ... --></div>
```

--------------------------------

### Support Arbitrary Values with --value([type]) in CSS

Source: https://tailwindcss.com/docs/adding-custom-styles

Enable arbitrary values for utilities by using the `--value([{type}])` syntax, specifying the allowed data type within square brackets (e.g., `[integer]`, `[length]`). This allows utilities like `tab-[1]` or `tab-[76]` with custom values.

```CSS
@utility tab-* {
  tab-size: --value([integer]);
}
```

--------------------------------

### Set custom text decoration thickness values in Tailwind CSS

Source: https://tailwindcss.com/docs/text-decoration-thickness

This snippet illustrates how to apply custom text decoration thickness using arbitrary values with `decoration-[<value>]` syntax (e.g., `decoration-[0.25rem]`). It also shows how to link thickness to a CSS custom property using `decoration-(length:<custom-property>)` for dynamic control, which is a shorthand for `decoration-[length:var(<custom-property>)]`.

```html
<p class="decoration-[0.25rem] ...">  Lorem ipsum dolor sit amet...</p>
```

```html
<p class="decoration-(length:--my-decoration-thickness) ...">  Lorem ipsum dolor sit amet...</p>
```

--------------------------------

### Customize Tailwind CSS Padding Theme Variable

Source: https://tailwindcss.com/docs/padding

Shows how to customize the `--spacing` CSS variable within the `@theme` block of your Tailwind CSS configuration. This allows global control over the base spacing unit used by padding utilities.

```css
@theme {
  --spacing: 1px; 
}
```

--------------------------------

### Apply Custom Background Size with Tailwind CSS Variables

Source: https://tailwindcss.com/docs/background-size

Use the `bg-size-(<custom-property>)` syntax to set the background size dynamically using a CSS variable. This shorthand automatically wraps the custom property in `var()`, enabling reusable and configurable background sizes across your design system.

```html
<div class="bg-size-(--my-image-size) ...">  <!-- ... --></div>
```

--------------------------------

### Apply Arbitrary Container Query Values in HTML with Tailwind

Source: https://tailwindcss.com/docs/responsive-design

This HTML snippet illustrates the use of arbitrary values for one-off container query sizes, such as `@min-[475px]`. This approach avoids adding new values to the theme when a specific breakpoint is needed for a single instance, making the component responsive to precise container widths.

```html
<div class="@container">  <div class="flex flex-col @min-[475px]:flex-row">    <!-- ... -->  </div></div>
```

--------------------------------

### Configure PostCSS Plugins for Tailwind CSS

Source: https://tailwindcss.com/docs/installation/framework-guides/rspack/react

This JavaScript configuration file (`postcss.config.mjs`) sets up PostCSS to use the `@tailwindcss/postcss` plugin. This step activates Tailwind CSS processing, enabling the framework to generate styles from your utility classes.

```javascript
export default {  plugins: {    "@tailwindcss/postcss": {}  }}; 
```

--------------------------------

### Implement Responsive Height with Tailwind CSS Breakpoints

Source: https://tailwindcss.com/docs/height

Illustrates how to use responsive prefixes like `md:` with height utilities to apply styles conditionally based on screen sizes, enabling adaptive designs for different viewports.

```html
<div class="h-1/2 md:h-full ...">  <!-- ... --></div>
```

--------------------------------

### Define OKLCH Color Palette Custom Properties in CSS

Source: https://tailwindcss.com/docs/theme

This CSS snippet defines a wide range of color variables using the OKLCH color space. These custom properties are organized by color (e.g., cyan, sky, blue) and shade (e.g., 50, 100, ..., 950). They can be easily integrated into CSS frameworks or used for consistent theming across web projects.

```css
--color-cyan-700: oklch(52% 0.105 223.128);  --color-cyan-800: oklch(45% 0.085 224.283);  --color-cyan-900: oklch(39.8% 0.07 227.392);  --color-cyan-950: oklch(30.2% 0.056 229.695);  --color-sky-50: oklch(97.7% 0.013 236.62);  --color-sky-100: oklch(95.1% 0.026 236.824);  --color-sky-200: oklch(90.1% 0.058 230.902);  --color-sky-300: oklch(82.8% 0.111 230.318);  --color-sky-400: oklch(74.6% 0.16 232.661);  --color-sky-500: oklch(68.5% 0.169 237.323);  --color-sky-600: oklch(58.8% 0.158 241.966);  --color-sky-700: oklch(50% 0.134 242.749);  --color-sky-800: oklch(44.3% 0.11 240.79);  --color-sky-900: oklch(39.1% 0.09 240.876);  --color-sky-950: oklch(29.3% 0.066 243.157);  --color-blue-50: oklch(97% 0.014 254.604);  --color-blue-100: oklch(93.2% 0.032 255.585);  --color-blue-200: oklch(88.2% 0.059 254.128);  --color-blue-300: oklch(80.9% 0.105 251.813);  --color-blue-400: oklch(70.7% 0.165 254.624);  --color-blue-500: oklch(62.3% 0.214 259.815);  --color-blue-600: oklch(54.6% 0.245 262.881);  --color-blue-700: oklch(48.8% 0.243 264.376);  --color-blue-800: oklch(42.4% 0.199 265.638);  --color-blue-900: oklch(37.9% 0.146 265.522);  --color-blue-950: oklch(28.2% 0.091 267.935);  --color-indigo-50: oklch(96.2% 0.018 272.314);  --color-indigo-100: oklch(93% 0.034 272.788);  --color-indigo-200: oklch(87% 0.065 274.039);  --color-indigo-300: oklch(78.5% 0.115 274.713);  --color-indigo-400: oklch(67.3% 0.182 276.935);  --color-indigo-500: oklch(58.5% 0.233 277.117);  --color-indigo-600: oklch(51.1% 0.262 276.966);  --color-indigo-700: oklch(45.7% 0.24 277.023);  --color-indigo-800: oklch(39.8% 0.195 277.366);  --color-indigo-900: oklch(35.9% 0.144 278.697);  --color-indigo-950: oklch(25.7% 0.09 281.288);  --color-violet-50: oklch(96.9% 0.016 293.756);  --color-violet-100: oklch(94.3% 0.029 294.588);  --color-violet-200: oklch(89.4% 0.057 293.283);  --color-violet-300: oklch(81.1% 0.111 293.571);  --color-violet-400: oklch(70.2% 0.183 293.541);  --color-violet-500: oklch(60.6% 0.25 292.717);  --color-violet-600: oklch(54.1% 0.281 293.009);  --color-violet-700: oklch(49.1% 0.27 292.581);  --color-violet-800: oklch(43.2% 0.232 292.759);  --color-violet-900: oklch(38% 0.189 293.745);  --color-violet-950: oklch(28.3% 0.141 291.089);  --color-purple-50: oklch(97.7% 0.014 308.299);  --color-purple-100: oklch(94.6% 0.033 307.174);  --color-purple-200: oklch(90.2% 0.063 306.703);  --color-purple-300: oklch(82.7% 0.119 306.383);  --color-purple-400: oklch(71.4% 0.203 305.504);  --color-purple-500: oklch(62.7% 0.265 303.9);  --color-purple-600: oklch(55.8% 0.288 302.321);  --color-purple-700: oklch(49.6% 0.265 301.924);  --color-purple-800: oklch(43.8% 0.218 303.724);  --color-purple-900: oklch(38.1% 0.176 304.987);  --color-purple-950: oklch(29.1% 0.149 302.717);  --color-fuchsia-50: oklch(97.7% 0.017 320.058);  --color-fuchsia-100: oklch(95.2% 0.037 318.852);  --color-fuchsia-200: oklch(90.3% 0.076 319.62);  --color-fuchsia-300: oklch(83.3% 0.145 321.434);  --color-fuchsia-400: oklch(74% 0.238 322.16);  --color-fuchsia-500: oklch(66.7% 0.295 322.15);  --color-fuchsia-600: oklch(59.1% 0.293 322.896);  --color-fuchsia-700: oklch(51.8% 0.253 323.949);  --color-fuchsia-800: oklch(45.2% 0.211 324.591);  --color-fuchsia-900: oklch(40.1% 0.17 325.612);  --color-fuchsia-950: oklch(29.3% 0.136 325.661);  --color-pink-50: oklch(97.1% 0.014 343.198);  --color-pink-100: oklch(94.8% 0.028 342.258);  --color-pink-200: oklch(89.9% 0.061 343.231);  --color-pink-300: oklch(82.3% 0.12 346.018);  --color-pink-400: oklch(71.8% 0.202 349.761);  --color-pink-500: oklch(65.6% 0.241 354.308);  --color-pink-600: oklch(59.2% 0.249 0.584);  --color-pink-700: oklch(52.5% 0.223 3.958);  --color-pink-800: oklch(45.9% 0.187 3.815);  --color-pink-900: oklch(40.8% 0.153 2.432);  --color-pink-950: oklch(28.4% 0.109 3.907);  --color-rose-50: oklch(96.9% 0.015 12.422);  --color-rose-100: oklch(94.1% 0.03 12.58);  --color-rose-200: oklch(89.2% 0.058 10.001);  --color-rose-300: oklch(81% 0.117 11.638);  --color-rose-400: oklch(71.2% 0.194 13.428);  --color-rose-500: oklch(64.5% 0.246 16.439);  --color-rose-600: oklch(58.6% 0.253 17.585);  --color-rose-700: oklch(51.4% 0.222 16.935);  --color-rose-800: oklch(45.5% 0.188 13.697);  --color-rose-900: oklch(41% 0.159 10.272);  --color-rose-950: oklch(27.1% 0.105 12.094);  --color-slate-50: oklch(98.4% 0.003 247.858);  --color-slate-100: oklch(96.8% 0.007 247.896);  --color-slate-200: oklch(92.9% 0.013 255.508);  --color-slate-300: oklch(86.9% 0.022 252.894);  --color-slate-400: oklch(70.4% 0.04 256.788);  --color-slate-500: oklch(55.4% 0.046 257.417);  --color-slate-600: oklch(44.6% 0.043 257.281);  --color-slate-700: oklch(37.2% 0.044 257.287);  --color-slate-800: oklch(27.9% 0.041 260.031);  --color-slate-900: oklch(20.8% 0.042 265.755);  --color-slate-950: oklch(12.9% 0.042 264.695);  --color-gray-50: oklch(98.5% 0.002 247.839);  --color-gray-100: oklch(96.7% 0.003 264.542);  --color-gray-200: oklch(92.8% 0.006 264.531
```

--------------------------------

### Apply Custom Line Clamp Value with Tailwind CSS

Source: https://tailwindcss.com/docs/line-clamp

Shows how to use arbitrary values with the `line-clamp-[<value>]` syntax to set the number of lines based on a custom calculation or dynamic value in an HTML paragraph.

```html
<p class="line-clamp-[calc(var(--characters)/100)] ...">  Lorem ipsum dolor sit amet...</p>
```

--------------------------------

### Set Arbitrary CSS Variables in Tailwind CSS

Source: https://tailwindcss.com/docs/styling-with-utility-classes

Demonstrates defining custom CSS variables using arbitrary property syntax in Tailwind CSS. This allows for dynamic styling and responsive adjustments of custom properties.

```HTML
<div class="[--gutter-width:1rem] lg:[--gutter-width:2rem]">  <!-- ... --></div>
```

--------------------------------

### Apply backdrop sepia with CSS variables in Tailwind CSS

Source: https://tailwindcss.com/docs/backdrop-filter-sepia

Shows how to integrate CSS variables for dynamic backdrop sepia filtering using the `backdrop-sepia-(<custom-property>)` syntax. This is a convenient shorthand that automatically wraps the custom property in `var()`, enabling flexible style management.

```html
<div class="backdrop-sepia-(--my-backdrop-sepia) ...">  <!-- ... --></div>
```

--------------------------------

### Combine Theme, Bare, and Arbitrary Values in CSS

Source: https://tailwindcss.com/docs/adding-custom-styles

Utilize multiple `--value()` declarations within a single `@utility` rule to support theme-based, bare, and arbitrary values concurrently. Declarations that fail to resolve for a given utility are automatically omitted from the final CSS output.

```CSS
@theme {
  --tab-size-github: 8;
}
@utility tab-* {
  tab-size: --value([integer]);
  tab-size: --value(integer);
  tab-size: --value(--tab-size-*);
}
```

--------------------------------

### Set custom brightness with arbitrary values in Tailwind CSS

Source: https://tailwindcss.com/docs/filter-brightness

Illustrates the use of arbitrary value syntax (`brightness-[<value>]`) to apply a completely custom brightness level to an element. This allows for precise control over the `filter: brightness()` property beyond predefined steps.

```html
<img class="brightness-[1.75] ..." src="/img/mountains.jpg" />
```

--------------------------------

### Configure the Tailwind CSS Vite plugin

Source: https://tailwindcss.com/docs/installation/framework-guides/react-router

Adds the `@tailwindcss/vite` plugin to the `vite.config.ts` file, ensuring that Tailwind CSS is correctly processed and integrated into the Vite build pipeline alongside other plugins like `reactRouter` and `tsconfigPaths`.

```typescript
import { reactRouter } from "@react-router/dev/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [
    tailwindcss(),
    reactRouter(),
    tsconfigPaths(),
  ],
});
```

--------------------------------

### Install Tailwind CSS Gem and Configure for Rails

Source: https://tailwindcss.com/docs/installation/framework-guides/ruby-on-rails

This step adds the `tailwindcss-rails` gem to your project's Gemfile, allowing Rails to manage Tailwind CSS. Following that, the `tailwindcss:install` command sets up the necessary configuration files and integrates Tailwind into the Rails asset pipeline.

```bash
bundle add tailwindcss-rails
./bin/rails tailwindcss:install
```

--------------------------------

### Set Custom Width with Arbitrary Values in Tailwind CSS

Source: https://tailwindcss.com/docs/width

This HTML snippet illustrates applying a specific, arbitrary width to an element using Tailwind CSS's `w-[<value>]` syntax. This allows for precise control over dimensions not covered by the default spacing scale, such as `w-[5px]` for a fixed pixel width.

```html
<div class="w-[5px] ...">  <!-- ... --></div>
```

--------------------------------

### Import app.css into SvelteKit layout file

Source: https://tailwindcss.com/docs/installation/framework-guides/sveltekit

Creates or modifies `./src/routes/+layout.svelte` to import the `app.css` file. This ensures that the global Tailwind CSS styles are applied across all pages rendered by this layout in your SvelteKit application.

```Svelte
<script>
  let { children } = $props();
  import "../app.css";
</script>{@render children()}
```

--------------------------------

### Define Tailwind CSS Inset Ring Colors with CSS Variables

Source: https://tailwindcss.com/docs/box-shadow

This snippet illustrates how Tailwind CSS utility classes translate into CSS variable assignments for `--tw-inset-ring-color`. Each entry sets the ring color using a predefined `--color-[name]-[shade]` variable, often accompanied by its Oklch color representation in a comment. These definitions are crucial for customizing the appearance of focus rings or borders in Tailwind CSS projects.

```css
--tw-inset-ring-color: var(--color-blue-500); /* oklch(62.3% 0.214 259.815) */
```

```css
--tw-inset-ring-color: var(--color-blue-600); /* oklch(54.6% 0.245 262.881) */
```

```css
--tw-inset-ring-color: var(--color-blue-700); /* oklch(48.8% 0.243 264.376) */
```

```css
--tw-inset-ring-color: var(--color-blue-800); /* oklch(42.4% 0.199 265.638) */
```

```css
--tw-inset-ring-color: var(--color-blue-900); /* oklch(37.9% 0.146 265.522) */
```

```css
--tw-inset-ring-color: var(--color-blue-950); /* oklch(28.2% 0.091 267.935) */
```

```css
--tw-inset-ring-color: var(--color-indigo-50); /* oklch(96.2% 0.018 272.314) */
```

```css
--tw-inset-ring-color: var(--color-indigo-100); /* oklch(93% 0.034 272.788) */
```

```css
--tw-inset-ring-color: var(--color-indigo-200); /* oklch(87% 0.065 274.039) */
```

```css
--tw-inset-ring-color: var(--color-indigo-300); /* oklch(78.5% 0.115 274.713) */
```

```css
--tw-inset-ring-color: var(--color-indigo-400); /* oklch(67.3% 0.182 276.935) */
```

```css
--tw-inset-ring-color: var(--color-indigo-500); /* oklch(58.5% 0.233 277.117) */
```

```css
--tw-inset-ring-color: var(--color-indigo-600); /* oklch(51.1% 0.262 276.966) */
```

```css
--tw-inset-ring-color: var(--color-indigo-700); /* oklch(45.7% 0.24 277.023) */
```

```css
--tw-inset-ring-color: var(--color-indigo-800); /* oklch(39.8% 0.195 277.366) */
```

```css
--tw-inset-ring-color: var(--color-indigo-900); /* oklch(35.9% 0.144 278.697) */
```

```css
--tw-inset-ring-color: var(--color-indigo-950); /* oklch(25.7% 0.09 281.288) */
```

```css
--tw-inset-ring-color: var(--color-violet-50); /* oklch(96.9% 0.016 293.756) */
```

```css
--tw-inset-ring-color: var(--color-violet-100); /* oklch(94.3% 0.029 294.588) */
```

```css
--tw-inset-ring-color: var(--color-violet-200); /* oklch(89.4% 0.057 293.283) */
```

```css
--tw-inset-ring-color: var(--color-violet-300); /* oklch(81.1% 0.111 293.571) */
```

```css
--tw-inset-ring-color: var(--color-violet-400); /* oklch(70.2% 0.183 293.541) */
```

```css
--tw-inset-ring-color: var(--color-violet-500); /* oklch(60.6% 0.25 292.717) */
```

```css
--tw-inset-ring-color: var(--color-violet-600); /* oklch(54.1% 0.281 293.009) */
```

```css
--tw-inset-ring-color: var(--color-violet-700); /* oklch(49.1% 0.27 292.581) */
```

```css
--tw-inset-ring-color: var(--color-violet-800); /* oklch(43.2% 0.232 292.759) */
```

```css
--tw-inset-ring-color: var(--color-violet-900); /* oklch(38% 0.189 293.745) */
```

```css
--tw-inset-ring-color: var(--color-violet-950); /* oklch(28.3% 0.141 291.089) */
```

```css
--tw-inset-ring-color: var(--color-purple-50); /* oklch(97.7% 0.014 308.299) */
```

```css
--tw-inset-ring-color: var(--color-purple-100); /* oklch(94.6% 0.033 307.174) */
```

```css
--tw-inset-ring-color: var(--color-purple-200); /* oklch(90.2% 0.063 306.703) */
```

```css
--tw-inset-ring-color: var(--color-purple-300); /* oklch(82.7% 0.119 306.383) */
```

```css
--tw-inset-ring-color: var(--color-purple-400); /* oklch(71.4% 0.203 305.504) */
```

```css
--tw-inset-ring-color: var(--color-purple-500); /* oklch(62.7% 0.265 303.9) */
```

```css
--tw-inset-ring-color: var(--color-purple-600); /* oklch(55.8% 0.288 302.321) */
```

```css
--tw-inset-ring-color: var(--color-purple-700); /* oklch(49.6% 0.265 301.924) */
```

```css
--tw-inset-ring-color: var(--color-purple-800); /* oklch(43.8% 0.218 303.724) */
```

```css
--tw-inset-ring-color: var(--color-purple-900); /* oklch(38.1% 0.176 304.987) */
```

```css
--tw-inset-ring-color: var(--color-purple-950); /* oklch(29.1% 0.149 302.717) */
```

```css
--tw-inset-ring-color: var(--color-fuchsia-50); /* oklch(97.7% 0.017 320.058) */
```

```css
--tw-inset-ring-color: var(--color-fuchsia-100); /* oklch(95.2% 0.037 318.852) */
```

```css
--tw-inset-ring-color: var(--color-fuchsia-200); /* oklch(90.3% 0.076 319.62) */
```

```css
--tw-inset-ring-color: var(--color-fuchsia-300); /* oklch(83.3% 0.145 321.434) */
```

```css
--tw-inset-ring-color: var(--color-fuchsia-400); /* oklch(74% 0.238 322.16) */
```

```css
--tw-inset-ring-color: var(--color-fuchsia-500); /* oklch(66.7% 0.295 322.15) */
```

--------------------------------

### Set Width Using CSS Variables in Tailwind CSS

Source: https://tailwindcss.com/docs/width

This HTML snippet demonstrates how to use a CSS custom property (variable) to define an element's width with Tailwind CSS. The `w-(--my-width)` syntax is a shorthand for `w-[var(--my-width)]`, automatically applying the `var()` function for dynamic width adjustments.

```html
<div class="w-(--my-width) ...">  <!-- ... --></div>
```

--------------------------------

### Create a new SvelteKit project

Source: https://tailwindcss.com/docs/installation/framework-guides/sveltekit

Initializes a new SvelteKit project using `npx sv create` and navigates into the project directory. This is the starting point for setting up your SvelteKit application.

```Terminal
npx sv create my-project
cd my-project
```

--------------------------------

### Set Fixed Height with Tailwind CSS Utilities

Source: https://tailwindcss.com/docs/height

Demonstrates how to use `h-<number>` utilities like `h-24` and `h-64` to set an element's height based on Tailwind's predefined spacing scale.

```html
<div class="h-96 ...">h-96</div><div class="h-80 ...">h-80</div><div class="h-64 ...">h-64</div><div class="h-48 ...">h-48</div><div class="h-40 ...">h-40</div><div class="h-32 ...">h-32</div><div class="h-24 ...">h-24</div>
```