'use strict';

app.factory('ordersService', ['$http',
    function ($http) {

        // test client from tutorial
        //var serviceBase = 'http://localhost:54989/';

        // MH client
        var serviceBase = 'http://localhost:53056/';

        var ordersServiceFactory = {};

        var _getOrders = function () {

            return $http.get(serviceBase + 'api/values')
                .then(function (results) {
                    // alert(results);
                    return results;
                });
        };

        ordersServiceFactory.getOrders = _getOrders;

        return ordersServiceFactory;
    }
]);