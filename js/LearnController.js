console.log("Create app module");
var learnApp = angular.module('LearnApp', []);

var LearnController = function($scope) {
	var _this = this;
	window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
	bus = window.castReceiverManager.getCastMessageBus('urn:x-cast:com.kg.learn');
	window.castReceiverManager.start();


	$scope.sendersCount = 0;

	this.addSender = function(event) {
		$scope.$apply(function() {
			console.log("New sender connected");
			console.log(event);
			$scope.sendersCount++;
			console.log($scope.sendersCount);
		});
	}

	this.removeSender = function(event) {
		$scope.apply(function() {
			console.log("Sender disconnected");
			console.log(event);
			console.log(window.castReceiverManager.getSenders());
			// Close app if there is no more client session
			if (window.castReceiverManager.getSenders().length == 0 &&
				event.reason == cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER) {
				window.close();
			}
			$scope.sendersCount--;
		});
	};
	window.castReceiverManager.onSenderDisconnected = this.removeSender;
	window.castReceiverManager.onSenderConnected = this.addSender;
};

LearnController.$inject = ['$scope'];
learnApp.controller('LearnController', LearnController);