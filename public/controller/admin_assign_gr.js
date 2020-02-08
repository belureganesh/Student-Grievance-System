app.controller("admin_assign_ctrl",function($scope,$http,$window)
{

    $http({
        method: 'POST',
        url: '/admin_assign_view_table'
    }).then(function (response){
        $scope.admin_assign_view_table_data = response.data;

    },function (error){
        console.log(error);
    });



    $scope.assign_gri_view=function(data){

        $scope.assign_gri_id=data;

        var data1={
            gri_id:data
        };

        $http({
            method: 'POST',
            url: '/admin_assign_gr_view',
            data: data1
        }).then(function (response){
            $scope.admin_assign_gr_view_data = response.data;

        },function (error){
            console.log(error);
        });


    };



    $scope.assign=function(){

        var data= {
        gri_id:$scope.assign_gri_id
    };
        $http({
            method: 'POST',
            url: '/assign',
            data: data
        }).then(function (response){
            $window.alert(response.data);
            $window.location.reload();

        },function (error){
            console.log(error);
        });

    };


    $scope.reject=function(){

        var data= {
            gri_id:$scope.assign_gri_id
        };

        $http({
            method: 'POST',
            url: '/reject',
            data: data
        }).then(function (response){

            $window.alert(response.data);
            $window.location.reload();

        },function (error){
            console.log(error);
        });

    };

});

