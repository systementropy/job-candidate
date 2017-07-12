var app = angular.module('myApp', ['ngRoute','ngFileUpload']);
app.config(['$qProvider', function ($qProvider) {
    $qProvider.errorOnUnhandledRejections(false);
}]);
app.config(function($routeProvider) {
    $routeProvider
    .when("/", {
        templateUrl : "views/Home.html"
    })
    .when("/Candidate", {
        templateUrl : "views/Candidate.html",
        controller:"candidateCtrl"
    })
    .when('/Postjob',{
        controller:"postjobCtrl"
    })
    .when("/Jobs", {
        templateUrl : "views/Jobs.html",
        controller:"jobsCtrl"
    })
    .when("/JobsLogin",{
        resolve:{
            "check":function($location,$rootScope){
                if(!$rootScope.loggedIn){
                    $location.path('/Jobs');
                }
            }
        },
        templateUrl : "views/JobsLogin.html",
        controller:"jobsloginCtrl"
    })
    .when("/CandidateLogin",{
        resolve:{
            "check":function($location,$rootScope){
                if(!$rootScope.loggedcandidate){
                    $location.path('/Candidate');
                }
            }
        },
        templateUrl : "views/CandidateLogin.html",
        controller:"candidateloginCtrl"
    })
    .when("/Apply",{
          resolve:{
            "check":function($location,$rootScope){
                if(!$rootScope.loggedIn){
                    $location.path('/Jobs');
                }
            }
        },
        templateUrl:"views/Apply.html",
        controller:"applyCtrl"
    })
    .when("/Check",{
         resolve:{
            "check":function($location,$rootScope){
                if(!$rootScope.loggedcandidate){
                    $location.path('/Candidate');
                }
            }
        },
        templateUrl:"views/Check.html",
        controller:"checkCtrl"
    });
});

app.controller('candidateCtrl',['$scope','$window','$location','$rootScope',function($scope, $window,$location,$rootScope){
    $scope.back=function(){
        $window.location = "#/"
    }
    $scope.login=function(){
        if($scope.username=='candidate' && $scope.password=='1234'){
            $rootScope.loggedcandidate=true;
         $location.path("/CandidateLogin");
        }
        else{
            alert("invalid credentials");
        }
    };
}]);
app.controller('jobsCtrl',['$scope','$window','$location','$rootScope',function($scope, $window,$location,$rootScope){
    $scope.back=function(){
        $window.location = "#/"
    }

    $scope.login=function(){
        if($scope.username=='job' && $scope.password=='1234'){
            $rootScope.loggedIn=true;
         $location.path("/JobsLogin");
        }
        else{
            alert("invalid credentials");
        }
    };
}]);
app.controller('jobsloginCtrl',['$scope','$window','$http',function($scope, $window,$http){
     $scope.back=function(){
        $window.location = "#/"
    }

    $http.get('http://localhost:3000/getjob').then(function successCallback(response) {
        $scope.job=response.data;
  },
  function errorCallback(response) {
      alert(response);
  });

}]);
app.controller('checkCtrl',['$scope','$window','$http',function($scope, $window,$http){
     $scope.back=function(){
        $window.location = "#/"
    }

    $http.get('http://localhost:3000/checkcandidate').then(function successCallback(response) {
        $scope.candidate=response.data;
  },
  function errorCallback(response) {
      alert(response);
  });
    $scope.alertcandidate=function(){
        alert('CANDIDATE HAS BEEN ALERTED');
    }

}]);
app.controller('postjobCtrl',['$scope','$window','$http','$location',function($scope, $window,$http,$location){

    $scope.post=undefined;
    $scope.addjob=function(){
        console.log($scope.job);
        $http.post('http://localhost:3000/addjob',$scope.job);
            $window.location="#/"
         alert('JOB POSTED');
    };
}]);
app.controller('candidateloginCtrl',['$scope','$window','Upload',function($scope, $window,Upload){
    $scope.back=function(){
        $window.location = "#/"
    }
     var vm = this;
    vm.submit = function(){ //function to call on form submit
        if (vm.upload_form.file.$valid && vm.file) { //check if from is valid
            vm.upload(vm.file); //call upload function
        }
    }
      vm.upload = function (file) {
        Upload.upload({
            url: 'http://localhost:3000/upload', //webAPI exposed to upload the file
            data:{file:file} //pass file as data, should be user ng-model
        }).then(function (resp) { //upload function returns a promise
            if(resp.data.error_code === 0){ //validate success
                $window.alert('File Uploaded Successfully');
            } else {
                $window.alert('an error occured');
            }
        }, function (resp) { //catch error
            console.log('Error status: ' + resp.status);
            $window.alert('Error status: ' + resp.status);
        }, function (evt) { 
            console.log(evt);
            var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
            vm.progress = 'progress: ' + progressPercentage + '% '; // capture upload progress
        });
    };
}]);
app.controller('applyCtrl',['$scope','$window','$http','$location',function($scope,$window,$http,$location){
        $scope.back=function(){
          $window.location = "#/"  
        }
         $scope.post=undefined;
        $scope.applyjob=function(){
        console.log($scope.candidate);
        $http.post('http://localhost:3000/applyjob',$scope.candidate);
         $location.path("/JobsLogin");
         alert('Successfully Applied');
    };
}]);