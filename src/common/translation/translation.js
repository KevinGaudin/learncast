angular.module('angularTranslateApp', ['pascalprecht.translate']).config(['$translateProvider',
	function($translateProvider, $translatePartialLoaderProvider) {
		$translateProvider.useLoader('$translatePartialLoader', {
			urlTemplate: '/UI/assets/translation/{lang}/{part}.json'
		});

		$translateProvider.preferredLanguage('fr');
	}
]);