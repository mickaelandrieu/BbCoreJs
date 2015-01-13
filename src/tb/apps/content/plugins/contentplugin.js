(function () {
    'use strict';
    define(['tb.core.Api'], function (Core) {
        return {
            load: function (pluginName, req, onload) {
                var namespaceInfos = Core.config('plugins:namespace'),
                    namespace = namespaceInfos.core,
                    pluginPaths = pluginName.split(':'),
                    pname,
                    pluginInfos,
                    pluginFullPath;
                if (pluginPaths.length > 1) {
                    namespace = namespaceInfos[pluginPaths[0]];
                    pname = pluginPaths.pop();
                } else {
                    pname = pluginPaths.shift();
                }
                pluginFullPath = namespace + pluginName + '.plugin';
                /* plugin is registered here */
                pluginInfos = {
                    name: pname,
                    namespace: namespace,
                    path: pluginFullPath
                };
                req([pluginFullPath], function () {
                    Core.Mediator.publish('on:pluginManager:loading', pluginInfos);
                    onload(pluginInfos);
                }, function () {
                    Core.Mediator.publish('on:pluginManager:loadingErrors', pluginInfos);
                    onload.error(pluginInfos);
                });
            }
        };
    });
}());