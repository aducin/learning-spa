angular.module('ZappApp.ProductsModel', [])

.service(
	"productsModel",
	function( $http, apiDates ) {
	  
		this.deleteModified = function (id, config) {
			var url = apiDates.apiUrl + 'products/modified/' + id;
			return $http.delete(url, config);
		}
		
		this.fullUpdate = function ($scope, data, config) {
			var url = apiDates.apiUrl + 'products/' + $scope.fullEdition.id + '/' + $scope.fullEdition.attribute.new + '/' + $scope.fullEdition.attribute.old;
			return $http.put(url, data, config);
		}
	  
		this.getCategories = function () {
			return $http.get(apiDates.apiUrl + 'categories');
		}
		
		this.getConditions = function () {
			return $http.get(apiDates.apiUrl + 'products/conditions');
		}
		
		this.getFullEdition = function ($scope) {
			var currentUrl = apiDates.apiUrl + 'products/' + $scope.productId;
			return $http.get(currentUrl)
		}
		
		this.getHistory = function ($routeParams) {
			return $http.get(apiDates.apiUrl + 'products/' + $routeParams.historyId + '/history');
		}
	      
		this.getManufacturers = function () {
			return $http.get(apiDates.apiUrl + 'manufacturers');
		}
      
		this.getModified = function () {
			return $http.get(apiDates.apiUrl + 'products/modified');
		}
		
		this.getName = function (basicName, manufacturerSelect, categorySelect) {
			return $http.get(apiDates.apiUrl + 'products', {
				params: {
					search: basicName,
					manufacturer: manufacturerSelect,
					category: categorySelect
				}
			})
		}
		
		this.getProduct = function ($scope) {
			if ($scope.data.singleSelect != null) {
				var currentUrl = apiDates.apiUrl + 'products/' + $scope.checkId + '/' + $scope.data.singleSelect + '?basic=true';
			} else {
				var currentUrl = apiDates.apiUrl + 'products/' + $scope.checkId + '?basic=true';
			}
			return $http.get(currentUrl);
		}
		
		this.updateData = function ($scope, db, data, config) {
			if (db == 'both') {
				  var url = apiDates.apiUrl + 'products/' + $scope.basicId.id + '/' + $scope.basicId.attribute.new + '/' + $scope.basicId.attribute.old;
			} else if (db == 'linuxPl') {
				  var url = apiDates.apiUrl + 'products/' + $scope.basicId.id + '/' + $scope.basicId.attribute.new;
			} else if (db == 'ogicom') {
				  var url = apiDates.apiUrl + 'products/' + $scope.basicId.id + '/' + $scope.basicId.attribute.old;
			}
			return $http.put(url, data, config);
		}
		
	}
)