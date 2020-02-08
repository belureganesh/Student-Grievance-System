
app.controller('admin_view_ctrl',function($scope, $http, $window) {

    $http({
        method: 'POST',
        url: '/admin_view_table'
    }).then(function (response){
        $scope.admin_view_table_data = response.data;

    },function (error){
        console.log(error);
    });

    $http({
        method: 'POST',
        url: '/admin_view_stu_gr'
    }).then(function (response){
        $scope.admin_view_stu_gr_data = response.data;

    },function (error){
        console.log(error);
    });
});/**
 * Created by kishor on 23/04/2019.
 */
