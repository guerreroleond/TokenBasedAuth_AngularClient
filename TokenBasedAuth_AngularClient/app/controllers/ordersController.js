'use strict';

app.controller('ordersController', ['$scope', 'ordersService',
    function ($scope, ordersService) {

        $scope.values = [];

        ordersService.getOrders()
            .then(function (results) {
                alert(results.data);
                $scope.values = results.data;
            }, function (error) {
                alert(error.data.message);
            });
    }
]);