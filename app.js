angular.module("ZappApp", ['ngRoute'])

//.constant("apiUrl", "http://localhost:3000/")
.constant("apiUrl", "http://modele-ad9bis.pl/cms_spa/web/app_dev.php/")

.config(['$routeProvider', function($routeProvider){
                $routeProvider
                .when('/',{
				    templateUrl: "products.html",
				    controller: "ProductController",
			   })
		.when('/orders',{
				    templateUrl: "orders.html",
				    controller: "OrderController",
				    controllerAs: "order"
				  })
                .when('/products',{
				    templateUrl: "products.html",
				    controller: "ProductController",
				  })
                .when('/postal',{template:'This is the postal Route'})
		.when('/products/:id',{
		  		    templateUrl: "products.html",
				    controller: "ProductController",
				  })
                .otherwise({redirectTo:'/'});
}])

.controller('OrderController', function() {
  var self = this;
  self.message = "Tutaj będzie panel obsługi zamówień!";
})

.controller('ProductControllerEdition', ['$scope', '$routeParams',
   function ($scope, $routeParams) {
      //Get ID out of current URL
      var currentId = $routeParams.id;
      alert('Tutaj będzie pełna edycja produktu nr: ' + currentId);
}])

.controller("ProductController", ["$scope", "$http", "apiUrl", '$routeParams', function($scope, $http, apiUrl, $routeParams){
  
	function idCheck($scope, $routeParams) {
	      var currentId = $routeParams.id;
	      if ($routeParams.id != undefined) {
		    $scope.productDetail = true;
		    $scope.productId = $routeParams.id;
		    alert($routeParams.id);
	      }
	}
	
	idCheck($scope, $routeParams);
  
	$scope.basicUpdate = [];
	$scope.basicUpdate.message = null;
	$scope.data = {
	      categorySelect: null,
	      manufacturerSelect: null,
	      singleSelect: null,
	      searchResult: null,
	      searchResultLength: null,
	};
	$scope.names = null;
	
	function CheckIdBasic(repeat) {
	      if ($scope.checkId == undefined) {
		  return false;
	      }
	      if(repeat != 'true') {
		  delete $scope.basicUpdate.message;
		  delete $scope.basicQuantityChange;
		  delete $scope.basicPriceChange;
	      }
	      if ($scope.data.singleSelect != null) {
		  var currentUrl = apiUrl + 'products/' + $scope.checkId + '/' + $scope.data.singleSelect + '?basic=true';
	      } else {
		  var currentUrl = apiUrl + 'products/' + $scope.checkId + '?basic=true';
	      }
	      $http.get(currentUrl)
	      .then(function(response){
		  if(response.data.success == false) {
			$scope.attributeSelect = response.data.dataNew;
			delete $scope.basicId;
		  } else {
			delete $scope.nameAdditionalConditions;
			delete $scope.attributeSelect;
			$scope.data.singleSelect = null;
			$scope.basicId = response.data;
		  }
	      })
	}
  
	$http.get(apiUrl + 'products?search=toczone')
	      .then(function(response){
		      $scope.nameList = response.data;
	      })
	
	$http.get(apiUrl + 'categories')
	      .then(function(response){
		      $scope.categories = response.data;
	      }) 
	      
	$http.get(apiUrl + 'manufacturers')
	      .then(function(response){
		      $scope.manufactorers = response.data;
	      })
	
	$scope.CheckIdBasic = function () {
	      CheckIdBasic();
	};
	
	$scope.CheckName = function () {
	      if ($scope.basicName.length < 3) {
		    $scope.data.searchResult = null;
		    $scope.data.searchResultLength = null;
	            $scope.names = null;
		    return false;
	      }
	      if ($scope.data.manufacturerSelect == null) {
		  $scope.data.manufacturerSelect = 0;
	      }
	      if ($scope.data.categorySelect == null) {
		  $scope.data.categorySelect = 0;
	      }
	      delete $scope.basicId;
	      $scope.basicName;
	      $http.get(apiUrl + 'products?search=' + $scope.basicName + '&manufacturer=' + $scope.data.manufacturerSelect + '&category=' + $scope.data.categorySelect)
	      .then(function(response){
		      if(response.data.success == false) {
			  $scope.names = null;
			  $scope.data.searchResult = response.data.reason;
			  $scope.data.searchResultLength = null;
		      } else {
			  $scope.data.searchResult = 'Wyniki wyszukiwania dla frazy: "' + $scope.basicName + '". ';
			  if (response.data.length == 1) {
				var lengthFinish = ' produkt.';
			  } else if (response.data.length == 2 || response.data.length == 3 || response.data.length == 4) {
				var lengthFinish = ' produkty.';
			  } else {
				var lengthFinish = ' produktów.';
			  }
			  $scope.data.searchResultLength = 'Znaleziono ' + response.data.length + lengthFinish;
			  $scope.names = response.data;
		      }
	      })
	};
	
	$scope.CheckIdBasicPriceChange = function () {
	      if ($scope.basicPriceChange == undefined) {
		    $scope.basicPriceChange = true;
	      } else {
		    delete $scope.basicPriceChange;
	      }
	};
	
	$scope.CheckIdBasicQuantityChange = function () {
	      if ($scope.basicQuantityChange == undefined) {
		    $scope.basicQuantityChange = true;
	      } else {
		    delete $scope.basicQuantityChange;
	      }
	};
	
	$scope.CheckIdBasicRemove = function () {
	      delete $scope.basicId;
	};
	 

	
	$scope.CheckNameConditions = function () {
	      if ($scope.nameAdditionalConditions == undefined) {
		    delete $scope.basicId;
		    $scope.nameAdditionalConditions = true;
	      } else {
		    delete $scope.nameAdditionalConditions;
	      }
	};
	
	$scope.UpdatePrice = function () {
	    var db = document.getElementById("basicPriceDb").value;
	    var price = document.getElementById("basicPriceInput").value;
	    var data = $.param({
		db: db,
                price: price
            });
	    var success = 'Zmiana ceny zakończona pomyślnie!';
	    UpdateData(db, data, success);
	}
	
	$scope.UpdateQuantity = function () {
	    var db = document.getElementById("basicQuantityDb").value;
	    var quantity = document.getElementById("basicQuantityInput").value;
	    var data = $.param({
		db: db,
                quantity: quantity
            });
	    var success = 'Zmiana ilości zakończona pomyślnie!';
	    UpdateData(db, data, success);
        };
	
	function UpdateData(db, data, success) {
	    if (db == 'both') {
		  var url = apiUrl + 'products/' + $scope.basicId.id + '/' + $scope.basicId.attribute.new + '/' + $scope.basicId.attribute.old;
	    } else {
		  var url = apiUrl + 'products/' + $scope.basicId.id + '/' + $scope.basicId.attribute.old;
	    }
	    var config = 'contenttype';

            $http.put(url, data, config)
            .then(function (response) {
                $scope.basicUpdate = response.data;
		if ($scope.basicUpdate.success == true) {	
		      $scope.basicUpdate.message = success;
		      CheckIdBasic('true');
		}
            })
	};
	/*
	$scope.UpdateData = function () {
	    if ($scope.productDb == 'both') {
		  var url = apiUrl + 'products/' + $scope.productId + '/' + $scope.productAttribute + '/' + $scope.productAttribute;
	    } else {
		  var url = apiUrl + 'products/' + $scope.productId + '/' + $scope.productAttribute;
	    }
	    //var url = apiUrl + 'products/' + $scope.productId + '/' + $scope.productAttribute;
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
	*/

}]);
