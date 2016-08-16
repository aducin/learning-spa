angular.module("ZappApp", [
	'ngRoute', 
	'ngSanitize', 
	'ngAnimate', 
	'ngCookies', 
	'ZappApp.config', 
	'ZappApp.LoginService', 
	'ZappApp.LoginModel', 
	'ZappApp.OrdersModel', 
	'ZappApp.PostalModel', 
	'ZappApp.ProductsModel', 
	'ZappApp.LoginController', 
	'ZappApp.OrderController', 
	'ZappApp.PostalController', 
	'ZappApp.ProductController'
])

.constant("apiDates", {
        "apiUrl": "http://modele-ad9bis.pl/cms_spa/web/app_dev.php/",
        "apiToken": "modele-ad9bis.pl_token"
});