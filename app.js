angular.module("ZappApp", [])

//.constant("apiUrl", "http://localhost:3000/")
.constant("apiUrl", "http://modele-ad9bis.pl/cms_spa/web/app_dev.php/")

.controller("ProductController", ["$scope", "$http", "apiUrl", function($scope, $http, apiUrl){
  
	$scope.basicUpdate = [];
	$scope.basicUpdate.message = null;
	$scope.data = {
	      singleSelect: null,
	};
	
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
		    return false;
	      }
	      $scope.basicName;
	      $http.get(apiUrl + 'products?search=' + $scope.basicName)
	      .then(function(response){
		      $scope.news = response.data;
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
