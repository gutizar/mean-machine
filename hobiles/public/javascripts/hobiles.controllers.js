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
	}]).
	controller('OrderCtrl', ['$scope', 'orders', 'order', function ($scope, orders, order) {
		$scope.order = order;

		$scope.addComment = function () {
			if (!$scope.body || !$scope.createdBy) {
				// Return some validation error
				return;
			}
			orders.addComment($scope.order, {
				body: $scope.body, createdBy: $scope.createdBy
			});
			$scope.body = '';
			$scope.createdBy = '';
		};

		$scope.toggle = function () {
			orders.toggle($scope.order);
		};
	}]);
