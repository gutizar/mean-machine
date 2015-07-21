'use strict';

/**
 * hobiles.controllers Module
 *
 * Description
 */
var controllers = angular.module('hobiles.controllers', []);

controllers.controller('HomeCtrl', ['$scope', 'orders', function ($scope, orders) {
	$scope.message = 'Hobiles Order Management';
	$scope.orders = orders.orders;
}]);

controllers.controller('OrderCtrl', ['$scope', 'orders', 'order', 'comments', 'dispatch', 'payment',
	function ($scope, orders, order, comments, dispatch, payment) {
		$scope.order = order;
		$scope.dispatch = dispatch;
		$scope.payment = payment;

		$scope.updateOrder = function (input) {
			$scope.errors = {};

			orders.update(input).success(function (data) {
				$scope.updateStatus = data;
			}).error(function (err) {
				if (err.errors) {
					angular.forEach(err.errors, function (value, key) {
						$scope.form[key].$setValidity('server', false);
						$scope.errors[key] = value.message;
					});
				} else {
					$scope.errors['form'] = err.message;
				}
			});
		};

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

		$scope.toggleComment = function (comment) {
			comments.toggle(comment);
		};

		$scope.upvote = function (comment) {
			comments.upvote(comment);
		};
}]);
