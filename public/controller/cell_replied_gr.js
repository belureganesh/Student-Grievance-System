app.controller('cell_replied_gr',function($scope, $http, $window) {


    if($scope.isreply)
    {
        console.log(isreply);
        $scope.isreply=false;
        $window.location.reload();
    }

    $http({
        method: 'POST',
        url: '/cell_replied_gr'
    }).then(function (response){

        $scope.cell_replied_table_data = response.data;
console.log("sent");
    },function (error){
        console.log(error);
    });

});