angular.module('ZappApp.ProductsModel', [])

.service(
	"productsModel",
	function( $http, apiUrl ) {
	  
		this.deleteModified = function (id) {
			var url = apiUrl + 'products/modified/' + id;
			$http.delete(url, config);
		}
		
		this.fullUpdate = function ($scope, data, config) {
			var url = apiUrl + 'products/' + $scope.fullEdition.id + '/' + $scope.fullEdition.attribute.new + '/' + $scope.fullEdition.attribute.old;
			return $http.put(url, data, config);
		}
	  
		this.getCategories = function () {
			return $http.get(apiUrl + 'categories');
		}
		
		this.getConditions = function () {
			return $http.get(apiUrl + 'products/conditions');
		}
		
		this.getFullEdition = function ($scope) {
			var currentUrl = apiUrl + 'products/' + $scope.productId;
			return $http.get(currentUrl)
		}
		
		this.getHistory = function ($routeParams) {
			return $http.get(apiUrl + 'products/' + $routeParams.historyId + '/history');
		}
	      
		this.getManufacturers = function () {
			return $http.get(apiUrl + 'manufacturers');
		}
      
		this.getModified = function () {
			return $http.get(apiUrl + 'products/modified');
		}
		
		this.getName = function (basicName, manufacturerSelect, categorySelect) {
			return $http.get(apiUrl + 'products', {
				params: {
					search: basicName,
					manufacturer: manufacturerSelect,
					category: categorySelect
				}
			})
		}
		
		this.getProduct = function ($scope) {
			if ($scope.data.singleSelect != null) {
				var currentUrl = apiUrl + 'products/' + $scope.checkId + '/' + $scope.data.singleSelect + '?basic=true';
			} else {
				var currentUrl = apiUrl + 'products/' + $scope.checkId + '?basic=true';
			}
			return $http.get(currentUrl);
		}
		
		this.updateData = function ($scope, db, data, config) {
			if (db == 'both') {
				  var url = apiUrl + 'products/' + $scope.basicId.id + '/' + $scope.basicId.attribute.new + '/' + $scope.basicId.attribute.old;
			} else if (db == 'linuxPl') {
				  var url = apiUrl + 'products/' + $scope.basicId.id + '/' + $scope.basicId.attribute.new;
			} else if (db == 'ogicom') {
				  var url = apiUrl + 'products/' + $scope.basicId.id + '/' + $scope.basicId.attribute.old;
			}
			return $http.put(url, data, config);
		}
		
	}
)