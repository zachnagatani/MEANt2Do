(function() {
	'use strict';

	angular.module('meantodo')
		.controller('indexCtrl', ['$scope', '$state', 'authentication', function($scope, $state, authentication) {
			var self = this;
			self.isLoggedIn = authentication.isLoggedIn();
			self.currentUser = authentication.currentUser();
			self.logout = function(event) {
				// Toggles the logout button in the nav
				self.isLoggedIn = false;
				// Delete the token
				authentication.logout();
				// Reload so auth is run again, and we are taken out of the dashboard
				$state.go('login');
			};

			$scope.$on('loggedIn', function(event, loggedIn) {
				self.isLoggedIn = loggedIn;
			});
		}]);
}());