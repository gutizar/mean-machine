/**
 * hobiles.services Module
 *
 * Description
 */
var services = angular.module('hobiles.services', []);

services.value('resources', {
	orders: 'orders',
	comments: 'comments'
});

services.factory('orders', ['$scope', '$http', function ($scope, $http) {
	var obj = {
		orders: []
	};

	obj.getAll = function () {
		return $http.get('/orders').success(function (data) {
			angular.copy(data, obj.orders);
		});
	};

	obj.get = function (id) {
		return $http.get('/orders/' + id).then(function (res) {
			return res.data;
		});
	};

	obj.create = function (order) {
		return $http.post('/orders', order).success(function (data) {
			obj.orders.push(data);
		}).error(function (err) {
			console.error(err);
		});
	};

	obj.toggle = function (order) {
		return $http.put('/orders/' + order._id + '/toggle', null)
			.success(function (data) {
				order.important = data.important;
			});
	};

	obj.addComment = function (order, comment) {
		return $http.post('/orders/' + order._id + '/comments', comment)
			.success(function (data) {
				order.comments.push(data);
			});
	}

	return obj;
}]);

services.factory('comments', ['$scope', '$http', function ($scope, $http) {
	var obj = {
		comments: []
	};

	obj.getAll = function () {
		return $http.get('/comments').success(function (data) {
			angular.copy(data, obj.comments);
		});
	};

	obj.get = function (id) {
		return $http.get('/comments/' + id).then(function (res) {
			return res.data;
		});
	};

	obj.upvote = function (comment) {
		return $http.put('/comments/' + id + '/upvote', null)
			.success(function (data) {
				comment.upvotes++;
			});
	};

	return obj;
}]);