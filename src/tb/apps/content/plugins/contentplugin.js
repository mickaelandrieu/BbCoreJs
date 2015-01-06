
(function () {

    define(['tb.core.Api'], function (Core) {

        return {

            load: function (pluginName, req, onload, config) {
                /*deal with namespaces here */
                var namespaceInfos = Core.config('plugins:namespace'),
                    namespace = namespaceInfos.core,
                    pluginPaths = pluginName.split(':'),
                    namespace,
                    pluginInfos,
                    pluginFullPath;

                if ( pluginPaths.length > 1) {
                    namespace = namespaceInfos[pluginPaths[0]],
                    pluginName = pluginPaths[1];
                } else {
                    pluginName = pluginPaths[0];
                }
                pluginFullPath = namespace+pluginName+'.plugin';
                /* plugin is registered here */
                pluginInfos = {name : pluginName, namespace : namespace, path : pluginFullPath };
                req([pluginFullPath], function () {
                    Core.Mediator.publish('on:pluginManager:loading', pluginInfos);
                    onload(pluginInfos);
                }, function() {
                    Core.Mediator.publish('on:pluginManager:loadingErrors', pluginInfos);
                    onload.error(pluginInfos);
                });
            }
        }


    });

} ());