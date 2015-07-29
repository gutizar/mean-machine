'use strict';

/**
 * hobiles.services Module
 *
 * Description
 */
var services = angular.module('hobiles.services', []);

services.factory('test', function () {
	return {
		greet: function () {
			console.log('Hello, world!');
		}
	};
});

// TODO: Keep the records in the DB.
services.factory('dispatch', function () {
	return [
		{ name: 'hobiles', label: 'Hobiles' },
		{ name: 'mail', label: 'Pošta Slovenije' },
		{ name: 'client', label: 'Lastni prevzem' }
	];
});

// TODO: Keep the records in the DB.
services.factory('payment', function () {
	return [
		{ name: 'preinvoice', label: 'Predplačilo'},
		{ name: 'transfer', label: 'Nakazilo'},
		{ name: 'delivery', label: 'Ob prevzemu'}
	]
});

services.factory('orders', ['$http', function ($http) {
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

	obj.update = function (order) {
		return $http.post('/orders/' + order._id, order);
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
				data.order = order._id;
				order.comments.push(data);
			});
	};

	obj.promote = function (order) {
		var url = '/lifecycles/' + order.status.lifecycle + '/promote/' + order.status.name;
		return $http.get(url);
	};

	obj.demote = function (order) {
		var url = '/lifecycles/' + order.status.lifecycle + '/demote/' + order.status.name;
		return $http.get(url);
	};

	obj.updateStatus = function (order, state) {
		var url = '/orders/' + order._id + '/status';
		return $http.put(url, state);
	};

	return obj;
}]);

services.factory('comments', ['$http', function ($http) {
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
		return $http.put('/comments/' + comment._id + '/upvote', null)
			.success(function (data) {
				comment.upvotes++;
			});
	};

	obj.toggle = function (comment) {
		return $http.put('/comments/' + comment._id + '/toggle', null)
			.success(function (data) {
				comment.important = data.important;
			});
	};

	obj.delete = function (comment) {
		return $http.delete('/orders/' + comment.order + '/comments/' + comment._id);
	};

	return obj;
}]);
