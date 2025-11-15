import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PhotoSubmissionController::index
* @see app/Http/Controllers/PhotoSubmissionController.php:21
* @route '/photos'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/photos',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PhotoSubmissionController::index
* @see app/Http/Controllers/PhotoSubmissionController.php:21
* @route '/photos'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoSubmissionController::index
* @see app/Http/Controllers/PhotoSubmissionController.php:21
* @route '/photos'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::index
* @see app/Http/Controllers/PhotoSubmissionController.php:21
* @route '/photos'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::index
* @see app/Http/Controllers/PhotoSubmissionController.php:21
* @route '/photos'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::index
* @see app/Http/Controllers/PhotoSubmissionController.php:21
* @route '/photos'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::index
* @see app/Http/Controllers/PhotoSubmissionController.php:21
* @route '/photos'
*/
indexForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

index.form = indexForm

/**
* @see \App\Http\Controllers\PhotoSubmissionController::submissions
* @see app/Http/Controllers/PhotoSubmissionController.php:40
* @route '/photos/submissions'
*/
export const submissions = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: submissions.url(options),
    method: 'get',
})

submissions.definition = {
    methods: ["get","head"],
    url: '/photos/submissions',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PhotoSubmissionController::submissions
* @see app/Http/Controllers/PhotoSubmissionController.php:40
* @route '/photos/submissions'
*/
submissions.url = (options?: RouteQueryOptions) => {
    return submissions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoSubmissionController::submissions
* @see app/Http/Controllers/PhotoSubmissionController.php:40
* @route '/photos/submissions'
*/
submissions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: submissions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::submissions
* @see app/Http/Controllers/PhotoSubmissionController.php:40
* @route '/photos/submissions'
*/
submissions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: submissions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::submissions
* @see app/Http/Controllers/PhotoSubmissionController.php:40
* @route '/photos/submissions'
*/
const submissionsForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: submissions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::submissions
* @see app/Http/Controllers/PhotoSubmissionController.php:40
* @route '/photos/submissions'
*/
submissionsForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: submissions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::submissions
* @see app/Http/Controllers/PhotoSubmissionController.php:40
* @route '/photos/submissions'
*/
submissionsForm.head = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: submissions.url({
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

submissions.form = submissionsForm

/**
* @see \App\Http\Controllers\PhotoSubmissionController::store
* @see app/Http/Controllers/PhotoSubmissionController.php:59
* @route '/photos/upload'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/photos/upload',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PhotoSubmissionController::store
* @see app/Http/Controllers/PhotoSubmissionController.php:59
* @route '/photos/upload'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoSubmissionController::store
* @see app/Http/Controllers/PhotoSubmissionController.php:59
* @route '/photos/upload'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::store
* @see app/Http/Controllers/PhotoSubmissionController.php:59
* @route '/photos/upload'
*/
const storeForm = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::store
* @see app/Http/Controllers/PhotoSubmissionController.php:59
* @route '/photos/upload'
*/
storeForm.post = (options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: store.url(options),
    method: 'post',
})

store.form = storeForm

/**
* @see \App\Http\Controllers\PhotoSubmissionController::download
* @see app/Http/Controllers/PhotoSubmissionController.php:139
* @route '/photos/{submission}/download'
*/
export const download = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

download.definition = {
    methods: ["get","head"],
    url: '/photos/{submission}/download',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PhotoSubmissionController::download
* @see app/Http/Controllers/PhotoSubmissionController.php:139
* @route '/photos/{submission}/download'
*/
download.url = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { submission: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { submission: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            submission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        submission: typeof args.submission === 'object'
        ? args.submission.id
        : args.submission,
    }

    return download.definition.url
            .replace('{submission}', parsedArgs.submission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoSubmissionController::download
* @see app/Http/Controllers/PhotoSubmissionController.php:139
* @route '/photos/{submission}/download'
*/
download.get = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::download
* @see app/Http/Controllers/PhotoSubmissionController.php:139
* @route '/photos/{submission}/download'
*/
download.head = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::download
* @see app/Http/Controllers/PhotoSubmissionController.php:139
* @route '/photos/{submission}/download'
*/
const downloadForm = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::download
* @see app/Http/Controllers/PhotoSubmissionController.php:139
* @route '/photos/{submission}/download'
*/
downloadForm.get = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::download
* @see app/Http/Controllers/PhotoSubmissionController.php:139
* @route '/photos/{submission}/download'
*/
downloadForm.head = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: download.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

download.form = downloadForm

const PhotoSubmissionController = { index, submissions, store, download }

export default PhotoSubmissionController