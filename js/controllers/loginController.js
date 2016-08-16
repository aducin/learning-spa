angular.module('ZappApp.LoginController', [])

.controller('LoginController', ["$scope", '$window', "loginService", function($scope, $window, loginService) {
  
	$scope.login = [];
	
	if (window.location.href == 'http://modele-ad9bis.pl/learning-spa/#/login') {
		$scope.login.form = true;
		var action = 'login';
	} else if (window.location.href == 'http://modele-ad9bis.pl/learning-spa/#/logout') {
		var action = 'logout';
	}
  
	loginService.verify($scope, action, 'login');
	
	$scope.loginAction = function() {
	        var email = $scope.login.email;
	        var password = $scope.login.password;
		var remember = $scope.login.remember;
		if (remember === undefined || remember === false) {
		      remember = 0;
		} else {
		      remember = 1;
		}
	        loginService.logProcess($scope, email, password, remember);
	}
  
}])