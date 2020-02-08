

app.directive('fileModel', ['$parse', function ($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;

            element.bind('change', function(){
                scope.$apply(function(){
                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


app.controller('cell_view_ctrl',function($scope, $http, $window) {

    $scope.IsVisible = false;
    $scope.doc_url='Not Uploaded';


    $scope.show_reply= function(){
        $scope.IsVisible = $scope.IsVisible = true;
    };

    $http({
        method: 'POST',
        url: '/cell_view_table'
    }).then(function (response){

        $scope.cell_view_table_data = response.data;



    },function (error){
        console.log(error);
    });


    $scope.gri_detail_reply=function(data) {
        console.log("gg");
        console.log(data);
        $scope.grievance_id=data;

        var sdata={g_id : data};
        $http({
            method: 'POST',
            url: '/cell_reply',
            data: sdata
        }).then(function (response) {

            $scope.g_reply = response.data;
            console.log($scope.g_reply);
            console.log("sent");

        }, function (error) {
            console.log(error);
        });
    };



    //file uploading------------------------------------------------------------------------------
    $scope.issubmit=true;
    $scope.notpdf=true;
    $scope.doc_url='Not Mentioned';
    $scope.theFile = '';
    $scope.FileMessage = 'file should be in .pdf type only';



    $scope.setFile = function(element) {
        $scope.$apply(function($scope) {
            $scope.theFile = element.files[0];
            $scope.FileMessage = '';
            var filename = $scope.theFile.name;
            console.log(filename.length)
            var index = filename.lastIndexOf(".");
            var strsubstring = filename.substring(index, filename.length);
            if (strsubstring == '.pdf' /*|| strsubstring == '.doc' || strsubstring == '.xls' || strsubstring == '.png' || strsubstring == '.jpeg' || strsubstring == '.png' || strsubstring == '.gif'*/)
            {
                console.log('File accepted sucessfully');
                $scope.notpdf=false;
                $scope.FileMessage ="file extension is correct"
            }
            else {

                $scope.FileMessage = 'please upload correct File Name, File extension should be .pdf';
                $scope.notpdf=true;
            }

        });
    };


    $scope.uploadFile = function() {

        var file = $scope.myFile;
        var fd = new FormData();
        fd.append('file', file);

        $http({
            method: 'POST',
            url: '/cell_file_upload',
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity,
            data: fd
        }).then(function (response) {

            console.log("success!!");
            $scope.upload_details= response.data;
            $scope.doc_url=$scope.upload_details[0].link_url;
            $scope.issubmit=false;
        }, function (error) {
            console.log(error);
        });

    };

    $scope.view_docs=function(){

        $window.open($scope.doc_url);

    };

    //file uploading------------------------------------------------------------------------------

    $scope.reply_to_grievance=function() {

        var reply_data={
            desc:$scope.cell_reply_description,
            file_url:$scope.doc_url,
            gri_id:$scope.grievance_id,
            stu_id:$scope.g_reply[0].std_id
        };

        $http({
            method: 'POST',
            url: '/reply_to_grievance',
            data: reply_data
        }).then(function (response) {
            console.log("success!!");
            $window.alert("response submitted successfully");
            //$window.location.reload();
            $scope.isreply=true;
        }, function (error) {
            console.log(error);
        });
    };



});