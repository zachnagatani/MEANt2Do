(function() {
	'use strict';

	angular.module('meantodo')
		.service('apiGET', ['$http', function($http) {
		var self = this;

		self.get = function(url) {
			return $http.get(url);
		};
	}]);

	angular.module('meantodo')
		.service('apiPOST', ['$http', function($http) {
			var self = this;

			self.post = function(url, data) {
				return $http.post(url, data);
			};
		}]);

}());