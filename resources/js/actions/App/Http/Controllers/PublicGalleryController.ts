import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicGalleryController::gallery
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/'
*/
const gallery980bb49ee7ae63891f1d891d2fbcf1c9 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: gallery980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

gallery980bb49ee7ae63891f1d891d2fbcf1c9.definition = {
    methods: ["get","head"],
    url: '/',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicGalleryController::gallery
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/'
*/
gallery980bb49ee7ae63891f1d891d2fbcf1c9.url = (options?: RouteQueryOptions) => {
    return gallery980bb49ee7ae63891f1d891d2fbcf1c9.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicGalleryController::gallery
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/'
*/
gallery980bb49ee7ae63891f1d891d2fbcf1c9.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: gallery980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::gallery
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/'
*/
gallery980bb49ee7ae63891f1d891d2fbcf1c9.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: gallery980bb49ee7ae63891f1d891d2fbcf1c9.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::gallery
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/gallery'
*/
const galleryc463a1f00bb7b652c89003948f522a19 = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: galleryc463a1f00bb7b652c89003948f522a19.url(options),
    method: 'get',
})

galleryc463a1f00bb7b652c89003948f522a19.definition = {
    methods: ["get","head"],
    url: '/gallery',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicGalleryController::gallery
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/gallery'
*/
galleryc463a1f00bb7b652c89003948f522a19.url = (options?: RouteQueryOptions) => {
    return galleryc463a1f00bb7b652c89003948f522a19.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicGalleryController::gallery
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/gallery'
*/
galleryc463a1f00bb7b652c89003948f522a19.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: galleryc463a1f00bb7b652c89003948f522a19.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::gallery
* @see app/Http/Controllers/PublicGalleryController.php:50
* @route '/gallery'
*/
galleryc463a1f00bb7b652c89003948f522a19.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: galleryc463a1f00bb7b652c89003948f522a19.url(options),
    method: 'head',
})

export const gallery = {
    '/': gallery980bb49ee7ae63891f1d891d2fbcf1c9,
    '/gallery': galleryc463a1f00bb7b652c89003948f522a19,
}

/**
* @see \App\Http\Controllers\PublicGalleryController::index
* @see app/Http/Controllers/PublicGalleryController.php:21
* @route '/gallery/list'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/gallery/list',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicGalleryController::index
* @see app/Http/Controllers/PublicGalleryController.php:21
* @route '/gallery/list'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicGalleryController::index
* @see app/Http/Controllers/PublicGalleryController.php:21
* @route '/gallery/list'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::index
* @see app/Http/Controllers/PublicGalleryController.php:21
* @route '/gallery/list'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::show
* @see app/Http/Controllers/PublicGalleryController.php:75
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
* @see app/Http/Controllers/PublicGalleryController.php:75
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
* @see app/Http/Controllers/PublicGalleryController.php:75
* @route '/gallery/{photoSubmission}'
*/
show.get = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: show.url(args, options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::show
* @see app/Http/Controllers/PublicGalleryController.php:75
* @route '/gallery/{photoSubmission}'
*/
show.head = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: show.url(args, options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicGalleryController::vote
* @see app/Http/Controllers/PublicGalleryController.php:112
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
* @see app/Http/Controllers/PublicGalleryController.php:112
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
* @see app/Http/Controllers/PublicGalleryController.php:112
* @route '/gallery/{photoSubmission}/vote'
*/
vote.post = (args: { photoSubmission: string | number | { id: string | number } } | [photoSubmission: string | number | { id: string | number } ] | string | number | { id: string | number }, options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: vote.url(args, options),
    method: 'post',
})

const PublicGalleryController = { gallery, index, show, vote }

export default PublicGalleryController