angular.module("ZappApp", [])

//.constant("apiUrl", "http://localhost:3000/")
.constant("apiUrl", "http://localhost/cms_spa/web/app_dev.php/")

.controller("NewsController", ["$scope", "$http", "apiUrl", function($scope, $http, apiUrl){

	//$http.get(apiUrl + 'news/')
	$http.get(apiUrl + 'products?search=sprzeg')
	.then(function(response){
		$scope.news = response.data;
	});
	
	$scope.UpdateData = function () {
	    var url = apiUrl + 'products/' + $scope.productId + '/' + $scope.productAttribute;
	    var config = 'contenttype';
            var data = $.param({
		db: $scope.productDb,
                quantity: $scope.productQuantity
            });

            $http.put(url, data, config)
            .then(function (data, status, headers) {
                $scope.ServerResponse = data.data;
		console.log($scope.ServerResponse);
            })
        };

}]);
