(function() {
	'use strict';

	angular.module('meantodo')
		.controller('dashboardCtrl', ['$scope', '$state', 'authentication', 'apiGET', function($scope, $state, authentication, apiGET) {
			var self = this;
				URL = 'http://localhost:3000/api/todos'
			if (!authentication.isLoggedIn()) $state.go('login');

			apiGET.get(URL, {
				headers: {
					Authorization: 'Bearer ' + authentication.getToken()
				}
			})
				.then(function(response) {
					self.todos = response.data;
				});
		}]);
}());