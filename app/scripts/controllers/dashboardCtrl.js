(function() {
	'use strict';

	angular.module('meantodo')
		.controller('dashboardCtrl', ['$scope', function($scope) {
			var self = this;

			self.state = 'Dashboard';
		}]);
}());