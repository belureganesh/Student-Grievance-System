
app.controller("status",function($scope,$http,$window)
    {

        if($scope.isreply)
        {
            console.log(isreply);
            $scope.isreply=false;
            $window.location.reload();
        }

        $scope.isresonded=false;

        $http({
            method: 'POST',
            url: '/status_table'
        }).then(function (response){

            $scope.status_table_data = response.data;

        },function (error){
            console.log(error);
        });


        $scope.gri_detail=function(data) {
            console.log("gg");
            console.log(data);
            $scope.id=data;
            var sdata={g_id : data};
            $http({
                method: 'POST',
                url: '/gri_detail',
                data: sdata
            }).then(function (response) {

                $scope.G_data_in_model = response.data;
                console.log($scope.G_data_in_model);

                console.log($scope.G_data_in_model[1][0].count);

                if($scope.G_data_in_model[1][0].count>0){

                    $scope.isresonded=true;

                    $http({
                        method: 'POST',
                        url: '/reps_detail_to_student',
                        data: sdata
                    }).then(function (response){

                        $scope.resp_data = response.data;

                    },function (error){
                        console.log(error);
                    });

                }
                else{

                    $scope.isresonded=false;
                }



            }, function (error) {
                console.log(error);
            });
        }

        $scope.view_docs=function(data){

            $window.open(data);

        };

        $scope.Resolved=function(){
            var data={
                data:$scope.id
            };
            $http({
                method: 'POST',
                url: '/resolve',
                data: data
            }).then(function (response){
                $window.alert(response.data);
                $window.location.reload();
            },function (error){
                console.log(error);
            });

        };


        $scope.ReApply=function(){



        }


    });