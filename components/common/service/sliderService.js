appServices.factory('SliderService', function($aside) {
  
  var sliderService = {
    
   openSlider: function(controller, template, resolveObject, size) {
     
    var asideState = {
      open: true,
      position: 'right'
    };
    
    function postClose() {
      asideState.open = false;
    }
    
    $aside.open({
      templateUrl: template,
      placement: 'right',
      size:  (size) ? size : 'lg',
      backdrop: true,
      backdropClass: 'bg-info',
      controller: controller,
      resolve: resolveObject
    }).result.then(postClose, postClose);
   }
    
  };
  return sliderService;
});