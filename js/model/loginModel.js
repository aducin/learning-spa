angular.module('ZappApp.modelService', [])

.service(
	"loginModel",
	 function( $http, apiDates ) {
		this.login = function (email, password, remember) {
			return $http.get(apiDates.apiUrl + 'login', {
			    params: {
				email: email,
				password: password,
				remember: remember
			    }
			})
		}
		this.sessionCheck = function (action, token) {
			if (action === 'login') {
				if (token == undefined) {
					return $http.get(apiDates.apiUrl + 'login');
				} else {
					return $http.get(apiDates.apiUrl + 'login', {
					      params: {
						    token: token
					      }
					})
				}
			} else if (action === 'logout') {
				return $http.get(apiDates.apiUrl + 'logout');
			}
		}
	 }
)