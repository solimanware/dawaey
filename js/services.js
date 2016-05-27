angular.module('starter.services', [])

.factory('SearchService', function($http){
	var BASE_URL = "js/drug.json";
	var drugs = [];

	return {
		GetDrug: function(){
			return $http.get(BASE_URL+'?drug=10').then(function(response){
				drugs = response.data.drug;
				return drugs;
			});
		},
		GetNewDrugs: function(){
			return $http.get(BASE_URL+'?drug=10').then(function(response){
				drugs = response.data.drug;
				return drugs;
			});
		}
	}
})
