minhrDirectives.directive('documentTypeIcon', function() {

return {
            restrict:'E',
            scope:{
                doctype: "="
            },
            template:'<i class="fa fa-file-{{documentType}}-o fa-lg"></i>',
            controller: function($scope) {
                  $scope.docTypeToIconMap = {
                        "application/pdf": "pdf",
                        "application/msword": "word",
                        "application/vnd.openxmlformats-officedocument.wordprocessingml.document": "word",
                        "application/vnd.ms-excel": "excel",
                        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": "excel",
                        "text/plain": "text",
                  };
                 $scope.documentType = $scope.docTypeToIconMap[$scope.doctype];
           },
      }
 });
 