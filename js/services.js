angular.module('starter.services', [])

.factory('SearchService', function($http){
	var BASE_URL = "js/drug.json";
	var drugs = [];

	return {
		GetDrug: function(){
			return $http.get(BASE_URL+'?drug=10').then(function(response){
				drugs = response.data;
				return drugs;
			});
		},
		GetNewDrugs: function(){
			return $http.get(BASE_URL+'?drug=10').then(function(response){
				drugs = response.data;
				return drugs;
			});
		}
	}
})
.factory('DrugService', function($http){
	var BASE_URL = "js/drug.json";
	var drugs = [];

	return {
		GetDrug: function(){
			return $http.get(BASE_URL).then(function(response){
				drugs = response.data;
				return drugs;
			});
		}
	}
})
.directive('hideTabs', function($rootScope) {
  return {
      restrict: 'A',
      link: function($scope, $el) {
          $rootScope.hideTabs = 'tabs-item-hide';
          $scope.$on('$destroy', function() {
              $rootScope.hideTabs = '';
          });
      }
  };
});
