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
			if (!$scope.comment || !$scope.comment.body || !$scope.comment.createdBy) {
				return;
			}
			orders.addComment($scope.order, $scope.comment);
		};

		$scope.toggle = function () {
			orders.toggle($scope.order);
		};
	}]);
