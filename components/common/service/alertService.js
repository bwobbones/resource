appServices.factory('AlertService', function(toastr) {
  
  var alertService = {
    add: function(type, msg, header) {
      if (header === undefined) {
        header = "Success!";
      }
      
      // toaster.pop(type, header, msg) ;
      switch (type) {
        case 'success':
          toastr.success(header, msg);
          break;
        case 'error':
          toastr.error(header, msg);
          break;
        case 'warning':
          toastr.warning(header, msg);
          break;  
        default:
          toastr.success(header, msg);
      }
      
    }
  };

  return alertService;
});