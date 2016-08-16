angular.module('ZappApp.PostalModel', [])

.service(
	"postalModel",
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