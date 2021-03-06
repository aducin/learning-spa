angular.module('ZappApp.OrdersModel', [])

.service(
	"orderModel",
	function( $http, apiDates ) {
		this.evenQuantity = function ($scope) {
			var url = apiDates.apiUrl + 'orders/' + $scope.dbUrl + '/' + $scope.currentId + '/even';
			return $http.put(url);
		}
		
		this.getCustomer = function ($scope) {
			return $http.get(apiDates.apiUrl + 'orders/' + $scope.dbUrl + '/' + $scope.currentId + '?basic=true');
		}
		
		this.getDiscount = function ($scope) {
			return $http.get(apiDates.apiUrl + 'orders/' + $scope.dbUrl + '/' + $scope.currentId + '?action=discount');
		}
		
		this.getOrder = function ($scope) {
			return $http.get(apiDates.apiUrl + 'orders/' + $scope.dbUrl + '/' + $scope.currentId);
		}
		
		this.getVoucher = function ($scope, customer) {
			return $http.get(apiDates.apiUrl + 'customer/' + $scope.dbUrl + '/' + customer + '/vouchers');
		}
		
		this.sendMail = function ($scope, dbUrl, currentId, action) {
			return $http.get(apiDates.apiUrl + 'orders/' + dbUrl + '/' + currentId + '/mail', {
				params: {
					action: action,
					result: 'send'
				}
			})
		} 
		
		this.sendDeliveryNumber = function ($scope) {
			return $http.get(apiDates.apiUrl + 'orders/' + $scope.dbUrl + '/' + $scope.currentId + '/mail', {
				params: {
					action: 'deliveryNumber',
					result: 'send',
					deliveryNumber: $scope.orderData.deliveryNumber
				}
			})
		}
		
		this.sendVoucherNumber = function ($scope) {
			return $http.get(apiDates.apiUrl + 'orders/' + $scope.dbUrl + '/' + $scope.currentId + '/mail', {
				params: {
					action: 'voucher',
					result: 'send',
					voucherNumber: $scope.voucherResult.lastVoucher
				}
			})
		}
	}
)