define(['component!datastore', 'jsclass'], function (DataStore) {
    'use strict';
    var restDataStore = new DataStore.RestDataStore({
        resourceEndpoint: 'classcontent'
    });

    restDataStore.addFilter("byCategory", function (value, restParams) {
        restParams.criterias.category = value;
        return restParams;
    });

    restDataStore.addFilter("byClasscontent", function (value, restParams) {
        restParams.criterias.uid = value;
        return restParams;
    });

    restDataStore.addFilter("byTitle", function (value, restParams) {
        restParams.criterias.title = value;
        return restParams;
    });

    restDataStore.addFilter("byBeforeDate", function (value, restParams) {
        restParams.criterias.beforeDate = value;
        return restParams;
    });

    restDataStore.addFilter("byAfterDate", function (value, restParams) {
        restParams.criterias.afterDate = value;
        return restParams;
    });

    return restDataStore;
});