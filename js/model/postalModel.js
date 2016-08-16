angular.module('ZappApp.PostalModel', [])

.service(
	"postalModel",
	function( $http, apiDates ) {	      
		this.getPostal = function () {
			return $http.get(apiDates.apiUrl + 'postal');
		}
			  
		this.insertPostal = function (action, amount) {
			var url = apiDates.apiUrl + 'postal';
			var data = { 'action' : action, 'amount' : amount };
			return $http.post(url, data);
		}
	}
)