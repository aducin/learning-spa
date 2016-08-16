angular.module('ZappApp.ProductController', [])

.controller("ProductController", ["$scope", '$routeParams', '$filter', '$window', '$cookies', '$location', '$q', 'loginService', 'productsModel',  function($scope, $routeParams, $filter, $window, $cookies, $location, $q, loginService, productsModel){
  
	var config = 'contenttype';
	$scope.basicUpdate = [];
	$scope.basicUpdate.message = null;
	$scope.basicUpdate.messageError = null;
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
	//$scope.displayMain = false;
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
	$scope.progress={'cursor':'wait'};
	
	
	function categories() {
	        productsModel.getCategories()
		.then(function(response){
			  $scope.categories = response.data;
		}) 
	}
	
	function checkModified(deleteSuccess) {
	      productsModel.getModified($scope)
	      .then(function(response){
		      if (!$routeParams.id) {
			  $scope.data.modified = response.data;
		      }
		      if (deleteSuccess == 'delete') {
			    $scope.data.modifiedDelete = undefined;
		      }
	      }) 
	}
	
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
	      productsModel.getProduct($scope)
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
  
	function idCheck($scope, $routeParams) {
	      var currentId = $routeParams.id;
	      if ($routeParams.id != undefined) {
		    $scope.productId = $routeParams.id;
		    if (isNaN($scope.productId) == true) {
			  window.location = '#/products';
		    }
		    var categories = productsModel.getCategories();
		    var conditions = productsModel.getConditions();
		    var fullEdition = productsModel.getFullEdition($scope);
		    var manufacturers = productsModel.getManufacturers();
		    $q.all([
				categories,
				conditions,
				fullEdition,
				manufacturers
		    ]).then(function(result){
			    $scope.data.activity = result[1].data.productActivity;
			    $scope.data.conditions = result[1].data.productConditions;
			    if (result[2].data.success == false) {
				    window.location = '#/products';
				    return false;
			    }
			    $scope.fullEdition = result[2].data;
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
		    });
		    $scope.productDetail = 'Pełna edycja produktu nr: ' + $scope.productId;
		    $scope.disabled = true;
		    $scope.progress = undefined;
	      } else if ($routeParams.historyId != undefined) {
		    productsModel.getHistory($routeParams)
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
		     	productsModel.getCategories()
			.then(function(response){
				  $scope.categories = response.data;
			}) 
			productsModel.getManufacturers()
			.then(function(response){
				  $scope.manufactorers = response.data;
			}) 
			checkModified();
	      }
	}
	
	function updateData(db, data, success) {
		productsModel.updateData($scope, db, data, config)
		.then(function (response) {
                $scope.basicUpdate = response.data;
		if ($scope.basicUpdate.success == true) {	
		      $scope.basicUpdate.message = success;
		      checkIdBasic('true');
		}
            })
	};

	loginService.verify($scope, 'login', 'products');
	
	idCheck($scope, $routeParams);
	
	$scope.checkIdBasic = function () {
		$scope.checkId = this.checkId;
	        checkIdBasic();
	};
	
	$scope.checkName = function () {
	      if (this.basicName.length < 3) {
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
	      var basicName = this.basicName;
	      delete $scope.checkId;
	      delete $scope.basicId;
	      productsModel.getName(this.basicName, this.data.manufacturerSelect, this.data.categorySelect)
	      .then(function(response){
		      if(response.data.success == false) {
			  $scope.noProduct = 'Brak produktu o nazwie: ' + basicName;
			  $scope.names = null;
			  $scope.data.searchResultLength = null;
		      } else {
		          delete $scope.noProduct;
			  $scope.data.searchResult = 'Wyniki wyszukiwania dla frazy: "' + basicName + '". ';
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
		productsModel.deleteModified(id)
		.then(function(response){
		      $scope.data.modifiedDelete = response.data;
		      if ($scope.data.modifiedDelete.success == true) {
			      checkModified();
		      } else {
			      $scope.data.modifiedDelete.error = true;
		      }
		})  
	}
	
	$scope.deleteProducts = function () {
	      delete $scope.basicId;
	      $location.path( "/products" );
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
	
	$scope.editionProduct = function (id) {
		$location.path( "/products/" + id );
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
	      productsModel.fullUpdate($scope, data, config)
	      .then(function (response) {
		    $scope.fullUpdate = response.data;
		    if ($scope.fullUpdate === 'true') {
			$scope.fullUpdate = 'success';
			$scope.categoryList={'background-color':'#eee', 'cursor':'not-allowed'}
		    }
              })
	}
	
	$scope.historyProduct = function (id) {
	      $location.path( "/products/" + id + "/history" );
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
	    var error = $scope.basicUpdate.messageError = 'Po co chcesz zapisywać aktualną ilość';
	    if (db === 'linuxPl') {
		    if ($scope.basicId.quantity.new == quantity) {
			  $scope.basicUpdate.message = null;
			  $scope.basicUpdate.messageError = error + ' w nowej bazie?';
			  return false;
		    }
	    } else if (db === 'ogicom') {
		    if ($scope.basicId.quantity.old == quantity) {
			  $scope.basicUpdate.message = null;
			  $scope.basicUpdate.messageError = error + ' w starej bazie?';
			  return false;
		    }
	    } else {
		    if (($scope.basicId.quantity.new == quantity) && ($scope.basicId.quantity.old == quantity)) {
			  $scope.basicUpdate.message = null;
			  $scope.basicUpdate.messageError = error + ' w obu bazach?';
			  return false;
		    }
	    }
	    $scope.basicUpdate.messageError = null;
	    var data = $.param({
		db: db,
                quantity: quantity
            });
	    var success = 'Zmiana ilości zakończona pomyślnie!';
	    updateData(db, data, success);
        };
	
}])