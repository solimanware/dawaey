angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $cordovaSQLite) {

  $scope.selectAll = function() {
    var db = $cordovaSQLite.openDB({name:"populated.db", location:'default'});
    $scope.results=[];
    var query="SELECT * FROM people" ;

    // Execute SELECT statement to load message from database.
        $cordovaSQLite.execute(db, query,[])
            .then(
                function(result) {

                    if (result.rows.length > 0) {

                        console.log(result.rows.item(0).firstname);
                        console.log(result.rows.item(0).lastname);
                        console.log("Message loaded successful, cheers!");
                    }
                },
                function(error) {
                    console.log("Error on loading: " + error.message);
                }
            );
  }
})

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
