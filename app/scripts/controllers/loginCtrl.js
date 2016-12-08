(function() {
	'use strict';

	angular.module('meantodo')
		.controller('loginCtrl', ['$scope', '$state', 'apiPOST', function($scope, $state, apiPOST) {
			var self = this;
				URL = 'http://localhost:3000/api/users/login';

			self.state = 'Login';

			self.login = function(username, password, event) {
				event.preventDefault();
				apiPOST.post(URL, { 'username': username, 'password': password })
					.then(function success(response) {
						console.log(response);
						if (response.status === 200) {
							$state.go('dashboard');
						}
					}, function error(response) {
						self.formInvalid = true;
						console.log(response);
					});
			};
		}]);
}());