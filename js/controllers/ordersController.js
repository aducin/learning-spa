angular.module('ZappApp.OrderController', [])

.controller('OrderController', ["$scope", '$routeParams', '$window', 'loginService', 'orderModel', function($scope, $routeParams, $window, loginService, orderModel) {
  
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
						orderModel.evenQuantity($scope)
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
						orderModel.getDiscount($scope)
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
						orderModel.getCustomer($scope)
						.then(function(response){
						      var customer = response.data.customer.id;
						      if (isNaN(customer) == true) {
							    $scope.noOrder = 'Błąd przy pobieraniu informacji o kliencie!';
						      }
						      orderModel.getVoucher($scope, customer)
						      .then(function(response){
							      $scope.voucherResult = response.data;
						      })
						})
					} else {
						$scope.noOrder = 'Podano niewłaściwą komendę!';
					}
				} else {
					orderModel.getOrder($scope)
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

	loginService.verify($scope, 'login', 'orders');
	
	idCheck($scope, $routeParams);
	
	$scope.additionalAction = function() {
	      $scope.otherActionId = this.otherActionId;
	      $scope.otherAction = this.otherAction;
	      if (isNaN($scope.otherActionId) == true) {
		    $scope.noOrder = $scope.otherActionId +'...? To ma być numer?';
		    return false;
	      }
	      if (($scope.otherAction == 0) || ($scope.otherActionId == null)) {
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
	        orderModel.sendMail($scope, dbUrl, currentId, action)
		.then(function(response){
		        if (response.data.success === true) {
			      $scope.email = response.data.reason;
			} else {
			      $scope.noOrder = response.data.reason;
			}
		})
	}
	
	$scope.mailSendDeliveryNumber = function() {
	       if ($scope.orderData.deliveryNumber == '' || $scope.orderData.deliveryNumber == '(00)') {
		      $scope.noOrder = 'Wprowadź numer przesyłki!';
		      return false;
	       } else {
		      $scope.noOrder = undefined;
		      orderModel.sendDeliveryNumber($scope)
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
			      orderModel.sendVoucherNumber($scope)
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
	      $scope.orderId = this.orderId;
	      $scope.orderDb = this.orderDb;
	      if ($scope.orderDb == 0 || $scope.orderId == undefined) {
		    return false;
	      }
	      if (isNaN($scope.orderId) == true) {
		     $scope.noOrder = '"' + $scope.orderId + '"...? To ma być numer?';
		     delete $scope.orderId;
		     return false;
	      }
	      window.location = '#/orders/' + $scope.orderDb + '/' + $scope.orderId;
	}
}])