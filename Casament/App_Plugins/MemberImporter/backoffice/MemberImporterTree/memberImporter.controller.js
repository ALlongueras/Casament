function CustomSectionEditController($scope, $routeParams) {
	$scope.content = { tabs: [{ id: 1, label: "Tab 1" }, { id: 2, label: "Tab 2" }] };

	$scope.EditMode = function () {
		return $routeParams.create == 'true';
	};
};

angular.module("umbraco").directive('fileModel', ['$parse', function ($parse) {
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


angular.module("umbraco").service('fileUpload', ['$http', function ($http) {
    this.uploadFileToUrl = function(file, uploadUrl){
        /*var fd = new FormData();
        fd.append('file', file);
        $http.post(uploadUrl, fd, {
            transformRequest: angular.identity,
            headers: {'Content-Type': undefined},
            data: file
        })
        .success(function(){
        	alert("ok");
        })
        .error(function(){
        	alert("ko");
        });*/
var data = new FormData();

data.append("UploadedFile", file);

        var ajaxRequest = $.ajax({
           type: "POST",
           url: uploadUrl,
           contentType: false,
           processData: false,
           data: data
           });
    }
}]);

angular.module("umbraco").controller("UploadFileController", ['$scope', 'fileUpload', function($scope, fileUpload){
    
    $scope.uploadFile = function(){
        var file = $scope.myFile;
        console.log('file is ' + JSON.stringify(file));
        var uploadUrl = "/Umbraco/Api/MemberImporter/InsertMember";
        fileUpload.uploadFileToUrl(file, uploadUrl);
    };
    
}]);

angular.module("umbraco").controller('UploadCtrl', UploadCtrl);

UploadCtrl.$inject = ['$location', '$upload'];

    function UploadCtrl($location, $upload) {
        /* jshint validthis:true */
        var vm = this;
        vm.title = 'UploadCtrl';

        vm.onFileSelect = function ($files, user) {
            //$files: an array of files selected, each file has name, size, and type.
            for (var i = 0; i < $files.length; i++) {
                var file = $files[i];
                vm.upload = $upload.upload({
                    url: '/Umbraco/Api/MemberImporter/InsertMember',
                    data: { name: user.Name },
                    file: file, // or list of files ($files) for html5 only
                }).progress(function (evt) {
                    //console.log('percent: ' + parseInt(100.0 * evt.loaded / evt.total));
                }).success(function (data, status, headers, config) {
                    alert('Uploaded successfully ' + file.name);
                }).error(function (err) {
                    alert('Error occured during upload');
                });
            }
        };
       
    }
