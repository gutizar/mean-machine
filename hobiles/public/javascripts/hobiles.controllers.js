'use strict';

/**
 * hobiles.controllers Module
 *
 * Description
 */
angular.module('hobiles.controllers', []).
	controller('HomeCtrl', ['$scope', 'orders', function ($scope, orders) {
		$scope.message = 'Hello, World!';
		$scope.orders = orders.orders;
	}]);
