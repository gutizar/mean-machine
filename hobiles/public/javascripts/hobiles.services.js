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

	obj.greet = function () {
		console.log('Hello from the orders service');
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
		// return $http.post('/orders/' + order._id, order).success(function (data) {
		// 	return data;
		// }).error(function (err) {
		// 	console.log(err);
		// 	order.number.$error.server = err.errors.number.message;
		// });
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
				order.comments.push(data);
			});
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

	return obj;
}]);
