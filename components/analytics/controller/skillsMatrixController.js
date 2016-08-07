angularModules.config(function ($stateProvider) {

    $stateProvider.state('skillsMatrix', {
        url: '/skillsMatrix?showFull',
        views: {
            "dataPanel": { templateUrl: "partials/analytics/skillsMatrix" }
        },
        resolve: {
            showFull: ['$stateParams', function ($stateParams) {
                return $stateParams.showFull;
            }],
        }
    });
});

angularModules.controller('SkillsMatrixCtrl', ['$rootScope', '$scope', '$stateParams', '$window', '$http', SkillsMatrixCtrl]);

function SkillsMatrixCtrl($rootScope, $scope, $stateParams, $window, $http) {
    $rootScope.showFull = $stateParams.showFull;

    function updateNameFontSize(start, end, data, graphDiv) {
        var height = graphDiv.offsetHeight - data.layout.margin.t;
        var rowSize = height / (end - start);
        var fontSize = Math.min(12, Math.floor(rowSize));
        $window.Plotly.relayout(graphDiv, {
            'yaxis.tickfont.size': fontSize,
        });
    }

    this.init = function (directiveElement) {
        $http.get('/api/skillsMatrix')
            .then(function(res) {
                var resData = res.data;
                if ($rootScope.showFull) {
                    resData.layout.height = $window.innerHeight - 30;
                }
                $window.Plotly.newPlot('graphDiv', resData.data, resData.layout, resData.config);
                var graphDiv = $window.document.getElementById('graphDiv');

                var tickvals = resData.layout.yaxis.tickvals;
                var numRows = tickvals[tickvals.length - 1];
                updateNameFontSize(0, numRows, resData, graphDiv);

                graphDiv.on('plotly_relayout', function(event, eventdata) {
                    if (event['yaxis.autorange'] === true) {
                        updateNameFontSize(0, numRows, resData, graphDiv);
                    }
                    var start = event['yaxis.range[0]'];
                    var end = event['yaxis.range[1]'];
                    if (start !== undefined || end !== undefined) {
                        updateNameFontSize(start, end, resData, graphDiv);
                    }
                });
            });
    };

    $scope.fullScreen = function () {
        $window.open('/skillsMatrix?showFull');
    }
}
