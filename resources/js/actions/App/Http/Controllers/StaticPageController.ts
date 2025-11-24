import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../../../../wayfinder";
/**
 * @see \App\Http\Controllers\StaticPageController::imprint
 * @see app/Http/Controllers/StaticPageController.php:13
 * @route '/impressum'
 */
export const imprint = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: imprint.url(options),
  method: "get",
});

imprint.definition = {
  methods: ["get", "head"],
  url: "/impressum",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\StaticPageController::imprint
 * @see app/Http/Controllers/StaticPageController.php:13
 * @route '/impressum'
 */
imprint.url = (options?: RouteQueryOptions) => {
  return imprint.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\StaticPageController::imprint
 * @see app/Http/Controllers/StaticPageController.php:13
 * @route '/impressum'
 */
imprint.get = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
  url: imprint.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\StaticPageController::imprint
 * @see app/Http/Controllers/StaticPageController.php:13
 * @route '/impressum'
 */
imprint.head = (options?: RouteQueryOptions): RouteDefinition<"head"> => ({
  url: imprint.url(options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\StaticPageController::imprint
 * @see app/Http/Controllers/StaticPageController.php:13
 * @route '/impressum'
 */
const imprintForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: imprint.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\StaticPageController::imprint
 * @see app/Http/Controllers/StaticPageController.php:13
 * @route '/impressum'
 */
imprintForm.get = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: imprint.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\StaticPageController::imprint
 * @see app/Http/Controllers/StaticPageController.php:13
 * @route '/impressum'
 */
imprintForm.head = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: imprint.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

imprint.form = imprintForm;

/**
 * @see \App\Http\Controllers\StaticPageController::aboutUs
 * @see app/Http/Controllers/StaticPageController.php:23
 * @route '/about-us'
 */
export const aboutUs = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: aboutUs.url(options),
  method: "get",
});

aboutUs.definition = {
  methods: ["get", "head"],
  url: "/about-us",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\StaticPageController::aboutUs
 * @see app/Http/Controllers/StaticPageController.php:23
 * @route '/about-us'
 */
aboutUs.url = (options?: RouteQueryOptions) => {
  return aboutUs.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\StaticPageController::aboutUs
 * @see app/Http/Controllers/StaticPageController.php:23
 * @route '/about-us'
 */
aboutUs.get = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
  url: aboutUs.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\StaticPageController::aboutUs
 * @see app/Http/Controllers/StaticPageController.php:23
 * @route '/about-us'
 */
aboutUs.head = (options?: RouteQueryOptions): RouteDefinition<"head"> => ({
  url: aboutUs.url(options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\StaticPageController::aboutUs
 * @see app/Http/Controllers/StaticPageController.php:23
 * @route '/about-us'
 */
const aboutUsForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: aboutUs.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\StaticPageController::aboutUs
 * @see app/Http/Controllers/StaticPageController.php:23
 * @route '/about-us'
 */
aboutUsForm.get = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: aboutUs.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\StaticPageController::aboutUs
 * @see app/Http/Controllers/StaticPageController.php:23
 * @route '/about-us'
 */
aboutUsForm.head = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: aboutUs.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

aboutUs.form = aboutUsForm;

/**
 * @see \App\Http\Controllers\StaticPageController::project
 * @see app/Http/Controllers/StaticPageController.php:33
 * @route '/project'
 */
export const project = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: project.url(options),
  method: "get",
});

project.definition = {
  methods: ["get", "head"],
  url: "/project",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\StaticPageController::project
 * @see app/Http/Controllers/StaticPageController.php:33
 * @route '/project'
 */
project.url = (options?: RouteQueryOptions) => {
  return project.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\StaticPageController::project
 * @see app/Http/Controllers/StaticPageController.php:33
 * @route '/project'
 */
project.get = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
  url: project.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\StaticPageController::project
 * @see app/Http/Controllers/StaticPageController.php:33
 * @route '/project'
 */
project.head = (options?: RouteQueryOptions): RouteDefinition<"head"> => ({
  url: project.url(options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\StaticPageController::project
 * @see app/Http/Controllers/StaticPageController.php:33
 * @route '/project'
 */
const projectForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: project.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\StaticPageController::project
 * @see app/Http/Controllers/StaticPageController.php:33
 * @route '/project'
 */
projectForm.get = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: project.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\StaticPageController::project
 * @see app/Http/Controllers/StaticPageController.php:33
 * @route '/project'
 */
projectForm.head = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: project.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

project.form = projectForm;

const StaticPageController = { imprint, aboutUs, project };

export default StaticPageController;
