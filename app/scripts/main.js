(function() {
	'use strict';

	angular.module('meantodo', ['ui.router']);

	angular.module('meantodo')
		.config(['$stateProvider', '$urlRouterProvider', function($stateProvider, $urlRouterProvider) {
			$stateProvider
				.state('login', {
					url: '/login',
					templateUrl: 'templates/login.html',
					controller: 'loginCtrl as vm'
				})
				.state('signup', {
					url: '/signup',
					templateUrl: 'templates/signup.html',
					controller: 'signupCtrl as vm'
				})
				.state('dashboard', {
					url: '/dashboard',
					templateUrl: 'templates/dashboard.html',
					controller: 'dashboardCtrl as vm'
				})
		}]);
}());