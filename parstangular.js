var parseConfig = {};
parseConfig.appId = '<<YOUR-APP-ID>>';
parseConfig.apiKey = '<<YOUR-REST-API-KEY>>';
parseConfig.baseUrl = 'https://api.parse.com/1/';

var parstangularModule = angular.module("parstangular", ['restangular']);

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

parseApiFactory = parstangularModule.factory('parseApi', ['Restangular', 'parseConfig',

    function (Restangular, parseConfig) {

        return Restangular.withConfig(function (RestangularConfigurer) {
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
    }]);

parseClassFactory = parstangularModule.factory('parseClasses', ['parseApi',

    function (parseApi) {

        return parseApi.all('classes');

        }]);
