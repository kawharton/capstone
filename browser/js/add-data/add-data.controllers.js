app.controller('AddDataCtrl', function($scope, forms) {
	$scope.forms = forms;
});

app.controller('CompletedFormModalCtrl', function($scope, $uibModalInstance) {
	$scope.close = function(result) {
		$uibModalInstance.close(result);
	}
});

app.controller('AddDataSubmitCtrl', function($scope, form, CompletedFormsFactory, $uibModal) {
	$scope.form = form;

	$scope.formValues = [];


	//DELETE AFTER DEMO DAY
	// $scope.form.formElements[0].value = "Sneep";
	// $scope.form.formElements[1].value = 2;
	// $scope.form.formElements[2].value = {
	// 	city: "Tegucigalpa",
	// 	country: "Honduras",
	// 	state: "Francisco Morazan Department",
	// 	streetAddress: "Colonia San Carlos",
	// 	streetAddress2: "Apt 7"
	// };
	

	$scope.submitForm = function() {
		// merge values with the formTemplate data and save as completed form

		var completedForm = angular.copy(form);
		console.log($scope.formValues)
		completedForm.formElements = completedForm.formElements.map(function(el, i) {
			el.value = $scope.formValues[i];
			return el;
		});
		completedForm.type = 'completedForm';
		completedForm.formTemplateId = completedForm._id;
		completedForm.formTemplateVer = completedForm._rev;
		delete completedForm._id;
		delete completedForm._rev;

		console.log(completedForm);

		CompletedFormsFactory.createOne(completedForm)
			.then(function(createdForm) {
				var modalInstance = $uibModal.open({
					templateUrl: '/js/add-data/add-data-success.html',
					controller: 'CompletedFormModalCtrl',
					size: 'md'
				});

				// console.log('Form submitted!', createdForm);
				modalInstance.result.then(function(result){
					// console.log('result', result)
					switch(result) {
						case 'add':
							$state.go('add-data.submit', {formTemplateId: $scope.form.formTemplateId});
							break;
						case 'viewOne':
							$state.go('completed-forms.individual-form', {completedFormId: createdForm.id});
							break;
						case 'viewAll':
							$state.go('completed-forms.forms-list', {formTemplateId: $scope.form.formTemplateId});
							break;
						default: $state.go('add-data.submit', {formTemplateId: $scope.form.formTemplateId});
					}
				});
			});
	};
});