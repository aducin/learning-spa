angular.module('ZappApp.PostalController', [])

.controller('PostalController', ["$scope", "loginService", "postalModel", function($scope, loginService, postalModel) {
  
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
	
	function getPostal() {
		postalModel.getPostal()
		.then(function (response) {
			  handleError( response );
			  var result = handleSuccess( response ); 
			  $scope.postal = result;
			  $scope.postal.current = $scope.postal.current + ' zł';
		})
	}
	
	loginService.verify($scope, 'login', 'postal');
	
	getPostal();
	
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
	
	$scope.postalChange = function(action) {
		var amount = $scope.postal[action];
		if (amount == '' || isNaN(amount) == true) {
			$scope.postalError = 'To chyba nie jest numer...';
			return false;
		}
		$scope.postalError = undefined;
		$scope.postalMessage = undefined;
		postalModel.insertPostal(action, amount)
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