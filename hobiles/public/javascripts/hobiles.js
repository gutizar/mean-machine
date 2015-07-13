var hobiles = angular.module('hobiles', [
	'ui.router',
	'hobiles.directives',
	'hobiles.services',
	'hobiles.controllers',
	'hobiles.filters'
]).
config(['$stateProvider', '$urlRouterProvider', function ($stateProvider, $urlRouterProvider) {
	$stateProvider.state('home', {
		url: '/home',
		templateUrl: 'partials/home',
		controller: 'HomeCtrl',
		resolve: {
			postPromise: ['orders', function (orders) {
				return orders.getAll();
			}]
		}
	});
	$stateProvider.state('order', {
			url: '/order/{id}',
			templateUrl: 'partials/order',
			controller: 'OrderCtrl',
			resolve: {
				order: ['$stateParams', 'orders', function ($stateParams, orders) {
					return orders.get($stateParams.id);
				}]
			}
	});

	$urlRouterProvider.otherwise('home');
}]);
