

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


app.controller("compose",function($scope,$http,$window)
{
    $scope.isnotother=true;
    $scope.isvisible=true;
    $scope.issubmit=true;
    $scope.notpdf=true;
    $scope.doc_url='Not Mentioned';
    $scope.theFile = '';
    $scope.FileMessage = 'file should be in .pdf type only';
    $scope.data_availabe=false;


    $http({
        method: 'POST',
        url: '/cdata'
    }).then(function (response){


        $scope.c_data = response.data;

    },function (error){
        console.log(error);
    });




    $scope.G_type_fun=function(data){

        if(data=='others'){

            $scope.isnotother=false;

        }
        else{
            $scope.isnotother=true;
        }

        $scope.isvisible=false;


    }


    $scope.G_dept_fun=function() {
        var G_dept= {
            dept_name:$scope.G_department
        };
        $http({
            method: 'POST',
            url: '/G_dept_data',
            data: G_dept
        }).then(function (response){

            $scope.G_type_data = response.data;

        },function (error){
            console.log(error);
        });
    };


    $scope.setFile = function(element) {
        $scope.$apply(function($scope) {
            $scope.theFile = element.files[0];
            $scope.FileMessage = '';
            var filename = $scope.theFile.name;
            console.log(filename.length);
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

        if($scope.data_availabe){

            $scope.delete($scope.upload_details[0].filename);

        }
        else{

        var file = $scope.myFile;

        var fd = new FormData();
        fd.append('file', file);

        $http({
            method: 'POST',
            url: '/multer',
            headers: {'Content-Type': undefined},
            transformRequest: angular.identity,
            data: fd
        }).then(function (response) {

            console.log("success!!");
            $scope.data_availabe=true;

            $scope.upload_details= response.data;
            $scope.doc_url=$scope.upload_details[0].link_url;
            $scope.file_status=$scope.upload_details[0].status;
            $scope.filename=$scope.upload_details[0].filename;
            $scope.issubmit=false;
        }, function (error) {
            console.log(error);
        });

        }
    };

    $scope.view_docs=function(){

        $window.open($scope.doc_url);

    };


    $scope.delete_docs = function() {

        $scope.delete($scope.upload_details[0].filename);

    };

    $scope.delete=function(data) {


        var delete_data={
            filename: data
        };

        $http({
            method: 'post',
            url: '/compose_file_delete',
            data: delete_data
        }).then(function (response) {

            $scope.data_availabe=false;

            $window.alert(response.data);
            $scope.data_availabe=false;

            $scope.file_status="";
            $scope.filename="";
            $scope.FileMessage = 'file should be in .pdf type only';
            $scope.doc_url='Not Uploaded';

        }, function (error) {
            console.log(error);
        });
    };

    $scope.count_character=function(data){

        $scope.length = $scope.length;

    };



    $scope.submitData=function()
    {


        var G_Related_name="Not Mentioned";

        if($scope.G_Rto_name!=null){

            G_Related_name=$scope.G_Rto_name;

        }


       var data=
            {
                cell_authority: $scope.G_type_data[1][0].desig_name,
                cell_name: $scope.G_type_data[1][0].cell_member_name,
                G_department: $scope.G_department,
                G_type: $scope.G_type,
                Gri_type:$scope.Gri_type,
                G_Rto_name: G_Related_name,
                G_description: $scope.G_description,
                G_doc: $scope.doc_url
            };


        if($scope.isnotother) {

            $http({
                method: 'POST',
                url: '/compose',
                data: data
            }).then(function (response) {

                $window.alert(response.data);
                $window.location.reload();
                $scope.isreply = true;


            }, function (error) {
                console.log(error);
            });
        }
        else{

            $http({
                method: 'POST',
                url: '/other',
                data: data
            }).then(function (response) {



                $window.alert(response.data);
                $scope.isreply = true;
                $window.location.reload()

            }, function (error) {
                console.log(error);
            });

        }

    };


   /*
    $scope.submitData=function()
    {
        var data=
            {
                cell_department: $scope.cell_department.dept_name,
                cell_authority: $scope.cell_authority.desig_name,
                cell_name: $scope.cell_name.cell_member_name,
                G_department: $scope.G_department.dept_name,
                G_type: $scope.G_type.gtype,
                G_Rto_name: $scope.G_Rto_name,
                G_description: $scope.G_description,
                G_doc: $scope.G_doc
            };

        $http({
            method: 'POST',
            url: '/compose',
            data: data
        }).then(function (response){


            $scope.c_data = response.data;

            $scope.isreply=true;

        },function (error){
            console.log(error);
        });
    };
    */

    });
