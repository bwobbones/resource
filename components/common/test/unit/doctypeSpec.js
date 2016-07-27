describe('MinHR Doctype directive', function() {
    var elm,        // our directive jqLite element
        scope;      // the scope where our directive is inserted

    // load the modules we want to test
    beforeEach(module('resource'));

    beforeEach(inject(function($rootScope, $compile) {
        scope = $rootScope.$new();
    }));
    
    function compileDirective(tpl) {
        if (!tpl) tpl = '<document-type-icon doctype="pdf" class="pull-left ng-isolate-scope"></document-type-icon>'
        inject(function($compile) {
            elm = $compile(tpl)(scope);
        });
        scope.$digest();
    }
    
    it('pdf icon should correspond to pdf document type', function() {
        scope.doctype = 'application/pdf';
        compileDirective('<document-type-icon doctype="doctype"></document-type-icon>');
        
        expect(elm.find('i').attr('class')).toEqual('fa fa-file-pdf-o fa-lg')
        scope.$digest();
    });
    
    it('word icon should correspond to word document type', function() {
        scope.doctype = 'application/msword';
        compileDirective('<document-type-icon doctype="doctype"></document-type-icon>');
        
        expect(elm.find('i').attr('class')).toEqual('fa fa-file-word-o fa-lg')
        scope.$digest();
    });
    
     it('excel icon should correspond to excel document type', function() {
        scope.doctype = 'application/vnd.ms-excel';
        compileDirective('<document-type-icon doctype="doctype"></document-type-icon>');
        
        expect(elm.find('i').attr('class')).toEqual('fa fa-file-excel-o fa-lg')
        scope.$digest();
    });
    
    it('text icon should correspond to plain-text document type', function() {
        scope.doctype = 'text/plain';
        compileDirective('<document-type-icon doctype="doctype"></document-type-icon>');
        
        expect(elm.find('i').attr('class')).toEqual('fa fa-file-text-o fa-lg')
        scope.$digest();
    });   
   
});


