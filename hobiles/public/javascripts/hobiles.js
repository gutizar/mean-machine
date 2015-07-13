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

	$urlRouterProvider.otherwise('home');
}]);
