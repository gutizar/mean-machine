/**
 * hobiles.directives Module
 *
 * Description
 */
var directives = angular.module('hobiles.directives', []);

directives.directive('serverError', [function() {
	// Runs during compile
	return {
		require: '?ngModel',
		restrict: 'A',
		link: function($scope, iElm, iAttrs, controller) {
			iElm.on('keyup change', function () {
				$scope.$apply(function () {
					 controller.$setValidity('server', true);
				});
			});
		}
	};
}]);