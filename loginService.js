angular.module('ZappApp.LoginService', [])

.service(
	"loginService",
	 function( $cookies, $location, $timeout, modelService ) {
		this.logProcess = function ($scope, email, password, remember) {
			modelService.login(email, password, remember)
			.then(function (response) {
				if (response.data.success === true) {
				      if (response.data.token != false) {
					      var expireDate = new Date();
					      expireDate.setDate(expireDate.getDate() + 7);
					      $cookies.put('modele-ad9bis.pl_token', response.data.token, {'expires': expireDate});
				      }
				      $scope.login.success = response.data.reason;
				      $timeout(function () {
					      window.location = '#/products';
				      }, 2000);
				} else {
				      $scope.login.error = response.data.reason;
				}
			})
		}
		this.verify = function ($scope, action, origin) {
			if (action === 'login') {
				var token = $cookies.get('modele-ad9bis.pl_token');
			} else if (action === 'logout') {
				$cookies.remove('modele-ad9bis.pl_token');
			}
			modelService.sessionCheck(action, token)
			.then(function (response) {
				if (response.data.success === true) {
					if (origin === 'products') {
						if (response.data.token != false && response.data.token != undefined) {
							var expireDate = new Date();
							expireDate.setDate(expireDate.getDate() + 7);
							$cookies.remove('modele-ad9bis.pl_token');
							$cookies.put('modele-ad9bis.pl_token', response.data.token, {'expires': expireDate});
						}
					} else if (origin === 'login') {
						$location.path( "/products" );
					}
					$scope.displayMain = true;
				} else {
				        $location.path( "/login" );
				}
			})
		}
	 }
)