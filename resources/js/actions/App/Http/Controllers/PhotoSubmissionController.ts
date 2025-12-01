import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PhotoSubmissionController::dashboard
* @see app/Http/Controllers/PhotoSubmissionController.php:18
* @route '/dashboard'
*/
export const dashboard = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

dashboard.definition = {
    methods: ["get","head"],
    url: '/dashboard',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PhotoSubmissionController::dashboard
* @see app/Http/Controllers/PhotoSubmissionController.php:18
* @route '/dashboard'
*/
dashboard.url = (options?: RouteQueryOptions) => {
    return dashboard.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoSubmissionController::dashboard
* @see app/Http/Controllers/PhotoSubmissionController.php:18
* @route '/dashboard'
*/
dashboard.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: dashboard.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::dashboard
* @see app/Http/Controllers/PhotoSubmissionController.php:18
* @route '/dashboard'
*/
dashboard.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: dashboard.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::submissions
* @see app/Http/Controllers/PhotoSubmissionController.php:88
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
* @see app/Http/Controllers/PhotoSubmissionController.php:88
* @route '/photos/submissions'
*/
submissions.url = (options?: RouteQueryOptions) => {
    return submissions.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoSubmissionController::submissions
* @see app/Http/Controllers/PhotoSubmissionController.php:88
* @route '/photos/submissions'
*/
submissions.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: submissions.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::submissions
* @see app/Http/Controllers/PhotoSubmissionController.php:88
* @route '/photos/submissions'
*/
submissions.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: submissions.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::download
* @see app/Http/Controllers/PhotoSubmissionController.php:108
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
* @see app/Http/Controllers/PhotoSubmissionController.php:108
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
* @see app/Http/Controllers/PhotoSubmissionController.php:108
* @route '/photos/{submission}/download'
*/
download.get = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: download.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::download
* @see app/Http/Controllers/PhotoSubmissionController.php:108
* @route '/photos/{submission}/download'
*/
download.head = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: download.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::approve
* @see app/Http/Controllers/PhotoSubmissionController.php:62
* @route '/photos/{submission}/approve'
*/
export const approve = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

approve.definition = {
    methods: ["patch"],
    url: '/photos/{submission}/approve',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PhotoSubmissionController::approve
* @see app/Http/Controllers/PhotoSubmissionController.php:62
* @route '/photos/{submission}/approve'
*/
approve.url = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return approve.definition.url
            .replace('{submission}', parsedArgs.submission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoSubmissionController::approve
* @see app/Http/Controllers/PhotoSubmissionController.php:62
* @route '/photos/{submission}/approve'
*/
approve.patch = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: approve.url(args, options),
    method: 'patch',
})

/**
* @see \App\Http\Controllers\PhotoSubmissionController::decline
* @see app/Http/Controllers/PhotoSubmissionController.php:75
* @route '/photos/{submission}/decline'
*/
export const decline = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: decline.url(args, options),
    method: 'patch',
})

decline.definition = {
    methods: ["patch"],
    url: '/photos/{submission}/decline',
} satisfies RouteDefinition<["patch"]>

/**
* @see \App\Http\Controllers\PhotoSubmissionController::decline
* @see app/Http/Controllers/PhotoSubmissionController.php:75
* @route '/photos/{submission}/decline'
*/
decline.url = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
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

    return decline.definition.url
            .replace('{submission}', parsedArgs.submission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PhotoSubmissionController::decline
* @see app/Http/Controllers/PhotoSubmissionController.php:75
* @route '/photos/{submission}/decline'
*/
decline.patch = (args: { submission: string | number | { id: string | number } } | [submission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'patch'> => ({
    url: decline.url(args, options),
    method: 'patch',
})

const PhotoSubmissionController = { dashboard, submissions, download, approve, decline }

export default PhotoSubmissionController