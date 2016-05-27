angular.module('starter.controllers', [])
  .controller('SearchCtrl', function($scope, $http, $ionicLoading, SearchService) {
  $scope.drugs = [];
  $scope.numberOfItemsToDisplay = 3; // Use it with limit to in ng-repeat

	SearchService.GetDrug().then(function(drugs){
		$scope.drugs = drugs;
	});

  $scope.addMoreItem = function(done) {
    if ($scope.drugs.length > $scope.numberOfItemsToDisplay)
        $scope.numberOfItemsToDisplay += 3; // load number of more items
        $scope.$broadcast('scroll.infiniteScrollComplete')
};
})


.controller('AboutCtrl', function($scope) {

});
