app.controller("add_cell_member",function($scope,$http,$window)
{


    $http({
        method: 'POST',
        url: '/admin_view_dept_design_name',
    }).then(function (response) {

        $scope.view_of_dept = response.data;
        //console.log("vhhb");
    }, function (error) {
        console.log(error);
    });


    $scope.submit_it=function() {
    var data = {
        cell_id:$scope.cell_id,
        cell_name:$scope.cell_name,
        desig_id:$scope.desig_id,
        dept_id:$scope.dept_id,
        contact:$scope.contact,
        E_mail:$scope.E_mail,
        pass:$scope.pass
    };

        $http({
            method: 'POST',
            url: '/add_cell_member',
            data: data
        }).then(function (response) {

            $window.alert(response.data);

        },function (error) {
        console.log(error);
    });

};

    $scope.reset_it=function(){

        $scope.cell_id="";
        $scope.cell_name="";
        $scope.desig_id="";
        $scope.dept_id="";
        $scope.contact="";
        $scope.E_mail="";
        $scope.pass="";

    }

});