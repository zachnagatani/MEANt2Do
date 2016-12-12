(function() {
	'use strict';

	angular.module('meantodo')
		.controller('dashboardCtrl', ['$scope', '$state', 'authentication', 'apiGET', 'apiPOST', 'apiDELETE', function($scope, $state, authentication, apiGET, apiPOST, apiDELETE) {
			var self = this;
			var GETURL = 'https://tranquil-headland-44852.herokuapp.com/api/todos';
			var NEWTODOURL = 'https://tranquil-headland-44852.herokuapp.com/api/todos/new';
			var UPDATETODOURL = 'https://tranquil-headland-44852.herokuapp.com/api/todos/update';
			var token = authentication.getToken();
			if (!authentication.isLoggedIn()) $state.go('login');

			self.getTodos = function() {
				apiGET.get(GETURL, {
					headers: {
						Authorization: 'Bearer ' + token
					}
				})
					.then(function(response) {
						self.todos = response.data;
					});
			};
			self.getTodos();

			self.addTodo = function(todo, event) {
				event.preventDefault();
				if ($scope.todo) {
					apiPOST.post(NEWTODOURL, {'todo': todo }, {
						headers: {
							Authorization: 'Bearer ' + token
						}
					})
						.then(function(response) {
							// Clear out the input field
							$scope.todo = '';
							// Update the todos
							self.getTodos();
						}, function(response) {
							console.log(response);
						});
				}
			};

			self.enterEditing = function(todo) {
				self.editing = true;
				self.currentTodo = todo;
				$('#todo').focus();
			};

			self.updateTodo = function(currentTodo, todo, event) {
				if (event) event.preventDefault();
				apiPOST.post(UPDATETODOURL, { 'id': currentTodo._id, 'todo': todo, 'isDone': currentTodo.isDone }, {
					headers: {
						Authorization: 'Bearer ' + token
					}
				})
					.then(function(response) {
						self.editing = false;
						$scope.todo = '';
						self.getTodos();
					}, function(response) {
						console.log(response);
					});
			};

			self.cancelEdit = function() {
				if (!$scope.todo) self.editing = false;
			};

			self.checkTodo = function(todo) {
				self.currentTodo = todo;
				self.currentTodo.isDone === false ? self.currentTodo.isDone = true : self.currentTodo.isDone = false;

				self.updateTodo(self.currentTodo, self.currentTodo.todo);
			};

			self.deleteTodo = function(todo) {
				// console.log(currentTodo, todo);
				var url = 'https://tranquil-headland-44852.herokuapp.com/api/todos/delete/' + todo._id ;
				apiDELETE.delete(url, {
					headers: {
						Authorization: 'Bearer ' + token
					}
				})
					.then(function(response) {
						self.getTodos();
					}, function(response) {
						console.log(response);
					});
			};
		}]);
}());