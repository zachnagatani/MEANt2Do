(function() {
	'use strict';

	angular.module('meantodo')
		.service('apiGET', ['$http', function($http) {
		var self = this;

		self.get = function(url, config) {
			return $http.get(url, config);
		};
	}]);

	angular.module('meantodo')
		.service('apiPOST', ['$http', function($http) {
			var self = this;

			self.post = function(url, data, config) {
				return $http.post(url, data, config);
			};
		}]);

	angular.module('meantodo')
		.service('authentication', ['$http', '$window', function($http, $window) {
			var self = this;

			self.saveToken = function(token) {
				$window.localStorage['mean-token'] = token;
			};

			self.getToken = function() {
				return $window.localStorage['mean-token'];
			};

			self.logout = function() {
				$window.localStorage.removeItem('mean-token');
			};

			self.isLoggedIn = function() {
				var token = self.getToken();
				var payload;

				if(token) {
					payload = token.split('.')[1];
					payload = $window.atob(payload);
					payload = JSON.parse(payload);
					return payload.exp > Date.now() / 1000;
				} else {
					return false;
				}
			};

			self.currentUser = function() {
				if(self.isLoggedIn()) {
					var token = self.getToken();
					var payload = token.split('.')[1];
					payload = $window.atob(payload);
					payload = JSON.parse(payload);

					return {
						username: payload.username,
					};
				}
			};
		}]);

}());