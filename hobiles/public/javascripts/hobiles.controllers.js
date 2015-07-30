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

		$scope.appStatus = {
			show: false,
			message: '',
			data: {}
		};

		$scope.state = { };
		$scope.states = [ ];

		$scope.closeNotification = function () {
			$scope.appStatus.show = false;
		}

		$scope.updateOrder = function (input) {
			$scope.errors = {};
			// Pre-update hook does not work
			// TODO: Check the issue @ the mongoosejs project page
			input.updated = new Date();
			orders.update(input).success(function (data) {
				$scope.appStatus = {
					show: true, message: 'The order was successfully updated', data: data
				};
				$('#editOrderModal').modal('toggle');
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

		$scope.updateStatus = function (order, state) {
			orders.updateStatus(order, state).success(function (data) {
				$scope.appStatus = {
					show: true, message: 'Order status changed to ' + state.label, data: data
				};
				$('#editStatusModal').modal('toggle');
				order.status.name = state.name;
				order.status.label = state.label;
			});
		};

		$scope.addComment = function () {
			if (!$scope.body || !$scope.createdBy) {
				// Return some validation error
				return;
			}
			orders.addComment($scope.order, {
				body: $scope.body, createdBy: $scope.createdBy, created: new Date()
			});
			$scope.body = '';
			$scope.createdBy = '';
		};

		$scope.toggle = function () {
			orders.toggle($scope.order);
		};

		$scope.promote = function () {
			orders.promote($scope.order).success(function (data) {
				$scope.states = data;
				$('#editStatusModal').modal('show');
			});
		};

		$scope.demote = function () {
			orders.demote($scope.order).success(function (data) {
				$scope.states = data;
				$('#editStatusModal').modal('show');
			});
		};

		$scope.toggleComment = function (comment) {
			comments.toggle(comment);
		};

		$scope.upvote = function (comment) {
			comments.upvote(comment);
		};

		$scope.delete = function (comment) {
			comments.delete(comment).success(function (data) {
				$scope.appStatus = {
					show: true, message: 'The comment was successfully deleted', data: {}
				};
				$scope.order.comments = _.without(
					$scope.order.comments, comment
				);
			});
		};
}]);
