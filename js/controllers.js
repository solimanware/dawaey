angular.module('starter.controllers', [])
  .controller('SearchCtrl', function($scope, $http, $ionicLoading, SearchService) {
    $scope.drugs = [];
    $scope.numberOfItemsToDisplay = 3; // Use it with limit to in ng-repeat

    SearchService.GetDrug().then(function(drugs) {
      $scope.drugs = drugs;
    });

    $scope.addMoreItem = function(done) {
      if ($scope.drugs.length > $scope.numberOfItemsToDisplay)
        $scope.numberOfItemsToDisplay += 3; // load number of more items
      $scope.$broadcast('scroll.infiniteScrollComplete')
    };
  })


.controller('DrugCtrl', function($scope, $stateParams, $http, $ionicLoading, DrugService) {
  var id = document.URL.split("/drug/")[1];

  DrugService.GetDrug().then(function(drugs) {
    for (var i = 0; i < drugs.length; i++) {
      if (drugs[i].id == id) {
        $scope.drug = drugs[i];
      }
    }
  });

  $scope.btn=function(){
       $window.open('https://www.google.com/search?q=panadol drug', '_system');
 }

})

.controller('AboutCtrl', function($scope) {

});
