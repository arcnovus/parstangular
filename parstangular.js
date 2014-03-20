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
* You can probably leave the BASE_URL property as is, unless Parse 
* has introduced a new version of their API that you intend to use.
*/
var parseConfig = {};
parseConfig.APP_ID = 'YOUR-APP-ID-GOES-HERE';
parseConfig.API_KEY = 'YOUR-REST-API-KEY-GOES-HERE';
parseConfig.BASE_URL = 'https://api.parse.com/1/';

/** The ParseService is the main module that houses our Parstangular goodness **/
var ParseApiModule = angular.module("ParseApi", ['restangular']);

/** Throw our Parse configuration object into the mix  **/
ParseApiModule.constant("PARSE_CONFIG", parseConfig);
 
/** Configure the RestangularProvider **/
ParseApiModule.config(function (RestangularProvider) {

    // Now let's configure the response extractor for each request
    RestangularProvider.setResponseExtractor(function (response, operation, what, url) {
        // This is a get for a list
        var newResponse;
        if (operation === "getList") {
            // Here we're returning an Array which has one special property 'results' with our extra information
            newResponse = response.results;
        }
        return newResponse;
    });

});

/** A factory that returns Parsified version of Restangular **/
ParseApiModule.factory('Parstangular', ['Restangular', 'PARSE_CONFIG',

    function (Restangular, parseConfig) {

        var newApi = Restangular.withConfig(function (RestangularConfigurer) {
            RestangularConfigurer.setBaseUrl(parseConfig.BASE_URL);
            RestangularConfigurer.setDefaultHeaders({
                'X-Parse-Application-Id': parseConfig.APP_ID,
                'X-Parse-REST-API-Key': parseConfig.API_KEY
            });
            RestangularConfigurer.setRestangularFields({
                id: "objectId",
                createdAt: "createdAt",
                updatedAt: "updatedAt"
            });

        });

        /** A helper function to reference Parse classes **/
        newApi.Class = function (objName) {
            return this.all('classes').all(objName);
        };



        return newApi;
    }]);