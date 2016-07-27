/* globals appServices */
'use strict';

appServices.factory("FileService", function(Upload, $http, $modal, _, AlertService, PersonnelService) {

	var fileService = {
		
		// Uploads personnel files using PersonnelService
		// TODO: Should be made more generic?
		upload: function(scope, file, fileId) {
			Upload.upload({
			url: '/api/uploadFile',
			fields: {fileName: fileId, personnelId: scope.form._id},
			file: file
			}).progress(function (evt) {
				scope.uploadComplete = false;
				scope.form.uploadValue[fileId] = parseInt(100.0 * evt.loaded / evt.total, 10);
			}).success(function (data, status, headers, config) {
				scope.form.files.push({"fileId": fileId, "fileName": file.name, "fileType" : file.type, "fileSize": file.size, "documentationType": 'other'});
				scope.uploadComplete = true;
				PersonnelService.save(scope, scope.form, scope.pForm);
			}).error(function (data, status, headers, config) {
				AlertService.add('error', 'There was a problem uploading the file, please notify support', 'Error!');
			});
		},
		
		download: function(scope, file) {
			$http.post('/api/downloadFile', file, {responseType: "arraybuffer"}).
			success(function(data) {
				var blob = new Blob([data], { type: file.fileType });
				saveAs(blob, file.fileName);
			}).
			error(function(data, status) {
				scope.info = "Request failed with status: " + status;
			});				
		},

		findFileById: function(scope, fileId) {
			return findFile(scope.form.files, fileId);
  		}		
	};
	
	function findFile(files, fileId) {
		var file = _.find(files, function(file) {
		return file.fileId === fileId;
		});
		return file;		
	}
	
	return fileService;
	 
});