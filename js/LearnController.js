var LEARN_PROTOCOL = 'urn:x-cast:com.kg.learn';

console.log("Create app module");
var learnApp = angular.module('LearnApp', []);

var LearnController = function($scope) {
	var _this = this;


	$scope.sendersCount = 0;
	$scope.players = [];

	this.addSender = function(event) {
		$scope.$apply(function() {
			console.log("New sender connected");
			console.log(event);
			console.log(window.castReceiverManager.getSenders());
			$scope.sendersCount++;
			console.log($scope.sendersCount);
		});
	}

	this.removeSender = function(event) {
		$scope.$apply(function() {
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

	this.onMessage = function(event) {
		$scope.$apply(function() {
			console.log("Message received: ", event);
			console.log("Add Player: ", event.data.name);
			$scope.players.push({
				name: event.data.name
			});
			console.log ("players", $scope.players);
		});
	};

	window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
	this.bus = window.castReceiverManager.getCastMessageBus(LEARN_PROTOCOL,cast.receiver.CastMessageBus.MessageType.JSON);
	this.bus.onMessage = this.onMessage;
	window.castReceiverManager.onSenderDisconnected = this.removeSender;
	window.castReceiverManager.onSenderConnected = this.addSender;
	window.castReceiverManager.start();
};

LearnController.$inject = ['$scope'];
learnApp.controller('LearnController', LearnController);