(function() {
	'use strict';

	angular.module('meantodo')
		.controller('loginCtrl', ['$scope', '$state', 'apiPOST', 'authentication', function($scope, $state, apiPOST, authentication) {
			var self = this;
				URL = 'http://localhost:3000/api/users/login';

			self.state = 'Login';

			self.login = function(username, password, event) {
				event.preventDefault();
				apiPOST.post(URL, { 'username': username, 'password': password })
					.then(function success(response) {
						console.log(response);
						if (response.status === 200) {
							authentication.saveToken(response.data.token);
							console.log(response.data.token);
							$state.go('dashboard');
							$scope.$emit('loggedIn', authentication.isLoggedIn());
						}
					}, function error(response) {
						self.formInvalid = true;
						console.log(response);
					});
			};
		}]);
}());