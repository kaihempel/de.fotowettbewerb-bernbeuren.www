import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicGalleryController::index
* @see app/Http/Controllers/PublicGalleryController.php:20
* @route '/gallery'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/gallery',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicGalleryController::index
* @see app/Http/Controllers/PublicGalleryController.php:20
* @route '/gallery'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicGalleryController::index
* @see app/Http/Controllers/PublicGalleryController.php:20
* @route '/gallery'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::index
* @see app/Http/Controllers/PublicGalleryController.php:20
* @route '/gallery'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::index
* @see app/Http/Controllers/PublicGalleryController.php:20
* @route '/gallery'
*/
const indexForm = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::index
* @see app/Http/Controllers/PublicGalleryController.php:20
* @route '/gallery'
*/
indexForm.get = (options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::index
* @see app/Http/Controllers/PublicGalleryController.php:20
* @route '/gallery'
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
* @see \App\Http\Controllers\PublicGalleryController::show
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/gallery/{photoSubmission}'
*/
export const show = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

show.definition = {
    methods: ["get","head"],
    url: '/gallery/{photoSubmission}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicGalleryController::show
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/gallery/{photoSubmission}'
*/
show.url = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { photoSubmission: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { photoSubmission: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            photoSubmission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        photoSubmission: typeof args.photoSubmission === 'object'
        ? args.photoSubmission.id
        : args.photoSubmission,
    }

    return show.definition.url
            .replace('{photoSubmission}', parsedArgs.photoSubmission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicGalleryController::show
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/gallery/{photoSubmission}'
*/
show.get = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::show
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/gallery/{photoSubmission}'
*/
show.head = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::show
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/gallery/{photoSubmission}'
*/
const showForm = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::show
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/gallery/{photoSubmission}'
*/
showForm.get = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::show
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/gallery/{photoSubmission}'
*/
showForm.head = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: show.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

show.form = showForm

/**
* @see \App\Http\Controllers\PublicGalleryController::vote
* @see app/Http/Controllers/PublicGalleryController.php:87
* @route '/gallery/{photoSubmission}/vote'
*/
export const vote = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: vote.url(args, options),
    method: 'post',
})

vote.definition = {
    methods: ["post"],
    url: '/gallery/{photoSubmission}/vote',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PublicGalleryController::vote
* @see app/Http/Controllers/PublicGalleryController.php:87
* @route '/gallery/{photoSubmission}/vote'
*/
vote.url = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { photoSubmission: args }
    }

    if (typeof args === 'object' && !Array.isArray(args) && 'id' in args) {
        args = { photoSubmission: args.id }
    }

    if (Array.isArray(args)) {
        args = {
            photoSubmission: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        photoSubmission: typeof args.photoSubmission === 'object'
        ? args.photoSubmission.id
        : args.photoSubmission,
    }

    return vote.definition.url
            .replace('{photoSubmission}', parsedArgs.photoSubmission.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicGalleryController::vote
* @see app/Http/Controllers/PublicGalleryController.php:87
* @route '/gallery/{photoSubmission}/vote'
*/
vote.post = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: vote.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::vote
* @see app/Http/Controllers/PublicGalleryController.php:87
* @route '/gallery/{photoSubmission}/vote'
*/
const voteForm = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: vote.url(args, options),
    method: 'post',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::vote
* @see app/Http/Controllers/PublicGalleryController.php:87
* @route '/gallery/{photoSubmission}/vote'
*/
voteForm.post = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteFormDefinition<'post'> => ({
    action: vote.url(args, options),
    method: 'post',
})

vote.form = voteForm

const PublicGalleryController = { index, show, vote }

export default PublicGalleryController