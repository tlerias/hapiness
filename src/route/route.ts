import { extractMetadataByDecorator } from '../util';
import { CoreRoute, CoreModule, Route, DependencyInjection } from '../core';
import { Type } from '../externals/injection-js/facade/type';
import * as Hoek from 'hoek';
import * as Boom from 'boom';

interface InternalType {
    route: Route;
    token: Type<any>;
}

export interface ValidateConfig {
    params?: any;
    query?: any;
    payload?: any;
    response?: any;
}

export interface RouteConfig {
    description?: string;
    notes?: string;
    tags?: string[];
    validate?: ValidateConfig;
    auth?: any;
    bind?: any;
    cache?: any;
    compression?: any;
    cors?: any;
    ext?: any;
    files?: any;
    id?: any;
    json?: any;
    jsonp?: any;
    log?: any;
    plugins?: any;
    pre?: any;
    response?: any;
    security?: any;
    state?: any;
    timeout?: any;
}

export class RouteBuilder {

    /**
     * Helper to extract metadata
     * @property {string} decoratorName
     */
    private static decoratorName = 'Route';

    /**
     * Entrypoint to build a CoreRoute
     * Get the metadata and build the
     * route instance
     *
     * @param  {CoreModule} module
     * @returns CoreRoute
     */
    public static buildRoute(module: CoreModule): CoreRoute[] {
        Hoek.assert(!!module, Boom.create(500, 'Please provide a module'));
        const routes = this.metadataFromDeclarations(module.declarations)
            .map(data => this.coreRouteFromMetadata(data.route, data.token, module));
        return routes;
    }

    /**
     * Instantiate a new Route
     * with its own DI/request
     *
     * @param  {CoreRoute} route
     * @returns Type
     */
    public static instantiateRouteAndDI(route: CoreRoute): Type<any> {
        const di = DependencyInjection.createAndResolve(route.providers
            .map(p => Object.assign(<Type<any>>{}, p)), route.module.di
        );
        return DependencyInjection.instantiateComponent(<Type<any>>route.token, di);
    }

    /**
     * Transform metadata to instance CoreRoute
     *
     * @param  {Route} data
     * @returns CoreRoute
     */
    private static coreRouteFromMetadata(data: Route, token: Type<any>, module: CoreModule): CoreRoute {
        const providers = data.providers || [];
        return {
            token,
            module,
            config: data.config,
            path: data.path,
            method: data.method,
            providers: providers.map((p: any) => !!p.provide ? p : {provide: p, useClass: p})
        };
    }

    /**
     * Extract metadata filtered by route
     * from the declarations provided
     *
     * @param  {Type<any>} declarations
     * @returns Route
     */
    private static metadataFromDeclarations(declarations: Type<any> | Type<any>[]): InternalType[] {
        return [].concat(declarations)
            .map(t => {
                return {
                    route: <Route>extractMetadataByDecorator(t, this.decoratorName),
                    token: <Type<any>>t
                };
            })
            .filter(t => !!t.route);
    }

}
