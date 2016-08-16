angular.module('ZappApp.modelService', [])

.service(
	"modelService",
	 function( $http, apiUrl ) {
		this.login = function (email, password, remember) {
			return $http.get(apiUrl + 'login', {
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
					return $http.get(apiUrl + 'login');
				} else {
					return $http.get(apiUrl + 'login', {
					      params: {
						    token: token
					      }
					})
				}
			} else if (action === 'logout') {
				return $http.get(apiUrl + 'logout');
			}
		}
	 }
)