angular.module('starter.controllers', [])
  .controller('IntroCtrl', function($scope, $state, $interval, $timeout) {

    $scope.safeApply = function(fn) {

      var phase = this.$root.$$phase;

      if (phase == '$apply' || phase == '$digest') {

        if (fn && (typeof(fn) === 'function')) {

          fn();

        }

      } else {

        this.$apply(fn);

      }

    };


    var content = 'شكراً لإختيارك تطبيق دوائي ... أفضل تطبيق محدث لبحث الدواء ... سنأخذك في جوله كيف تتعامل مع التطبيق';

    $scope.type = "";
    var i = 0;

    var timer = $interval(function() {
      if (i < content.length)
        $scope.type += content[i];
      else {
        $interval.cancel(timer);
        console.log('cancelling');
      }

      i++;
      $scope.safeApply();
    }, 100);
    $timeout(function() {
      $scope.swipe = true;
    }, 10000);

    var visited = localStorage.getItem('visited');
    if (visited == "You have visited this page before") {
      $state.go('tab.search')
    } else {
      console.log("Stay here");
    }

    localStorage.setItem('visited', 'You have visited this page before');


    // Move to the next slide
    $scope.next = function() {
      $scope.$broadcast('slideBox.nextSlide');
    };
    // Move to the previous slide
    $scope.skip = function() {
      $state.go('tab.search')
    };
  })
  .controller('SearchCtrl', function($scope, $state, $http, $ionicLoading, SearchService) {
    //Start here
    $scope.drugs = [];
    $scope.numberOfItemsToDisplay = 10; // Use it with limit to in ng-repeat

    SearchService.GetDrug().then(function(drugs) {
      $scope.drugs = drugs;
    });

    $scope.addMoreItem = function(done) {
      if ($scope.drugs.length > $scope.numberOfItemsToDisplay)
        $scope.numberOfItemsToDisplay += 10; // load number of more items
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

  $scope.btn = function() {
    $window.open('https://www.google.com/search?q=panadol drug', '_system');
  }

})

.controller('AboutCtrl', function($scope) {

  })
  .filter('trustURL', function($sce) {
    return function(url) {
      var newurl = 'https://www.google.com/search?q=' + url + ' drug'
      return $sce.trustAsResourceUrl(newurl);
    };
  })
