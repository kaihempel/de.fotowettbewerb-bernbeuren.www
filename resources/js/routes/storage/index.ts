import { queryParams, type RouteQueryOptions, type RouteDefinition, applyUrlDefaults } from './../../wayfinder'
/**
* @see routes/web.php:46
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
* @see routes/web.php:46
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
* @see routes/web.php:46
* @route '/storage/{path}'
*/
publicMethod.get = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'get'> => ({
    url: publicMethod.url(args, options),
    method: 'get',
})

/**
* @see routes/web.php:46
* @route '/storage/{path}'
*/
publicMethod.head = (args: { path: string | number } | [path: string | number ] | string | number, options?: RouteQueryOptions): RouteDefinition<'head'> => ({
    url: publicMethod.url(args, options),
    method: 'head',
})

const storage = {
    public: Object.assign(publicMethod, publicMethod),
}

export default storage