angular.module('angularTranslateApp', ['pascalprecht.translate']).config(['$translateProvider',
	function($translateProvider, $translatePartialLoaderProvider) {
		console.log("Configure translation partial loader");
		$translateProvider.useLoader('$translatePartialLoader', {
			urlTemplate: 'UI/assets/translation/{part}/{lang}.json'
		});

		$translateProvider.preferredLanguage('fr');
	}
]);