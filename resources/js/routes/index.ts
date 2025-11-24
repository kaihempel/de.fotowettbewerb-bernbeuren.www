import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
} from "./../wayfinder";
/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
export const login = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
  url: login.url(options),
  method: "get",
});

login.definition = {
  methods: ["get", "head"],
  url: "/login",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.url = (options?: RouteQueryOptions) => {
  return login.definition.url + queryParams(options);
};

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.get = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
  url: login.url(options),
  method: "get",
});

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
login.head = (options?: RouteQueryOptions): RouteDefinition<"head"> => ({
  url: login.url(options),
  method: "head",
});

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
const loginForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: login.url(options),
  method: "get",
});

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
loginForm.get = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
  action: login.url(options),
  method: "get",
});

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::login
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:47
 * @route '/login'
 */
loginForm.head = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
  action: login.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

login.form = loginForm;

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
export const logout = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: logout.url(options),
  method: "post",
});

logout.definition = {
  methods: ["post"],
  url: "/logout",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.url = (options?: RouteQueryOptions) => {
  return logout.definition.url + queryParams(options);
};

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logout.post = (options?: RouteQueryOptions): RouteDefinition<"post"> => ({
  url: logout.url(options),
  method: "post",
});

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
const logoutForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: logout.url(options),
  method: "post",
});

/**
 * @see \Laravel\Fortify\Http\Controllers\AuthenticatedSessionController::logout
 * @see vendor/laravel/fortify/src/Http/Controllers/AuthenticatedSessionController.php:100
 * @route '/logout'
 */
logoutForm.post = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: logout.url(options),
  method: "post",
});

logout.form = logoutForm;

/**
 * @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
export const register = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: register.url(options),
  method: "get",
});

register.definition = {
  methods: ["get", "head"],
  url: "/register",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.url = (options?: RouteQueryOptions) => {
  return register.definition.url + queryParams(options);
};

/**
 * @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.get = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
  url: register.url(options),
  method: "get",
});

/**
 * @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
register.head = (options?: RouteQueryOptions): RouteDefinition<"head"> => ({
  url: register.url(options),
  method: "head",
});

/**
 * @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
const registerForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: register.url(options),
  method: "get",
});

/**
 * @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
registerForm.get = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: register.url(options),
  method: "get",
});

/**
 * @see \Laravel\Fortify\Http\Controllers\RegisteredUserController::register
 * @see vendor/laravel/fortify/src/Http/Controllers/RegisteredUserController.php:41
 * @route '/register'
 */
registerForm.head = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: register.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

register.form = registerForm;

/**
 * @see \App\Http\Controllers\PublicGalleryController::home
 * @see app/Http/Controllers/PublicGalleryController.php:50
 * @route '/'
 */
export const home = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
  url: home.url(options),
  method: "get",
});

home.definition = {
  methods: ["get", "head"],
  url: "/",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\PublicGalleryController::home
 * @see app/Http/Controllers/PublicGalleryController.php:50
 * @route '/'
 */
home.url = (options?: RouteQueryOptions) => {
  return home.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\PublicGalleryController::home
 * @see app/Http/Controllers/PublicGalleryController.php:50
 * @route '/'
 */
home.get = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
  url: home.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicGalleryController::home
 * @see app/Http/Controllers/PublicGalleryController.php:50
 * @route '/'
 */
home.head = (options?: RouteQueryOptions): RouteDefinition<"head"> => ({
  url: home.url(options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\PublicGalleryController::home
 * @see app/Http/Controllers/PublicGalleryController.php:50
 * @route '/'
 */
const homeForm = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
  action: home.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicGalleryController::home
 * @see app/Http/Controllers/PublicGalleryController.php:50
 * @route '/'
 */
homeForm.get = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
  action: home.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicGalleryController::home
 * @see app/Http/Controllers/PublicGalleryController.php:50
 * @route '/'
 */
homeForm.head = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
  action: home.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

home.form = homeForm;

/**
 * @see \App\Http\Controllers\PublicGalleryController::gallery
 * @see app/Http/Controllers/PublicGalleryController.php:50
 * @route '/gallery'
 */
export const gallery = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: gallery.url(options),
  method: "get",
});

gallery.definition = {
  methods: ["get", "head"],
  url: "/gallery",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\PublicGalleryController::gallery
 * @see app/Http/Controllers/PublicGalleryController.php:50
 * @route '/gallery'
 */
gallery.url = (options?: RouteQueryOptions) => {
  return gallery.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\PublicGalleryController::gallery
 * @see app/Http/Controllers/PublicGalleryController.php:50
 * @route '/gallery'
 */
gallery.get = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
  url: gallery.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicGalleryController::gallery
 * @see app/Http/Controllers/PublicGalleryController.php:50
 * @route '/gallery'
 */
gallery.head = (options?: RouteQueryOptions): RouteDefinition<"head"> => ({
  url: gallery.url(options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\PublicGalleryController::gallery
 * @see app/Http/Controllers/PublicGalleryController.php:50
 * @route '/gallery'
 */
const galleryForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: gallery.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicGalleryController::gallery
 * @see app/Http/Controllers/PublicGalleryController.php:50
 * @route '/gallery'
 */
galleryForm.get = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: gallery.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PublicGalleryController::gallery
 * @see app/Http/Controllers/PublicGalleryController.php:50
 * @route '/gallery'
 */
galleryForm.head = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: gallery.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

gallery.form = galleryForm;

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

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::dashboard
 * @see app/Http/Controllers/PhotoSubmissionController.php:41
 * @route '/dashboard'
 */
export const dashboard = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: dashboard.url(options),
  method: "get",
});

dashboard.definition = {
  methods: ["get", "head"],
  url: "/dashboard",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::dashboard
 * @see app/Http/Controllers/PhotoSubmissionController.php:41
 * @route '/dashboard'
 */
dashboard.url = (options?: RouteQueryOptions) => {
  return dashboard.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::dashboard
 * @see app/Http/Controllers/PhotoSubmissionController.php:41
 * @route '/dashboard'
 */
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
  url: dashboard.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::dashboard
 * @see app/Http/Controllers/PhotoSubmissionController.php:41
 * @route '/dashboard'
 */
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<"head"> => ({
  url: dashboard.url(options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::dashboard
 * @see app/Http/Controllers/PhotoSubmissionController.php:41
 * @route '/dashboard'
 */
const dashboardForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: dashboard.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::dashboard
 * @see app/Http/Controllers/PhotoSubmissionController.php:41
 * @route '/dashboard'
 */
dashboardForm.get = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: dashboard.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::dashboard
 * @see app/Http/Controllers/PhotoSubmissionController.php:41
 * @route '/dashboard'
 */
dashboardForm.head = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: dashboard.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

dashboard.form = dashboardForm;
