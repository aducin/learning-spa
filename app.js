angular.module("ZappApp", ['ngRoute', 'ngSanitize', 'ngAnimate'])

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
		.when('/orders/:dataBase/:id',{
				    templateUrl: "orders.html",
				    controller: "OrderController",
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
		.when('/products/:historyId/history',{
		  		    templateUrl: "products.html",
				    controller: "ProductController",
				  })
                .otherwise({redirectTo:'/'});
}])

.controller('OrderController', ["$scope", "$http", "apiUrl", '$routeParams', '$window', function($scope, $http, apiUrl, $routeParams, $window) {
  
	$scope.dbUrl = null;
	$scope.orderData = [];
	$scope.orderDb = null;
	$scope.noOrder = null;
	
	function idCheck($scope, $routeParams) {
	        if ($routeParams.id != undefined && $routeParams.dataBase != undefined) {
			if ($routeParams.dataBase == 'new' || $routeParams.dataBase == 'old') {
				$scope.dbUrl = $routeParams.dataBase;  
				$scope.currentId = $routeParams.id;
				$http.get(apiUrl + 'orders/' + $scope.dbUrl + '/' + $scope.currentId)
				.then(function(response){
					$scope.orderData = response.data;
					if ($scope.orderDb == 'old') {
						$scope.currentDb = 'stary';
					} else {
						$scope.currentDb = 'nowy';
					}
					if ($scope.orderData.success == false) {
						delete $scope.orderData;
						delete $scope.orderId;
						$scope.noOrder = 'W ' + $scope.currentDb + 'm sklepie brak zamówienia o nr: ' + $scope.currentId;
					} else {
						delete $scope.noOrder;
						$scope.orderData.display = true;
					}
				}) 
			} else {
				$scope.noOrder = 'Podano niewłaściwy adres bazy danych!';
				return false;
			}
		}
	}
	
	idCheck($scope, $routeParams);
	
	$scope.orderSearch = function() {
	      if ($scope.orderDb == 0 || $scope.orderId == undefined) {
		    return false;
	      }
	      if (isNaN($scope.orderId) == true) {
		     $scope.noOrder = '"' + $scope.orderId + '"...? To ma być numer?';
		     delete $scope.orderId;
	      }
	      window.location = '#/orders/' + $scope.orderDb + '/' + $scope.orderId;
	}
}])

.controller("ProductController", ["$scope", "$http", "apiUrl", '$routeParams', '$filter', '$window', function($scope, $http, apiUrl, $routeParams, $filter, $window){
  
        var config = 'contenttype';
	$scope.basicUpdate = [];
	$scope.basicUpdate.message = null;
	$scope.data = {
	      activity: null,
	      categorySelect: null,
	      conditions: null,
	      manufacturerSelect: null,
	      modified: null,
	      modifiedDelete: null,
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
	$scope.fullEdition.modified = undefined;
	$scope.fullEdition.deletePhoto = undefined;
	$scope.names = null;
	
	$http.get(apiUrl + 'categories')
	      .then(function(response){
		      $scope.categories = response.data;
	      }) 
	      
	$http.get(apiUrl + 'manufacturers')
	      .then(function(response){
		      $scope.manufactorers = response.data;
	      })
	
	$http.get(apiUrl + 'products/conditions')
	      .then(function(response){
		      $scope.data.activity = response.data.productActivity;
		      $scope.data.conditions = response.data.productConditions;
	      })         
	
	$scope.checkIdBasic = function () {
	      checkIdBasic();
	};
	
	function checkModified(deleteSuccess) {
	      $http.get(apiUrl + 'products/modified')
	      .then(function(response){
		      if (!$routeParams.id) {
			  $scope.data.modified = response.data;
		      }
		      if (deleteSuccess == 'delete') {
			    $scope.data.modifiedDelete = undefined;
		      }
	      }) 
	}
  
	function idCheck($scope, $routeParams) {
	      var currentId = $routeParams.id;
	      if ($routeParams.id != undefined) {
		    $scope.productId = $routeParams.id;
		    if (isNaN($scope.productId) == true) {
			  window.location = 'http://modele-ad9bis.pl/learning-spa/#/products';
		    }
		    var currentUrl = apiUrl + 'products/' + $scope.productId;
		    $http.get(currentUrl)
		    .then(function(response){
			  $scope.fullEdition = response.data;
			  if ($scope.fullEdition.success == false) {
				window.location = 'http://modele-ad9bis.pl/learning-spa/#/products';
			  }
			  $scope.fullEdition.descriptionOriginal = $scope.fullEdition.description;
			  var currentTag = '';
			  for (var i = 0; i < $scope.fullEdition.productTags.length; i++) {
			    currentTag = currentTag + $scope.fullEdition.productTags[i].name + ', ';
			  }
			  currentTag = currentTag.replace(/,\s*$/, "");
			  $scope.fullEdition.currentTag = currentTag;
			  for (var i = 0; i < $scope.fullEdition.manufactorers.length; i++) {
			      if ($scope.fullEdition.manufactorer == $scope.fullEdition.manufactorers[i].id) {
				  $scope.fullEdition.manufactorerSingle = $scope.fullEdition.manufactorers[i];
			      }
			  }
			  for (var i = 0; i < $scope.data.activity.length; i++) {
				if ($scope.fullEdition.active == $scope.data.activity[i].value) {
				      $scope.fullEdition.active = $scope.data.activity[i];
				}
			  }
			  for (var i = 0; i < $scope.data.conditions.length; i++) {
				if ($scope.fullEdition.condition == $scope.data.conditions[i].value) {
				      $scope.fullEdition.condition = $scope.data.conditions[i];
				}
			  }
			  if ($scope.fullEdition.discount.new.reductionType == 'percentage') {
				var discount = $scope.fullEdition.price.new * $scope.fullEdition.discount.new.reduction;
				$scope.fullEdition.discount.new.realPrice = $scope.fullEdition.price.new - discount;
			  }
			  if ($scope.fullEdition.discount.old.reductionType == 'amount') {
				$scope.fullEdition.discount.old.realPrice = $scope.fullEdition.price.old - $scope.fullEdition.discount.old.reduction;
			  }
		    })
		    $scope.productDetail = 'Pełna edycja produktu nr: ' + $scope.productId;
		    $scope.disabled = true;
	      } else if ($routeParams.historyId != undefined) {
		    $http.get(apiUrl + 'products/' + $routeParams.historyId + '/history')
		    .then(function(response){
			      $scope.disabled = true;
			      delete $scope.data.modified;
			      $scope.id = $routeParams.historyId;
			      $scope.history = response.data;
			      if ($scope.history.success == false) {
				    delete $scope.history;
				    $scope.historyError = 'Brak historii zmian produktu ID: ' + $routeParams.historyId + '!';
			      }
			      
		    }) 
	      } else {
		    checkModified();
	      }
	}
	
	idCheck($scope, $routeParams);
	
	function checkIdBasic(repeat) {
	      if (($scope.checkId == undefined) || ( isNaN($scope.checkId) == true)) {
		  delete $scope.checkId;
		  return false;
	      }
	      delete $scope.basicName;
	      delete $scope.history;
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
			if (response.data.reason == 'no product') {
			      $scope.noProduct = 'Brak produktu o ID: ' + $scope.checkId;
			      delete $scope.checkId;
			}
			$scope.attributeSelect = response.data.dataNew;
			delete $scope.basicId;
		  } else {
			delete $scope.noProduct;
			delete $scope.nameAdditionalConditions;
			delete $scope.names;
			delete $scope.attributeSelect;
			$scope.data.singleSelect = null;
			$scope.basicId = response.data;
			$scope.basicId.imageUrl =
			'http://modele-ad9bis.pl/img/p/' + $scope.basicId.id + '-' + $scope.basicId.image + '-thickbox.jpg';
			$scope.basicId.imageUrlMain = 'http://modele-ad9bis.pl/img/p/' + $scope.basicId.id + '-' + $scope.basicId.image + '.jpg';
		  }
	      })
	}
	
	function updateData(db, data, success) {
	    if (db == 'both') {
		  var url = apiUrl + 'products/' + $scope.basicId.id + '/' + $scope.basicId.attribute.new + '/' + $scope.basicId.attribute.old;
	    } else if (db == 'linuxPl') {
		  var url = apiUrl + 'products/' + $scope.basicId.id + '/' + $scope.basicId.attribute.new;
	    } else if (db == 'ogicom') {
		  var url = apiUrl + 'products/' + $scope.basicId.id + '/' + $scope.basicId.attribute.old;
	    }

            $http.put(url, data, config)
            .then(function (response) {
                $scope.basicUpdate = response.data;
		if ($scope.basicUpdate.success == true) {	
		      $scope.basicUpdate.message = success;
		      checkIdBasic('true');
		}
            })
	};
	
	$scope.checkName = function () {
	      if ($scope.basicName.length < 3) {
		    delete $scope.noProduct;
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
	      delete $scope.checkId;
	      delete $scope.basicId;
	      $http.get(apiUrl + 'products?search=' + $scope.basicName + '&manufacturer=' + $scope.data.manufacturerSelect + '&category=' + $scope.data.categorySelect)
	      .then(function(response){
		      if(response.data.success == false) {
			  $scope.noProduct = 'Brak produktu o nazwie: ' + $scope.basicName;
			  $scope.names = null;
			  $scope.data.searchResultLength = null;
		      } else {
		          delete $scope.noProduct;
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
	
	$scope.checkIdBasicPriceChange = function () {
	      if ($scope.basicPriceChange == undefined) {
		    $scope.basicPriceChange = true;
	      } else {
		    delete $scope.basicPriceChange;
	      }
	};
	
	$scope.checkIdBasicQuantityChange = function () {
	      if ($scope.basicQuantityChange == undefined) {
		    $scope.basicQuantityChange = true;
	      } else {
		    delete $scope.basicQuantityChange;
	      }
	};
	
	$scope.checkIdBasicRemove = function () {
	      delete $scope.basicId;
	};
	
	$scope.checkModified = function () {
	      checkModified('delete');
	}
	 
	$scope.checkNameConditions = function () {
	      if ($scope.nameAdditionalConditions == undefined) {
		    delete $scope.basicId;
		    $scope.nameAdditionalConditions = true;
	      } else {
		    delete $scope.nameAdditionalConditions;
	      }
	};
	
	$scope.deleteModified = function (id) {
		var url = apiUrl + 'products/modified/' + id;
		$http.delete(url, config)
		.then(function(response){
		      $scope.data.modifiedDelete = response.data;
		      if ($scope.data.modifiedDelete.success == true) {
			      checkModified();
		      } else {
			      $scope.data.modifiedDelete.error = true;
		      }
		})  
	}
	
	$scope.displayCategories = function () {
	      if ($scope.fullUpdate === 'success') {
		  return false;
	      }
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
		attribute: $scope.fullEdition.attribute,
		name: $scope.fullEdition.name,
                descriptionShort: $scope.fullEdition.descriptionShort,
		description: $scope.fullEdition.description,
		linkRewrite: $scope.fullEdition.linkRewrite,
		metaTitle: $scope.fullEdition.metaTitle,
		metaDescription: $scope.fullEdition.metaDescription,
		tagString: $scope.fullEdition.currentTag,
		quantity: $scope.fullEdition.quantity.new,
		manufactorer: $scope.fullEdition.manufactorerSingle,
		condition: $scope.fullEdition.condition,
		active: $scope.fullEdition.active,
		priceNew: $scope.fullEdition.price.new,
		priceOld: $scope.fullEdition.price.old,
		categories: $scope.fullEdition.categories,
		deletePhoto: $scope.fullEdition.deletePhoto,
		modified: $scope.fullEdition.modified
              });
	      var url = apiUrl + 'products/' + $scope.fullEdition.id + '/' + $scope.fullEdition.attribute.new + '/' + $scope.fullEdition.attribute.old;
	      $http.put(url, data, config)
	      .then(function (response) {
		    $scope.fullUpdate = response.data;
		    if ($scope.fullUpdate === 'true') {
			$scope.fullUpdate = 'success';
			$scope.categoryList={'background-color':'#eee', 'cursor':'not-allowed'}
		    }
              })
	}
	
        $scope.multiplyDesc = function () {
	      $scope.fullEdition.description = $scope.fullEdition.descriptionShort + $scope.fullEdition.descriptionOriginal;
	}
	
	$scope.multiplyText = function () {
	      $scope.fullEdition.metaTitle = $scope.fullEdition.name;
	}
	
	$scope.openInNewWindow = function() {
	      $window.open($scope.basicId.imageUrlMain);
	}
	
	$scope.updatePrice = function () {
	    var db = document.getElementById("basicPriceDb").value;
	    var price = document.getElementById("basicPriceInput").value;
	    var data = $.param({
		db: db,
                price: price
            });
	    var success = 'Zmiana ceny zakończona pomyślnie!';
	    updateData(db, data, success);
	}
	
	$scope.updateQuantity = function () {
	    var db = document.getElementById("basicQuantityDb").value;
	    var quantity = document.getElementById("basicQuantityInput").value;
	    var data = $.param({
		db: db,
                quantity: quantity
            });
	    var success = 'Zmiana ilości zakończona pomyślnie!';
	    updateData(db, data, success);
        };
	
}]);
