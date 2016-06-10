angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
})

.controller('MainCtrl', function($scope, $state) {
    $scope.quick = function() {
      $state.go('app.quick');
    };
    $scope.trade = function() {
      $state.go('app.trade');
    };
    $scope.chname = function() {
      $state.go('app.chname');
    };
    $scope.price = function() {
      $state.go('app.price');
    };
    $scope.company = function() {
      $state.go('app.company');
    };
  })
  .controller('IntroCtrl', function($scope, $state, $ionicSlideBoxDelegate, $interval, $timeout) {

    // Called to navigate to the main app
    $scope.startApp = function() {
      $state.go('app.main');
    };
    $scope.next = function() {
      $ionicSlideBoxDelegate.next();
    };
    $scope.previous = function() {
      $ionicSlideBoxDelegate.previous();
    };

    // Called each time the slide changes
    $scope.slideChanged = function(index) {
      $scope.slideIndex = index;
    };
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

    //type effect
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

    // redirect
    var visited = localStorage.getItem('visited');
    if (visited == "You have visited this page before") {
        $state.go('app.main')
    } else {
      console.log("Stay here");
    }

    localStorage.setItem('visited', 'You have visited this page before');
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

  })
  .controller('PartenersCtrl', function($scope, $stateParams) {

  })
  .controller('SponsorsCtrl', function($scope, $stateParams) {

  })
  .controller('DeveloperCtrl', function($scope, $stateParams) {

  })

.controller('QuickCtrl', function($scope, $stateParams, $http, $ionicLoading, SearchService) {
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

.filter('trustURL', function($sce) {
  return function(url) {
    var newurl = 'https://www.google.com/search?q=' + url + ' drug'
    return $sce.trustAsResourceUrl(newurl);
  };
});
