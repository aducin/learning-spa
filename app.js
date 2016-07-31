angular.module("ZappApp", ['ngRoute', 'ngSanitize', 'ngAnimate'])

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

.controller("ProductController", ["$scope", "$http", "apiUrl", '$routeParams', '$filter', '$window', function($scope, $http, apiUrl, $routeParams, $filter, $window){
  
        $scope.basicUpdate = [];
	$scope.basicUpdate.message = null;
	$scope.data = {
	      categorySelect: null,
	      manufacturerSelect: null,
	      singleSelect: null,
	      searchResult: null,
	      searchResultLength: null,
	};
	$scope.fullEdition = [];
	$scope.fullEdition.active = undefined;
	$scope.fullEdition.condition = undefined;
	$scope.fullEdition.discount = [];
	$scope.fullEdition.discount.new = [];
	$scope.fullEdition.discount.new.reductionType = undefined;
	$scope.fullEdition.discount.old = [];
	$scope.fullEdition.discount.old.reductionType = undefined;
	$scope.names = null;
  
	function idCheck($scope, $routeParams) {
	      var currentId = $routeParams.id;
	      if ($routeParams.id != undefined) {
		    $scope.productId = $routeParams.id;
		    var currentUrl = apiUrl + 'products/' + $scope.productId;
		    $http.get(currentUrl)
		    .then(function(response){
			  $scope.fullEdition = response.data;
			  $scope.fullEdition.descriptionOriginal = $scope.fullEdition.description;
			  var currentTag = '';
			  for (var i = 0; i < $scope.fullEdition.productTags.length; i++) {
			    currentTag = currentTag + $scope.fullEdition.productTags[i].name + ', ';
			  }
			  currentTag = currentTag.replace(/,\s*$/, "");
			  $scope.fullEdition.currentTag = currentTag;
			  for (var i = 0; i < $scope.manufactorers.length; i++) {
			      if ($scope.fullEdition.manufacturer == $scope.manufactorers[i].id) {
				  $scope.fullEdition.manufactorerName = $scope.manufactorers[i].name;
			      }
			  }
			  var conditionArray = [];
			  if ($scope.fullEdition.condition == 'new') {
				conditionArray.push({value: 'new', name: 'Nowy'});
				conditionArray.push({value: 'used', name: 'Używany'});
				conditionArray.push({value: 'renewed', name: 'Odnowiony'});
			  } else if ($scope.fullEdition.condition == 'used') {
			        conditionArray.push({value: 'used', name: 'Używany'});
				conditionArray.push({value: 'new', name: 'Nowy'});
				conditionArray.push({value: 'renewed', name: 'Odnowiony'});
			  } else if ($scope.fullEdition.condition == 'renewed') {
				conditionArray.push({value: 'renewed', name: 'Odnowiony'});
			        conditionArray.push({value: 'used', name: 'Używany'});
				conditionArray.push({value: 'new', name: 'Nowy'});
			  }
			  $scope.fullEdition.conditionArray = conditionArray;
			  var activityArray = [];
			  if ($scope.fullEdition.active == 0) {
				activityArray.push({value: 0, name: 'Nieaktywny'});
				activityArray.push({value: 1, name: 'Aktywny'});
			  } else if ($scope.fullEdition.active == 1) {
				activityArray.push({value: 1, name: 'Aktywny'});
				activityArray.push({value: 0, name: 'Nieaktywny'});
			  }
			  $scope.fullEdition.activityArray = activityArray;
			  if ($scope.fullEdition.discount.new.reductionType == 'percentage') {
				var discount = $scope.fullEdition.price.new * $scope.fullEdition.discount.new.reduction;
				$scope.fullEdition.discount.new.realPrice = $scope.fullEdition.price.new - discount;
			  }
			  if ($scope.fullEdition.discount.old.reductionType == 'amount') {
				$scope.fullEdition.discount.old.realPrice = $scope.fullEdition.price.old - $scope.fullEdition.discount.old.reduction;
			  }
		    })
		    $scope.productDetail = 'Pełna edycja produktu nr: ' + $scope.productId;
	      }
	}
	
	idCheck($scope, $routeParams);
	
	function CheckIdBasic(repeat) {
	      if ($scope.checkId == undefined) {
		  return false;
	      }
	      delete $scope.productDetail;
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
			$scope.basicId.imageUrl =
			'http://modele-ad9bis.pl/img/p/' + $scope.basicId.id + '-' + $scope.basicId.image + '-thickbox.jpg';
			$scope.basicId.imageUrlMain = 'http://modele-ad9bis.pl/img/p/' + $scope.basicId.id + '-' + $scope.basicId.image + '.jpg';
		  }
	      })
	}
	
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
	
	$scope.displayCategories = function () {
	      if ($scope.displayCategory == undefined) {
		    $scope.displayCategory = true;
	      } else {
		    delete $scope.displayCategory;
	      }
	}

	$scope.displayPhotos = function () {
	      if ($scope.displayPhoto == undefined) {
		    $scope.displayPhoto = true;
	      } else {
		    delete $scope.displayPhoto;
	      }
	}
	
	$scope.fullUpdate = function () {
	      var categories = $scope.fullEdition.categories;
	      var data = $.param({
		scope: 'full',
		id: $scope.fullEdition.id,
		name: $scope.fullEdition.name,
                descriptionShort: $scope.fullEdition.descriptionShort,
		description: $scope.fullEdition.description
              });
	      console.log(data);
	}
	
        $scope.multiplyDesc = function () {
	      $scope.fullEdition.description = $scope.fullEdition.descriptionShort + $scope.fullEdition.descriptionOriginal;
	}
	
	$scope.multiplyText = function () {
	      $scope.fullEdition.metaTitle = $scope.fullEdition.name;
	}
	
	$scope.openInNewWindow = function(){
	      $window.open($scope.basicId.imageUrlMain);
	}
	
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
	    } else if (db == 'linuxPl') {
		  var url = apiUrl + 'products/' + $scope.basicId.id + '/' + $scope.basicId.attribute.new;
	    } else if (db == 'ogicom') {
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

}]);
