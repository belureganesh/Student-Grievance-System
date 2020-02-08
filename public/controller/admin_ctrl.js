app.controller('admin_ctrl',function($scope, $http, $window) {


    $http({
        method: 'POST',
        url: '/session_data'
    }).then(function (response) {

        $scope.session_data = response.data;

    }, function (error) {
        console.log(error);
    });

    $scope.logout = function () {

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
