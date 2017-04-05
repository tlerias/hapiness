# API Reference

## Getting started

    @Injectable()
    class DataService {
        data(): Observable<any> {
            return Observable.create(obs => {
                obs.next('my-data');
                obs.complete();
            })
        }
    }

    @Route({
        path: '/data',
        method: 'get'
    })
    class DataRoute implements OnGet {
        constructor(private dataService: DataService) {}

        onGet(request, reply) {
            this.dataService.data()
                .subscribe(d => reply(d));
        }
    }

    @HapinessModule({
        version: '1.0.0',
        declaration: [ DataRoute ],
        providers: [ DataService ],
        options: {
            host: '0.0.0.0',
            port: 8080
        }
    })
    class DataModule implements OnStart, OnError {

        constructor(private httpServer: HttpServer) {}

        onStart() {
            console.log('Server started at: ', this.httpServer.info.uri);
        }

        onError(err: Error) {
            console.error(err);
        }

    }

    // Start the server
    Hapiness.bootstrap(DataModule);



## Hapiness
The Hapiness object is used to bootstrap a module as Web Server.

### bootstrap(module)
Bootstrap a module and start the web server.

## HapinessModule
Declare an Hapiness module with the providers, routes and libs.

    @HapinessModule({metadata})
    class MyClass {}

- metadata

    - `version` - module version
    - `options`
        - bootstrapped module : 
            - `host` - server host
            - `port` - http server port
            - `socketPort` - websocket server port
    - `declarations` - Routes | Libs to declare in the module
    - `providers` - Providers to add in the DI
    - `imports` - Modules to import
    - `exports` - Providers to export and will be available in the module that import it

- interfaces
    - `OnStart` - Only for the bootstrapped module, called when the web server is started.
    - `OnError` - Only for the bootstrapped module, it is the error handler.
        - arguments: (error: Error)
    - `OnRegister` - Called when the module is registered
    - `OnModuleResolved` - Called when imported module is resolved
        - arguments: (module: string)

## Route
Declare HTTP routes

    @Route({metadata})
    class MyClass {}

- metadata

    - `path` - route path (/my/path)
    - `method` - can be an array, values: (get, post, put, delete, patch, options)
    - `config` - partially implemented, see [HapiJS Route config](https://hapijs.com/api#route-configuration)
    - `providers` - Providers to add in the request DI, it means at each request a new instance of the provider will be created

- interfaces
    - see request and reply on [HapiJS Docs](https://hapijs.com/api#requests)
    - `OnGet` - Http Get handler
        - arguments: (request, reply)
    - `OnPost` - Http Post handler
        - arguments: (request, reply)
    - `OnPut` - Http Put handler
        - arguments: (request, reply)
    - `OnDelete` - Http Delete handler
        - arguments: (request, reply)
    - `OnPatch` - Http Patch handler
        - arguments: (request, reply)
    - `OnOptions` - Http Options handler
        - arguments: (request, reply)

## Injectable
Declare an injectable provider

    @Injectable()
    class MyService {}

## Lib
Declare an empty component for any use

    @Lib()
    class MyLib {}