import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../../../wayfinder'
/**
* @see \App\Http\Controllers\CookieConsentController::accept
* @see app/Http/Controllers/CookieConsentController.php:13
* @route '/cookie-consent/accept'
*/
export const accept = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(options),
    method: 'post',
})

accept.definition = {
    methods: ["post"],
    url: '/cookie-consent/accept',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\CookieConsentController::accept
* @see app/Http/Controllers/CookieConsentController.php:13
* @route '/cookie-consent/accept'
*/
accept.url = (options?: RouteQueryOptions) => {
    return accept.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\CookieConsentController::accept
* @see app/Http/Controllers/CookieConsentController.php:13
* @route '/cookie-consent/accept'
*/
accept.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: accept.url(options),
    method: 'post',
})

const CookieConsentController = { accept }

export default CookieConsentController