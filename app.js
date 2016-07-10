angular.module("ZappApp", [])

.constant("apiUrl", "http://localhost:3000/")

.controller("NewsController", ["$scope", "$http", "apiUrl", function($scope, $http, apiUrl){

	$http.get(apiUrl + 'news/')
	.then(function(response){
		$scope.news = response.data;
	});

}]);
