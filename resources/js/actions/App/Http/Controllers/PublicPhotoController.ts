import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\PublicPhotoController::index
* @see app/Http/Controllers/PublicPhotoController.php:21
* @route '/submit-photo'
*/
export const index = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

index.definition = {
    methods: ["get","head"],
    url: '/submit-photo',
} satisfies RouteDefinition<["get","head"]>

/**
* @see \App\Http\Controllers\PublicPhotoController::index
* @see app/Http/Controllers/PublicPhotoController.php:21
* @route '/submit-photo'
*/
index.url = (options?: RouteQueryOptions) => {
    return index.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicPhotoController::index
* @see app/Http/Controllers/PublicPhotoController.php:21
* @route '/submit-photo'
*/
index.get = (options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: index.url(options),
    method: 'get',
})

/**
* @see \App\Http\Controllers\PublicPhotoController::index
* @see app/Http/Controllers/PublicPhotoController.php:21
* @route '/submit-photo'
*/
index.head = (options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: index.url(options),
    method: 'head',
})

/**
* @see \App\Http\Controllers\PublicPhotoController::store
* @see app/Http/Controllers/PublicPhotoController.php:41
* @route '/submit-photo'
*/
export const store = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

store.definition = {
    methods: ["post"],
    url: '/submit-photo',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\PublicPhotoController::store
* @see app/Http/Controllers/PublicPhotoController.php:41
* @route '/submit-photo'
*/
store.url = (options?: RouteQueryOptions) => {
    return store.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\PublicPhotoController::store
* @see app/Http/Controllers/PublicPhotoController.php:41
* @route '/submit-photo'
*/
store.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: store.url(options),
    method: 'post',
})

const PublicPhotoController = { index, store }

export default PublicPhotoController