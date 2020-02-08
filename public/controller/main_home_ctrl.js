app.controller('main_home_ctrl', function ($scope, $http,$window) {


    $scope.partialview = "views/Login.html";
    $scope.login = function () {
        $scope.partialview = "views/Login.html";
    };
    $scope.Register = function () {
        $scope.partialview = "views/Register.html"
    };




});



app.controller('register_ctrl', function ($scope, $http, $window) {

    $scope.login_message="";
    $scope.block=true;


    if($scope.isinvalid){
        $window.alert("Invalid Credential");
        $scope.isinvalid=false;

    };


    $scope.register_submit=function(){

        var data={
            fname:$scope.fName,
            DOB:$scope.dob,
            Mobile_No:$scope.mob_no,
            Branch:$scope.branch,
            year:$scope.year,
            mail:$scope.mail,
            userId:$scope.userId,
            password:$scope.password,
            confirm_password:$scope.confirm_password
        };

        $window.alert("Do you want to register as "+$scope.userId);

        $http({
            method: 'post',
            url: '/registration',
            data: data
        }).then(function (response) {
            $scope.login_message=response.data;
            $window.location.reload();
        }, function (error) {
            console.log(error);
        });


        $http({
            method: 'get',
            url: '/redirect_to_login'
        }).then(function (error) {
            console.log(error);
        });


    };

    $scope.checker = function() {

        if ($scope.confirm_password == $scope.password) {
            $scope.block = false;
        }
        else {
            $scope.block = true;
        }
    };




    $scope.login=function()
    {

        $scope.isinvalid=true;

        /*var data={
            uname:$scope.uname,
            pass:$scope.pass,
            user_type:$scope.user_type
        };

        $http({
            method: 'POST',
            url: '/login',
            data: data
        }).then(function (error){
            console.log(error);
        });*/

    }


});