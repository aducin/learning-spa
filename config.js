angular.module('ZappApp.config', ['ngRoute'])

.config(['$routeProvider', function($routeProvider){
                $routeProvider
                .when('/login',{
				    templateUrl: "view/login.html",
				    controller: "LoginController",
			   })
		.when('/logout',{
				    templateUrl: "view/login.html",
				    controller: "LoginController",
			   })
		.when('/orders',{
				    templateUrl: "view/orders.html",
				    controller: "OrderController",
				    controllerAs: "order"
				  })
		.when('/orders/:dataBase/:id/:command',{
				    templateUrl: "view/orders.html",
				    controller: "OrderController",
				  })
		.when('/orders/:dataBase/:id',{
				    templateUrl: "view/orders.html",
				    controller: "OrderController",
				  })
		.when('/postal',{
				    templateUrl: "view/postal.html",
				    controller: "PostalController",
				  })
                .when('/products',{
				    templateUrl: "view/products.html",
				    controller: "ProductController",
				  })
		.when('/products/:id',{
		  		    templateUrl: "view/products.html",
				    controller: "ProductController",
				  })
		.when('/products/:historyId/history',{
		  		    templateUrl: "view/roducts.html",
				    controller: "ProductController",
				  })
                .otherwise({redirectTo:'/login'});
}])