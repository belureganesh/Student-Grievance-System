app.controller('ctrl',function($scope, $http, $window)
{
    $http({
        method: 'POST',
        url: '/session_data'
    }).then(function (response) {

        $scope.session_data = response.data;

    }, function (error) {
        console.log(error);
    });


    $scope.get_table=function() {
        $http({
            method: 'POST',
            url: '/status_table'
        }).then(function (response) {

            $scope.status_table_data = response.data;

        }, function (error) {
            console.log(error);
        });
    };

    $scope.logout=function(){

        $http({
            method: 'get',
            url: '/logout'
        }).then(function (response) {
            console.log("logout successfully");
            $window.location.reload();
        }, function (error) {
            console.log(error);
        });

    };


});