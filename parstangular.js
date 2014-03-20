/**
 * @license Parstangular v0.1.0
 * (c) 2014 Arcnovus, Inc. http://parstangular.com
 * License: MIT
 *
 * Parstangular is a simple Restangular wrapper for the Parse.com REST API.
 */

/** 
* This is an object in which to place your Parse.com configuration settings. 
* Make sure to put your Parse App Id and Rest Api Key below. 
* You can probably leave the baseUrl property as is, unless Parse 
* has introduced a new version of their API that you intend to use.
*/
var parseConfig = {};
parseConfig.appId = 'YOUR-APP-ID-GOES-HERE';
parseConfig.apiKey = 'YOUR-REST-API-KEY-GOES-HERE';
parseConfig.baseUrl = 'https://api.parse.com/1/';


var parstangularModule = angular.module("ParseService", ['restangular']);

parstangularModule.constant("parseConfig", parseConfig);

parstangularModule.config(function (RestangularProvider) {

    // Now let's configure the response extractor for each request
    RestangularProvider.setResponseExtractor(function (response, operation, what, url) {
        // This is a get for a list
        var newResponse;
        if (operation === "getList") {
            // Here we're returning an Array which has one special property metadata with our extra information
            newResponse = response.results;
        }
        return newResponse;
    });

});

var parseApiFactory = parstangularModule.factory('parseApi', ['Restangular', 'parseConfig',

    function (Restangular, parseConfig) {

        var newApi = Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(parseConfig.baseUrl);
            RestangularConfigurer.setDefaultHeaders({
                'X-Parse-Application-Id': parseConfig.appId,
                'X-Parse-REST-API-Key': parseConfig.apiKey
            });
            RestangularConfigurer.setRestangularFields({
                id: "objectId",
                createdAt: "createdAt",
                updatedAt: "updatedAt"
            });

        });

        //        newApi.prototype.parseObject = function (objName) {
        //
        //            return this.all("classes").all(objName);
        //        };
        newApi.Class = function (objName) {
            return this.all('classes').all(objName);
        };

//alert(newApi.restangularizeCollection);

        return newApi;
    }]);

var parseClassFactory = parstangularModule.factory('parseClasses', ['parseApi',

    function (parseApi) {

        return parseApi.all('classes');

        }]);