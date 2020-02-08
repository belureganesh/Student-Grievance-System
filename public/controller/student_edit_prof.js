app.controller("student_edit_prof",function($scope,$http,$filter){



    $http({
        method: 'POST',
        url: '/student_edit_prof'
    }).then(function (response){

        $scope.stu_profile = response.data;

        console.log($scope.stu_profile);


        $scope.stu_id=$scope.stu_profile[0][0].std_id;
        $scope.stu_name=$scope.stu_profile[0][0].std_name;
        var temp=$scope.stu_profile[0][0].dob;

        var temp1 = $filter('date')(temp, "yyyy/MM/dd");
        $scope.B_date = new Date(temp1);

        $scope.dob=$scope.B_date;
        $scope.dept_id=$scope.stu_profile[0][0].dept_id;
        $scope.dept_name=$scope.stu_profile[0][0].dept_name;
        $scope.mob_no=$scope.stu_profile[0][0].mobile_no;
        $scope.year=$scope.stu_profile[0][0].std_year;
        $scope.E_mail=$scope.stu_profile[0][0].std_email_id;
        $scope.pass=$scope.stu_profile[0][0].pass;

    },function (error){
        console.log(error);
    });

    $scope.reset_profile=function() {

        $scope.stu_id=$scope.stu_profile[0][0].std_id;
        $scope.stu_name=$scope.stu_profile[0][0].std_name;
        $scope.dob=$scope.B_date;
        $scope.dept_name=$scope.stu_profile[0][0].dept_name;
        $scope.dept_id=$scope.stu_profile[0][0].dept_id;
        $scope.mob_no=$scope.stu_profile[0][0].mobile_no;
        $scope.year=$scope.stu_profile[0][0].std_year;
        $scope.E_mail=$scope.stu_profile[0][0].std_email_id;
        $scope.pass=$scope.stu_profile[0][0].pass;

    };



});