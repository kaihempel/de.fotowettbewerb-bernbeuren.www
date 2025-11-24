import {
  queryParams,
  type RouteQueryOptions,
  type RouteDefinition,
  type RouteFormDefinition,
  applyUrlDefaults,
} from "./../../../../wayfinder";
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

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::index
 * @see app/Http/Controllers/PhotoSubmissionController.php:21
 * @route '/photos'
 */
export const index = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
  url: index.url(options),
  method: "get",
});

index.definition = {
  methods: ["get", "head"],
  url: "/photos",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::index
 * @see app/Http/Controllers/PhotoSubmissionController.php:21
 * @route '/photos'
 */
index.url = (options?: RouteQueryOptions) => {
  return index.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::index
 * @see app/Http/Controllers/PhotoSubmissionController.php:21
 * @route '/photos'
 */
index.get = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
  url: index.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::index
 * @see app/Http/Controllers/PhotoSubmissionController.php:21
 * @route '/photos'
 */
index.head = (options?: RouteQueryOptions): RouteDefinition<"head"> => ({
  url: index.url(options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::index
 * @see app/Http/Controllers/PhotoSubmissionController.php:21
 * @route '/photos'
 */
const indexForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: index.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::index
 * @see app/Http/Controllers/PhotoSubmissionController.php:21
 * @route '/photos'
 */
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
  action: index.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::index
 * @see app/Http/Controllers/PhotoSubmissionController.php:21
 * @route '/photos'
 */
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<"get"> => ({
  action: index.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

index.form = indexForm;

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::submissions
 * @see app/Http/Controllers/PhotoSubmissionController.php:111
 * @route '/photos/submissions'
 */
export const submissions = (
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: submissions.url(options),
  method: "get",
});

submissions.definition = {
  methods: ["get", "head"],
  url: "/photos/submissions",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::submissions
 * @see app/Http/Controllers/PhotoSubmissionController.php:111
 * @route '/photos/submissions'
 */
submissions.url = (options?: RouteQueryOptions) => {
  return submissions.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::submissions
 * @see app/Http/Controllers/PhotoSubmissionController.php:111
 * @route '/photos/submissions'
 */
submissions.get = (options?: RouteQueryOptions): RouteDefinition<"get"> => ({
  url: submissions.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::submissions
 * @see app/Http/Controllers/PhotoSubmissionController.php:111
 * @route '/photos/submissions'
 */
submissions.head = (options?: RouteQueryOptions): RouteDefinition<"head"> => ({
  url: submissions.url(options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::submissions
 * @see app/Http/Controllers/PhotoSubmissionController.php:111
 * @route '/photos/submissions'
 */
const submissionsForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: submissions.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::submissions
 * @see app/Http/Controllers/PhotoSubmissionController.php:111
 * @route '/photos/submissions'
 */
submissionsForm.get = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: submissions.url(options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::submissions
 * @see app/Http/Controllers/PhotoSubmissionController.php:111
 * @route '/photos/submissions'
 */
submissionsForm.head = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: submissions.url({
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

submissions.form = submissionsForm;

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::store
 * @see app/Http/Controllers/PhotoSubmissionController.php:130
 * @route '/photos/upload'
 */
export const store = (
  options?: RouteQueryOptions,
): RouteDefinition<"post"> => ({
  url: store.url(options),
  method: "post",
});

store.definition = {
  methods: ["post"],
  url: "/photos/upload",
} satisfies RouteDefinition<["post"]>;

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::store
 * @see app/Http/Controllers/PhotoSubmissionController.php:130
 * @route '/photos/upload'
 */
store.url = (options?: RouteQueryOptions) => {
  return store.definition.url + queryParams(options);
};

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::store
 * @see app/Http/Controllers/PhotoSubmissionController.php:130
 * @route '/photos/upload'
 */
store.post = (options?: RouteQueryOptions): RouteDefinition<"post"> => ({
  url: store.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::store
 * @see app/Http/Controllers/PhotoSubmissionController.php:130
 * @route '/photos/upload'
 */
const storeForm = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: store.url(options),
  method: "post",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::store
 * @see app/Http/Controllers/PhotoSubmissionController.php:130
 * @route '/photos/upload'
 */
storeForm.post = (
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: store.url(options),
  method: "post",
});

store.form = storeForm;

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::download
 * @see app/Http/Controllers/PhotoSubmissionController.php:201
 * @route '/photos/{submission}/download'
 */
export const download = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: download.url(args, options),
  method: "get",
});

download.definition = {
  methods: ["get", "head"],
  url: "/photos/{submission}/download",
} satisfies RouteDefinition<["get", "head"]>;

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::download
 * @see app/Http/Controllers/PhotoSubmissionController.php:201
 * @route '/photos/{submission}/download'
 */
download.url = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { submission: args };
  }

  if (typeof args === "object" && !Array.isArray(args) && "id" in args) {
    args = { submission: args.id };
  }

  if (Array.isArray(args)) {
    args = {
      submission: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    submission:
      typeof args.submission === "object"
        ? args.submission.id
        : args.submission,
  };

  return (
    download.definition.url
      .replace("{submission}", parsedArgs.submission.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::download
 * @see app/Http/Controllers/PhotoSubmissionController.php:201
 * @route '/photos/{submission}/download'
 */
download.get = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
): RouteDefinition<"get"> => ({
  url: download.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::download
 * @see app/Http/Controllers/PhotoSubmissionController.php:201
 * @route '/photos/{submission}/download'
 */
download.head = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
): RouteDefinition<"head"> => ({
  url: download.url(args, options),
  method: "head",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::download
 * @see app/Http/Controllers/PhotoSubmissionController.php:201
 * @route '/photos/{submission}/download'
 */
const downloadForm = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: download.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::download
 * @see app/Http/Controllers/PhotoSubmissionController.php:201
 * @route '/photos/{submission}/download'
 */
downloadForm.get = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: download.url(args, options),
  method: "get",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::download
 * @see app/Http/Controllers/PhotoSubmissionController.php:201
 * @route '/photos/{submission}/download'
 */
downloadForm.head = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"get"> => ({
  action: download.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "HEAD",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "get",
});

download.form = downloadForm;

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::approve
 * @see app/Http/Controllers/PhotoSubmissionController.php:85
 * @route '/photos/{submission}/approve'
 */
export const approve = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: approve.url(args, options),
  method: "patch",
});

approve.definition = {
  methods: ["patch"],
  url: "/photos/{submission}/approve",
} satisfies RouteDefinition<["patch"]>;

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::approve
 * @see app/Http/Controllers/PhotoSubmissionController.php:85
 * @route '/photos/{submission}/approve'
 */
approve.url = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { submission: args };
  }

  if (typeof args === "object" && !Array.isArray(args) && "id" in args) {
    args = { submission: args.id };
  }

  if (Array.isArray(args)) {
    args = {
      submission: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    submission:
      typeof args.submission === "object"
        ? args.submission.id
        : args.submission,
  };

  return (
    approve.definition.url
      .replace("{submission}", parsedArgs.submission.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::approve
 * @see app/Http/Controllers/PhotoSubmissionController.php:85
 * @route '/photos/{submission}/approve'
 */
approve.patch = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: approve.url(args, options),
  method: "patch",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::approve
 * @see app/Http/Controllers/PhotoSubmissionController.php:85
 * @route '/photos/{submission}/approve'
 */
const approveForm = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: approve.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::approve
 * @see app/Http/Controllers/PhotoSubmissionController.php:85
 * @route '/photos/{submission}/approve'
 */
approveForm.patch = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: approve.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

approve.form = approveForm;

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::decline
 * @see app/Http/Controllers/PhotoSubmissionController.php:98
 * @route '/photos/{submission}/decline'
 */
export const decline = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: decline.url(args, options),
  method: "patch",
});

decline.definition = {
  methods: ["patch"],
  url: "/photos/{submission}/decline",
} satisfies RouteDefinition<["patch"]>;

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::decline
 * @see app/Http/Controllers/PhotoSubmissionController.php:98
 * @route '/photos/{submission}/decline'
 */
decline.url = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
) => {
  if (typeof args === "string" || typeof args === "number") {
    args = { submission: args };
  }

  if (typeof args === "object" && !Array.isArray(args) && "id" in args) {
    args = { submission: args.id };
  }

  if (Array.isArray(args)) {
    args = {
      submission: args[0],
    };
  }

  args = applyUrlDefaults(args);

  const parsedArgs = {
    submission:
      typeof args.submission === "object"
        ? args.submission.id
        : args.submission,
  };

  return (
    decline.definition.url
      .replace("{submission}", parsedArgs.submission.toString())
      .replace(/\/+$/, "") + queryParams(options)
  );
};

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::decline
 * @see app/Http/Controllers/PhotoSubmissionController.php:98
 * @route '/photos/{submission}/decline'
 */
decline.patch = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
): RouteDefinition<"patch"> => ({
  url: decline.url(args, options),
  method: "patch",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::decline
 * @see app/Http/Controllers/PhotoSubmissionController.php:98
 * @route '/photos/{submission}/decline'
 */
const declineForm = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: decline.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

/**
 * @see \App\Http\Controllers\PhotoSubmissionController::decline
 * @see app/Http/Controllers/PhotoSubmissionController.php:98
 * @route '/photos/{submission}/decline'
 */
declineForm.patch = (
  args:
    | { submission: string | number | { id: string | number } }
    | [submission: string | number | { id: string | number }]
    | string
    | number
    | { id: string | number },
  options?: RouteQueryOptions,
): RouteFormDefinition<"post"> => ({
  action: decline.url(args, {
    [options?.mergeQuery ? "mergeQuery" : "query"]: {
      _method: "PATCH",
      ...(options?.query ?? options?.mergeQuery ?? {}),
    },
  }),
  method: "post",
});

decline.form = declineForm;

const PhotoSubmissionController = {
  dashboard,
  index,
  submissions,
  store,
  download,
  approve,
  decline,
};

export default PhotoSubmissionController;
