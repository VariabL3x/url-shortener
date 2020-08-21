var app = angular.module('app',['ngRoute']);

app.controller('submitController',['$scope','$location','$routeParams',function($scope,$location,$routeParams){
    const absUrl = `${$location.$$protocol}://${$location.$$host}:${$location.$$port}/`
    const error = getParam('error');
    $scope.url = '';
    $scope.slug = '';
    $scope.result = null;

    if(error){
        alert(error);
        window.location.href = '/';
    }
    $scope.createUrl = async function(){
        const url = $scope.url;
        const slug = $scope.slug;
        $scope.url = '';
        $scope.slug = '';
        const response = await fetch("/url",{
            method:"POST",
            headers:{
                'Content-Type':'application/json'
            },
            body:JSON.stringify({
                url,
                slug
            })
        })
        const json = await response.json();
        if(json.slug){
            $scope.created = `Your shorten url is ${absUrl}${json.slug}`
        }else{
            $scope.result = json.message;
        }
        $scope.$apply();
    }

    function getParam(q){
        let url = decodeURIComponent(window.location.search.substring(1))
        let queryString = url.split('&');
        let value , i;
        for(i = 0 ; i <queryString.length;i++){
            value = queryString[i].split("=");
            if(value[0] === q)
                return value[1] === undefined ? true : value[1];
        }
    }
}])