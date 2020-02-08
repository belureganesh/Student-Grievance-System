app.controller("admin_view_cell_ctrl",function($scope,$http,$window)
{


    $http({
        method: 'POST',
        url: '/admin_view_cell_member'
    }).then(function (response){
        $scope.admin_view_cell_member = response.data;

    },function (error){
        console.log(error);
    });


});