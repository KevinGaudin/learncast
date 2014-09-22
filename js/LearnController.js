var LEARN_PROTOCOL = 'urn:x-cast:com.kg.learn';
var PING_TIMEOUT = 5000;

console.log("Create app module");
var learnApp = angular.module('LearnApp', []);

function Player(senderId, channel) {
	this.senderId = senderId;
	this.channel = channel;
	this.channel.onMessage = this.onMessage.bind(this);
	this.channel.send({
		command: "identify"
	});
};

Player.prototype = {
	senderId: null,
	name: null,
	channel: null,
	readyToPlay: false,
	questions: null,
	currentQuestion: 0,
	scorecard: [],
	onMessage: function(event) {
		console.log("Received message from: " + this.senderId + ": ", event);
		switch (event.message.command) {
			case 'identify':
				console.log(this.senderId + " gave name: " + event.message.name);
				this.name = event.message.name;
				break;
			case 'readyToPlay':
				this.readyToPlay = event.message.value;
				console.log(this.name + " ready? ", event.message.value);
				break;
			case 'submitAnswer':
				console.log(this.name + " submits " + event.message.value);
				this.checkAnswer(event.message.value);
				break;
			default:
				console.log("unknown command");
		}
	},
	ask: function() {
		var command = {
			command: 'question',
			question: this.questions[this.currentQuestion].question
		};
		console.log("Ask " + this.senderId + " question", command);
		this.channel.send(command);
	},
	setQuestions: function(questions) {
		this.questions = questions;
	},
	checkAnswer: function(answer) {
		if (answer == this.questions[this.currentQuestion].result) {
			console.log(this.name + " " + answer + " is the right answer!");
			this.scorecard.push("1");
			this.currentQuestion++;
			if (this.currentQuestion < this.questions.length) {
				this.ask();
			}
		} else {
			console.log(this.name + " " + answer + " is wrong, try again...");
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
			switch (event.data.command) {
				case 'readyToPlay':
					// First check that everybody is ready
					console.log("Are all players ready ?")
					var allPlayersReady = true;
					for (var i = 0; i < $scope.players.length; i++) {
						if (!$scope.players[i].readyToPlay) {
							allPlayersReady = false;
							break;
						}
					}

					if (allPlayersReady) {
						console.log("Let's start the game");
						_this.startGame();
					} else {
						console.log("Still waiting for other players");
					}
					break;
				default:
					console.log("No global action required");
			}
		});
	};

	window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
	this.bus = window.castReceiverManager.getCastMessageBus(LEARN_PROTOCOL, cast.receiver.CastMessageBus.MessageType.JSON);
	this.bus.onMessage = this.onMessage;
	window.castReceiverManager.onSenderDisconnected = this.removeSender;
	window.castReceiverManager.onSenderConnected = this.addSender;
	window.castReceiverManager.start();

	this.questions = [];
	this.startGame = function() {

		// Prepare 10 questions
		for (var i = 0; i < 10; i++) {
			_this.questions[i] = QuestionFactory.getQuestion();
		}

		$scope.players.forEach(function(player, iPlayer, players) {
			player.setQuestions(_this.questions);
			player.ask();
		});

	}

};



LearnController.$inject = ['$scope', 'QuestionFactory'];
learnApp.controller('LearnController', LearnController);