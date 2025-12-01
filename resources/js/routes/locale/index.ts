import { queryParams, type RouteQueryOptions, type RouteDefinition } from './../../wayfinder'
/**
* @see \App\Http\Controllers\LocaleController::update
* @see app/Http/Controllers/LocaleController.php:17
* @route '/locale'
*/
export const update = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

update.definition = {
    methods: ["post"],
    url: '/locale',
} satisfies RouteDefinition<["post"]>

/**
* @see \App\Http\Controllers\LocaleController::update
* @see app/Http/Controllers/LocaleController.php:17
* @route '/locale'
*/
update.url = (options?: RouteQueryOptions) => {
    return update.definition.url + queryParams(options)
}

/**
* @see \App\Http\Controllers\LocaleController::update
* @see app/Http/Controllers/LocaleController.php:17
* @route '/locale'
*/
update.post = (options?: RouteQueryOptions): RouteDefinition<'post'> => ({
    url: update.url(options),
    method: 'post',
})

const locale = {
    update: Object.assign(update, update),
}

export default locale