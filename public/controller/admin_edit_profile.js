app.controller("admin_edit",function($scope,$http,$window)
{


    $http({
        method: 'POST',
        url: '/admin_edit_view'
    }).then(function (response){

        $scope.cell_mem_prof_data = response.data;

        $scope.admin_id=$scope.cell_mem_prof_data[0].cell_member_id;
        $scope.admin_name=$scope.cell_mem_prof_data[0].cell_member_name;
        $scope.admin_mob_no=$scope.cell_mem_prof_data[0].desig_name;
        $scope.dept_email=$scope.cell_mem_prof_data[0].dept_name;

    },function (error){
        console.log(error);
    });

    $scope.admin_edit_reset=function() {

        $scope.admin_id=$scope.cell_mem_prof_data[0].cell_member_id;
        $scope.admin_name=$scope.cell_mem_prof_data[0].cell_member_name;
        $scope.admin_mob_no=$scope.cell_mem_prof_data[0].desig_name;
        $scope.dept_email=$scope.cell_mem_prof_data[0].dept_name;


    };


});