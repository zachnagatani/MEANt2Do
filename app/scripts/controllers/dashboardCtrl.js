(function() {
	'use strict';

	angular.module('meantodo')
		.controller('dashboardCtrl', ['$scope', '$state', 'authentication', function($scope, $state, authentication) {
			var self = this;

			if (!authentication.isLoggedIn()) $state.go('login');
		}]);
}());