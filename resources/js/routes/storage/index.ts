import { queryParams, type RouteQueryOptions, type RouteDefinition, type RouteFormDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see routes/web.php:38
* @route '/storage/{path}'
*/
export const publicMethod = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicMethod.url(args, options),
    method: 'get',
})

publicMethod.definition = {
    methods: ["get","head"],
    url: '/storage/{path}',
} satisfies RouteDefinition<["get","head"]>

/**
* @see routes/web.php:38
* @route '/storage/{path}'
*/
publicMethod.url = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions) => {
    if (typeof args === 'string' || typeof args === 'number') {
        args = { path: args }
    }

    if (Array.isArray(args)) {
        args = {
            path: args[0],
        }
    }

    args = applyUrlDefaults(args)

    const parsedArgs = {
        path: args.path,
    }

    return publicMethod.definition.url
            .replace('{path}', parsedArgs.path.toString())
            .replace(/\/+$/, '') + queryParams(options)
}

/**
* @see routes/web.php:38
* @route '/storage/{path}'
*/
publicMethod.get = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicMethod.url(args, options),
    method: 'get',
})

/**
* @see routes/web.php:38
* @route '/storage/{path}'
*/
publicMethod.head = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: publicMethod.url(args, options),
    method: 'head',
})

/**
* @see routes/web.php:38
* @route '/storage/{path}'
*/
const publicMethodForm = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: publicMethod.url(args, options),
    method: 'get',
})

/**
* @see routes/web.php:38
* @route '/storage/{path}'
*/
publicMethodForm.get = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: publicMethod.url(args, options),
    method: 'get',
})

/**
* @see routes/web.php:38
* @route '/storage/{path}'
*/
publicMethodForm.head = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteFormDefinition<'get'> => ({
    action: publicMethod.url(args, {
        [options?.mergeQuery ? 'mergeQuery' : 'query']: {
            _method: 'HEAD',
            ...(options?.query ?? options?.mergeQuery ?? {}),
        }
    }),
    method: 'get',
})

publicMethod.form = publicMethodForm

const storage = {
    public: Object.assign(publicMethod, publicMethod),
}

export default storage