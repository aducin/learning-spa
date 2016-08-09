angular.module("ZappApp", ['ngRoute', 'ngSanitize', 'ngAnimate'])

.constant("apiUrl", "http://modele-ad9bis.pl/cms_spa/web/app_dev.php/")

.config(['$routeProvider', function($routeProvider){
                $routeProvider
                .when('/login',{
				    templateUrl: "login.html",
				    controller: "LoginController",
			   })
		.when('/logout',{
				    templateUrl: "login.html",
				    controller: "LoginController",
			   })
		.when('/orders',{
				    templateUrl: "orders.html",
				    controller: "OrderController",
				    controllerAs: "order"
				  })
		.when('/orders/:dataBase/:id/:command',{
				    templateUrl: "orders.html",
				    controller: "OrderController",
				  })
		.when('/orders/:dataBase/:id',{
				    templateUrl: "orders.html",
				    controller: "OrderController",
				  })
		.when('/postal',{
				    templateUrl: "postal.html",
				    controller: "PostalController",
				  })
                .when('/products',{
				    templateUrl: "products.html",
				    controller: "ProductController",
				  })
		.when('/products/:id',{
		  		    templateUrl: "products.html",
				    controller: "ProductController",
				  })
		.when('/products/:historyId/history',{
		  		    templateUrl: "products.html",
				    controller: "ProductController",
				  })
                .otherwise({redirectTo:'/login'});
}])

.service(
	"loginService",
	 function( $http, apiUrl ) {
		this.login = function (email, password) {
			return $http.get(apiUrl + 'login?email=' + email + '&password=' + password);
		}
		this.sessionCheck = function (action) {
			if (action === 'login') {
				return $http.get(apiUrl + 'login');
			} else if (action === 'logout') {
				return $http.get(apiUrl + 'logout');
			}
		}
	 }
)

.service(
	"postalService",
	function( $http, apiUrl ) {	      
		this.getPostal = function () {
			return $http.get(apiUrl + 'postal');
		}
			  
		this.insertPostal = function (action, amount) {
			var url = apiUrl + 'postal';
			var data = { 'action' : action, 'amount' : amount };
			return $http.post(url, data);
		}
	}
)

.controller('LoginController', ["$scope", '$window', '$timeout', "apiUrl", "loginService", function($scope, $window, $timeout, apiUrl, loginService) {
  
	$scope.login = [];
	
	if (window.location.href == 'http://modele-ad9bis.pl/learning-spa/#/login') {
		$scope.login.form = true;
		var action = 'login';
	} else if (window.location.href == 'http://modele-ad9bis.pl/learning-spa/#/logout') {
		var action = 'logout';
	}
  
	loginService.sessionCheck(action)
	.then(function (response) {
		if (response.data.success === true) {
			window.location = '#/products';
		} else {
			window.location = '#/login';
		}
	})
	
	$scope.loginAction = function() {
	        var email = $scope.login.email;
	        var password = $scope.login.password;
	        loginService.login(email, password)
	        .then(function (response) {
			if (response.data.success === true) {
			      $scope.login.success = response.data.reason;
			      $timeout(function () {
				      window.location = '#/products';
			      }, 2000);
			} else {
			      $scope.login.error = response.data.reason;
			}
	        })
	}
  
}])

.controller('PostalController', ["$scope", "loginService", "postalService", function($scope, loginService, postalService) {
  
	$scope.noPostal = null;
	$scope.postal = [];
	$scope.postal.inputAdd = undefined;
	$scope.postal.inputSubtract = undefined;
	$scope.postalError = undefined;
	$scope.postalMessage = undefined;
	
	function handleError ( response ) {
		if (! angular.isObject( response.data ) || response.data.success != true) {
			$scope.postalError = response.data.reason;
			return false;
		}
	}
			
	function handleSuccess ( response ) {
		return( response.data );
	}
  
	/*
	function getPostal() {
	      $http.get(apiUrl + 'postal')
	      .then(function(response){
		      if (response.data.success === true) {
			      $scope.postal = response.data;
			      $scope.postal.current = $scope.postal.current + ' zł';
		      } else {
			      $scope.postalerror = response.data.reason;
		      }
	      })
	}
	*/
	
	function getPostal() {
		postalService.getPostal()
		.then(function (response) {
			  handleError( response );
			  var result = handleSuccess( response ); 
			  $scope.postal = result;
			  $scope.postal.current = $scope.postal.current + ' zł';
		})
	}
	
	loginService.sessionCheck('login')
	.then(function (response) {
		if (response.data.success === true) {
			getPostal();
		} else {
			window.location = '#/login';
		}
	})
	
	$scope.inputChange = function(inputName) {
		if (inputName === 'inputAdd') {
			var secondName = 'inputSubtract';
		} else {
			var secondName = 'inputAdd';
		}
		if ($scope.postal[secondName] == true) {
		      $scope.postal[secondName] = undefined;
		}
		if ($scope.postal[inputName] == undefined) {
			$scope.postal[inputName] = true;
		} else {
		        $scope.postal[inputName] = undefined;
		}	
	}
	
	/*
	$scope.postalChange = function(action) {
		var amount = $scope.postal[action];
		if (amount == undefined || isNaN(amount) == true) {
		      $scope.postalerror = 'To chyba nie jest numer...';
		      return false;
		}
		$scope.postalerror = undefined;
		$scope.postalmessage = undefined;
		var url = apiUrl + 'postal';
		var data = $.param({
		      action: action,
		      amount: amount
	        });
		$http({
		    method: 'POST',
		    url: url,
		    data: data,
		    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
		})
		.then(function (response) {
			if (response.data.success == false) {
				$scope.postalerror = response.data.reason;
			} else {
				$scope.postalmessage = response.data.reason;
				$scope.postal.inputAdd = undefined;
				$scope.postal.inputSubtract = undefined;
				getPostal();
			}
		})
	}
	*/
	
	$scope.postalChange = function(action) {
		var amount = $scope.postal[action];
		if (amount == '' || isNaN(amount) == true) {
			$scope.postalError = 'To chyba nie jest numer...';
			return false;
		}
		$scope.postalError = undefined;
		$scope.postalMessage = undefined;
		postalService.insertPostal(action, amount)
		.then(function(response) {
			var result = handleError( response );
			var result = handleSuccess( response );
			$scope.postalMessage = result.reason;
			$scope.postal.inputAdd = undefined;
			$scope.postal.inputSubtract = undefined;
			getPostal();
		})
	}
	
}])

.controller('OrderController', ["$scope", "$http", "apiUrl", '$routeParams', '$window', 'loginService', function($scope, $http, apiUrl, $routeParams, $window, loginService) {
  
	$scope.dbUrl = null;
	$scope.deliveryNumber = null;
	$scope.discount = null;
	$scope.email = null;
	$scope.noOrder = null;
	$scope.orderData = [];
	$scope.orderDb = null;
	$scope.orderUpdate = [];
	$scope.otherActionId = null;
	$scope.panelName = [];
	$scope.updateResult = [];
	
	function idCheck($scope, $routeParams) {
		if ($routeParams.id != undefined && $routeParams.dataBase != undefined) {
			if ($routeParams.dataBase == 'new' || $routeParams.dataBase == 'old') {
				$scope.dbUrl = $routeParams.dataBase;  
				$scope.currentId = $routeParams.id;
				if ($scope.dbUrl == 'old') {
					$scope.currentDb = 'stary';
					$scope.panelName.current = 'SP';
					$scope.panelName.second = 'NP';
				} else {
					$scope.currentDb = 'nowy';
					$scope.panelName.current = 'NP';
					$scope.panelName.second = 'SP';
				}
				if ($routeParams.command != undefined && $routeParams.command != 'mail') {
					if ($routeParams.command == 'even') {
						var url = apiUrl + 'orders/' + $scope.dbUrl + '/' + $scope.currentId + '/even';
						$http.put(url)
						.then(function (response) {
							$scope.orderUpdate = response.data;
							if ($scope.orderUpdate.success == false) {
							      $scope.noOrder = 'Nie udało się wyrównać ilości produktów!';
							} else {
							      $scope.updateResult = $scope.orderUpdate;
							      console.log($scope.updateResult);
							}
						})
					} else if ($routeParams.command == 'discount') {
						if ($scope.dbUrl == 'new') {
							$scope.noOrder = '15% rabat jest stosowany wyłącznie na starym sklepie!';
							return false;
						}
						$http.get(apiUrl + 'orders/' + $scope.dbUrl + '/' + $scope.currentId + '?action=discount')
						.then(function(response){
						      $scope.discount = response.data;
						      if ($scope.discount.success == false) { 
							      $scope.noOrder = 'W starym sklepie brak zamówienia o nr: ' + $scope.currentId;
							      return false;
						      }
						      $scope.discountResult = $scope.discount;
						}) 
					} else if ($routeParams.command == 'voucher') { 
						if ($scope.dbUrl == 'new') {
							$scope.noOrder = 'Kupony rabatowy przyznawane są wyłącznie na starym sklepie!';
							return false;
						}
						$http.get(apiUrl + 'orders/' + $scope.dbUrl + '/' + $scope.currentId + '?basic=true')
						.then(function(response){
						      var customer = response.data.customer.id;
						      if (isNaN(customer) == true) {
							    $scope.noOrder = 'Błąd przy pobieraniu informacji o kliencie!';
						      }
						      $http.get(apiUrl + 'customer/' + $scope.dbUrl + '/' + customer + '/vouchers')
						      .then(function(response){
							      $scope.voucherResult = response.data;
						      })
						})
					} else {
						$scope.noOrder = 'Podano niewłaściwą komendę!';
					}
				} else {
					$http.get(apiUrl + 'orders/' + $scope.dbUrl + '/' + $scope.currentId)
					.then(function(response){
						$scope.orderData = response.data;
						if ($scope.orderData.success == false) {
							delete $scope.orderData;
							delete $scope.orderId;
							$scope.noOrder = 'W ' + $scope.currentDb + 'm sklepie brak zamówienia o nr: ' + $scope.currentId;
						} else {
							delete $scope.noOrder;
							if ($routeParams.command == 'mail') {
							      $scope.orderData.display = true;
							      $scope.orderData.undelivered = true;
							} else {
							      $scope.orderData.display = true;
							      $scope.orderData.details = true;
							}
						}
					}) 
				}
			} else {
				$scope.noOrder = 'Podano niewłaściwy adres bazy danych!';
				return false;
			}
		}
	}
	
	loginService.sessionCheck('login')
	.then(function (response) {
		if (response.data.success === true) {
			$scope.displayMain = true;
			idCheck($scope, $routeParams);
		} else {
			window.location = '#/login';
		}
	})
	
	$scope.additionalAction = function() {
	      if (isNaN($scope.otherActionId) == true) {
		    $scope.noOrder = $scope.otherActionId +'...? To ma być numer?';
		    return false;
	      }
	      if (($scope.otherAction == 0) || ($scope.otherActionId == null) || ($scope.otherActionId == 0)) {
		    return false;
	      } else if ($scope.otherAction == 'voucher') {
		      window.location = '#/orders/old/' + $scope.otherActionId + '/voucher';
	      } else if ($scope.otherAction == 'voucherCount') {
		      window.location = '#/orders/old/' + $scope.otherActionId + '/discount';
	      } else if ($scope.otherAction == 'mailOld') {
		      window.location = '#/orders/old/' + $scope.otherActionId + '/mail';
	      } else if ($scope.otherAction == 'mailNew') {
		      window.location = '#/orders/new/' + $scope.otherActionId + '/mail';
	      }
	}
	
	$scope.mail = function(currentId, dbUrl, action) {
	        $http.get(apiUrl + 'orders/' + dbUrl + '/' + currentId + '/mail?action=' + action + '&result=send')
		.then(function(response){
		        if (response.data.success === true) {
			      $scope.email = response.data.reason;
			} else {
			      $scope.noOrder = response.data.reason;
			}
		})
	}
	
	$scope.mailSendDeliveryNumber = function() {
	  alert($scope.orderData.deliveryNumber);
	       if ($scope.orderData.deliveryNumber == '' || $scope.orderData.deliveryNumber == '(00)') {
		      $scope.noOrder = 'Wprowadź numer przesyłki!';
		      return false;
	       } else {
		      $scope.noOrder = undefined;
		      $http.get(apiUrl + 'orders/' + $scope.dbUrl + '/' + $scope.currentId + '/mail?action=deliveryNumber&result=send&deliveryNumber=' + $scope.orderData.deliveryNumber)
		      .then(function(response){
			      if (response.data.success === true) {
				    $scope.email = response.data.reason;
			      } else {
				    $scope.noOrder = response.data.reason;
			      }
		      })
	       }
	}
	
	$scope.mailShowDeliveryNumber = function() {
		if ($scope.showDeliveryNumber == undefined) {
			$scope.orderData.deliveryNumber = '(00)';
			$scope.showDeliveryNumber = true;
		} else {
			$scope.showDeliveryNumber = undefined;
		}
	}
	
	$scope.mailVoucher = function(action) {
		if ($scope.voucherResult.lastVoucher == '' || isNaN($scope.voucherResult.lastVoucher) == true) {
		      $scope.noOrder = 'To chyba nie jest numer kuponu...';
		} else if ($scope.voucherResult.lastVoucher > 5) {
		      $scope.noOrder = 'Maksymalna możliwa liczba to 5!';
		} else {
			if (action == 'display') {
			$scope.noOrder = undefined;
			window.open("http://modele-ad9bis.pl/cms_spa/web/app_dev.php/orders/" + $scope.dbUrl + "/" + $scope.currentId + "/mail?action=voucher&result=display&voucherNumber=" + $scope.voucherResult.lastVoucher);
			} else if (action == 'send') {
			      $http.get(apiUrl + 'orders/' + $scope.dbUrl + '/' + $scope.currentId + '/mail?action=voucher&result=send&voucherNumber=' + $scope.voucherResult.lastVoucher)
			      .then(function(response){
				      if (response.data.success === true) {
					    $scope.email = response.data.reason;
				      } else {
					    $scope.noOrder = response.data.reason;
				      }
			      })
			}
		}
	}
	
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

.controller("ProductController", ["$scope", "$http", "apiUrl", '$routeParams', '$filter', '$window', 'loginService', function($scope, $http, apiUrl, $routeParams, $filter, $window, loginService){
  
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
	
	$http.get(apiUrl + 'categories')
	      .then(function(response){
		      $scope.categories = response.data;
	      }) 
	      
	$http.get(apiUrl + 'manufacturers')
	      .then(function(response){
		      $scope.manufactorers = response.data;
	      })
	
	//$http.get(apiUrl + 'products/conditions')
	//      .then(function(response){
	//	      $scope.data.activity = response.data.productActivity;
	//	      $scope.data.conditions = response.data.productConditions;
	//      })         	
	
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
			  window.location = '#/products';
		    }
		    $http.get(apiUrl + 'products/conditions')
		    .then(function(response){
			    $scope.data.activity = response.data.productActivity;
			    $scope.data.conditions = response.data.productConditions;
			    var currentUrl = apiUrl + 'products/' + $scope.productId;
			    $http.get(currentUrl)
			    .then(function(response){
				  $scope.fullEdition = response.data;
				  if ($scope.fullEdition.success == false) {
					window.location = '#/products';
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
		    })
		    $scope.productDetail = 'Pełna edycja produktu nr: ' + $scope.productId;
		    $scope.disabled = true;
		    $scope.progress = undefined;
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
	
	loginService.sessionCheck('login')
	.then(function (response) {
		if (response.data.success === true) {
			$scope.displayMain = true;
			idCheck($scope, $routeParams);
		} else {
			window.location = '#/login';
		}
	})
	
	$scope.checkIdBasic = function () {
	      checkIdBasic();
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
	
}]);
