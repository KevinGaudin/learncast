var LEARN_PROTOCOL = 'urn:x-cast:com.kg.learn';
var PING_TIMEOUT = 5000;

console.log("Create app module");
var learnApp = angular.module('LearnApp', []);

function Player(senderId, channel) {
	this.senderId = senderId;
	this.channel = channel;
	this.channel.onMessage = this.onMessage.bind(this);
	this.channel.send({command: "identify"});
};

Player.prototype = {
	senderId: null,
	name: null,
	channel: null,
	onMessage: function(event) {
		console.log("Received message from: " + this.senderId + ": ", event);
		switch(event.message.command) {
			case 'identify':
				console.log (this.senderId + " gave name: " + event.message.name);
				this.name = event.message.name;
				break;
			default:
				console.log("unknown command");
		}
	}
}

/**
 * LearnController : main controller for our AngularJS app
 */
var LearnController = function($scope, QuestionFactory) {
	var _this = this;


	$scope.sendersCount = 0;
	$scope.players = [];

	this.addSender = function(event) {
		$scope.$apply(function() {
			console.log("New sender connected");
			console.log(event);
			console.log(window.castReceiverManager.getSenders());

			console.log("Get Channel with " + event.senderId);

			var player = new Player(event.senderId, _this.bus.getCastChannel(event.senderId));


			$scope.players.push(player);
			console.log("players", $scope.players);

			$scope.sendersCount = window.castReceiverManager.getSenders().length;
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
			$scope.sendersCount = window.castReceiverManager.getSenders().length;
		});
	};

	/**
	 * Called when any message is received. Messages from multiple senders are better handled from
	 * channels, though. 
	 **/
	this.onMessage = function(event) {
		$scope.$apply(function() {
			console.log("Global message received: ", event);
		});
	};

	window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
	this.bus = window.castReceiverManager.getCastMessageBus(LEARN_PROTOCOL, cast.receiver.CastMessageBus.MessageType.JSON);
	this.bus.onMessage = this.onMessage;
	window.castReceiverManager.onSenderDisconnected = this.removeSender;
	window.castReceiverManager.onSenderConnected = this.addSender;
	window.castReceiverManager.start();

};

LearnController.$inject = ['$scope', 'QuestionFactory'];
learnApp.controller('LearnController', LearnController);