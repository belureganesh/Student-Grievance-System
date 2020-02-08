app.controller("resolved_gr",function($scope,$http)
{
    $http({
        method: 'POST',
        url: '/resolved_grievance'
    }).then(function (response){


        $scope.student_applied_gr = response.data;
        console.log($scope.student_applied_gr);

    },function (error){
        console.log(error);
    });
});