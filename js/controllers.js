angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope) {
})
.controller('LoginCtrl', function($scope, $http, $state) {
  $scope.user = {};
  $scope.doLogin = function() {
  console.log(JSON.stringify($scope.user));
  $http({
    url: 'http://api.dawaey.com/api/login.php',
    method: "POST",
    data: 'user=' + JSON.stringify($scope.user),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data, status, headers, config) {
        console.log(data);
        if (data == "Everything is okay") {
          //alert("Loging")
          localStorage.logged = true
          localStorage.user = JSON.stringify($scope.user)
          $state.go('app.main');

        }else if (data == "Something wrong with email or password") {
          alert("Something wrong with email or password")
        }

    }).error(function (data, status, headers, config) {});


  }

})
.controller('SignupCtrl', function($scope, $timeout, $filter, $http, $state) {
  $scope.user = {};
  $scope.doSignup = function() {
    //console.log($scope.user);
    //console.log($scope.user.date);
    $scope.user.date = $filter('date')($scope.user.date, "yyyy-MM-dd");
//    console.log($scope.user)
  //  var x = $scope.user
  //  $.post("http://api.dawaey.com/index.php", { user : x}, function(result){
  //        alert(result)
  //      });
  //console.log(typeof $scope.user);
//  var x = $scope.user
  console.log(JSON.stringify($scope.user));
  $http({
    url: 'http://api.dawaey.com/api/signup.php',
    method: "POST",
    data: 'user=' + JSON.stringify($scope.user),
    headers: {'Content-Type': 'application/x-www-form-urlencoded'}
    }).success(function (data, status, headers, config) {
        console.log(data);
        if (data == "Usesr created successfully") {
          alert("User created successfully")
          localStorage.logged = true
          localStorage.user = JSON.stringify($scope.user)
          $state.go('app.main');

        }else if (data == "Email already exsits") {
          alert("Email already exists")
        }

    }).error(function (data, status, headers, config) {});


  }


})
.controller('PrivacyCtrl', function($scope) {

})
.controller('MenuCtrl', function($scope, $state) {
$scope.logOut = function logout() {
  localStorage.clear();
  $state.go('app.intro');

}
})
.controller('MainCtrl', function($scope, $state, $filter, $stateParams, $http, $ionicLoading, SearchService) {
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

  $scope.showSelectValue = function(mySelect) {
      console.log(mySelect);
      if (mySelect == "quick") {
        console.log("stay here");
        $state.go('app.quick');

      } else if (mySelect == "trade") {
        console.log("go search trade");
        $scope.orderByVar = "tradename"
        $state.go('app.trade');


      } else if (mySelect == "activeingredient") {
        console.log("go search activeingredient");
        $scope.orderByVar = "activeingredient"
        $state.go('app.activeingredient');


      } else if (mySelect == "price") {
        console.log("go search price");
        $scope.orderByVar = "price"
        $state.go('app.price');

      } else if (mySelect == "company") {
        console.log("go search company");
        $scope.orderByVar = "company"
        $state.go('app.company');

      } else if (mySelect == "approximate") {
        console.log("go search approximate");
        $scope.orderByVar = "tradename"
        $state.go('app.approximate');
      }
  }

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
    $scope.signUp = function() {
      $state.go('app.signup');
    };
    $scope.startApp = function() {
      if (localStorage.logged == "true") {
        $state.go('app.main');
      }else{
        $state.go('app.login');
      }
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
    var content = 'أهلاً بكم في تطبيق دوائي .. التطبيق رقم واحد لبحث الأدوية .. والذي يتيح لك العديد من خيارات البحث عن الدواء ... سنأخذك في جوله كيف تتعامل مع التطبيق';

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
    if (visited == "You have visited this page before" && localStorage.logged == "true") {
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
