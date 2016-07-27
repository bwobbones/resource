describe("PersonnelRole", function() {
  
  var personnelRoleCtrl;
  var _;
  var scope;

  beforeEach(module('resource'));
  beforeEach(inject(function($controller, $rootScope) {

    // create a dummy scope
    rootScope = $rootScope;
    scope = $rootScope.$new();

    scope.form = {
      roles: []
    };

    // dependencies
    _ = window._;

    // create the constructor
    personnelRoleCtrl = $controller(PersonnelRoleCtrl, {
      $scope: scope,
      $modal: mockModal,
      _: _
    });
    
  }));

  afterEach(function() {
  });

  it('should make sure that dates are parsed correctly', function() {

    var expectedDateZeros = moment('03/05/2004', 'DD/MM/YYYY').valueOf();
    var expectedDateFull = moment('13/11/2014', 'DD/MM/YYYY').valueOf();
    var expectedDatePast = moment('13/11/1994', 'DD/MM/YYYY').valueOf();
    var expectedDatePastZeros = moment('03/05/1994', 'DD/MM/YYYY').valueOf();

    expect(scope.sortByRoleEnd({endDate: '03/05/2004'})).toBe(expectedDateZeros);
    expect(scope.sortByRoleEnd({endDate: '03/05/2004'})).toBe(expectedDateZeros);

    expect(scope.sortByRoleEnd({endDate: '13/11/2014'})).toBe(expectedDateFull);

    expect(scope.sortByRoleEnd({endDate: '13/11/1994'})).toBe(expectedDatePast);

    expect(scope.sortByRoleEnd({endDate: '03/05/1994'})).toBe(expectedDatePastZeros);
    expect(scope.sortByRoleEnd({endDate: '3/5/1994'})).toBe(expectedDatePastZeros);
  });

});

var mockModal = {
  result: {
    then: function(confirmCallback, cancelCallback) {
      //Store the callbacks for later when the user clicks on the OK or Cancel button of the dialog
      this.confirmCallBack = confirmCallback;
      this.cancelCallback = cancelCallback;
    }
  },
  close: function( item ) {
    //The user clicked OK on the modal dialog, call the stored confirm callback with the selected item
    this.result.confirmCallBack( item );
  },
  dismiss: function( type ) {
    //The user clicked cancel on the modal dialog, call the stored cancel callback
    this.result.cancelCallback( type );
  }
};

// mock services
var mockPersonnelData = {
  name: 'greg',
  commLog: []
};

var mockModalInstance = {
  close: function(value) {
    // noop
  }
};

var mockAlertService = {
  add: function(value) {
    // noop
  }
};