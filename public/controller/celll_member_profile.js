app.controller("cell_member_edit",function($scope,$http,$window)
{


    $http({
        method: 'POST',
        url: '/cell_member_edit_view'
    }).then(function (response){

        $scope.cell_mem_prof_data = response.data;

        $scope.cell_member_id=$scope.cell_mem_prof_data[0][0].cell_member_id;
        $scope.cell_member_name=$scope.cell_mem_prof_data[0][0].cell_member_name;
        $scope.desig_name=$scope.cell_mem_prof_data[0][0].desig_name;
        $scope.dept_id=$scope.cell_mem_prof_data[0][0].dept_id;
        $scope.dept_name=$scope.cell_mem_prof_data[0][0].dept_name;
        $scope.cell_member_mob_no=$scope.cell_mem_prof_data[0][0].cell_member_mob_no;
        $scope.cell_member_email_id=$scope.cell_mem_prof_data[0][0].cell_member_email_id;
        $scope.cell_member_pass=$scope.cell_mem_prof_data[0][0].cell_member_pass;

    },function (error){
        console.log(error);
    });

    $scope.cell_edit_reset=function() {

        $scope.cell_member_id=$scope.cell_mem_prof_data[0][0].cell_member_id;
        $scope.cell_member_name=$scope.cell_mem_prof_data[0][0].cell_member_name;
        $scope.desig_name=$scope.cell_mem_prof_data[0][0].desig_name;
        $scope.dept_name=$scope.cell_mem_prof_data[0][0].dept_name;
        $scope.dept_id=$scope.cell_mem_prof_data[0][0].dept_id;
        $scope.cell_member_mob_no=$scope.cell_mem_prof_data[0][0].cell_member_mob_no;
        $scope.cell_member_email_id=$scope.cell_mem_prof_data[0][0].cell_member_email_id;
        $scope.cell_member_pass=$scope.cell_mem_prof_data[0][0].cell_member_pass;


    };

    $scope.cell_prof_submit = function(){

        var data={

            cell_member_id:$scope.cell_member_id,
            cell_member_name:$scope.cell_member_name,
            desig_id:$scope.desig_id,
            dept_id:$scope.dept_id,
            cell_member_mob_no:$scope.cell_member_mob_no,
            cell_member_email_id:$scope.cell_member_email_id,
            cell_member_pass:$scope.cell_member_pass

        };

        $http({
            method: 'POST',
            url: '/cell_member_prof_edit',
            data: data
        }).then(function (response){

            $window.alert(response.data);
            $window.location.reload();

        },function (error){
            console.log(error);
        });

    };


});