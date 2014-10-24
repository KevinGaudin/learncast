var LEARN_PROTOCOL = 'urn:x-cast:com.kg.learn';
var PING_TIMEOUT = 5000;
var NB_QUESTIONS = 10;
var NB_SHIPS = 3;

console.log("Create app module");
var learnApp = angular.module('LearnApp', ['ngAnimate', 'pascalprecht.translate', 'ngMaterial']);

learnApp.config(['$translateProvider',
	function($translateProvider) {
		$translateProvider.useStaticFilesLoader({
			prefix: 'UI/assets/translation/main/',
			suffix: '.json'
		});
		$translateProvider.addInterpolation('$translateMessageFormatInterpolation');
		$translateProvider.preferredLanguage('fr');

	}
]);

function Sender(senderId, channel, onAllQuestionsAnswered) {
	console.log("create player ", senderId);
	this.senderId = senderId;
	this.channel = channel;
	this.channel.onMessage = this.onMessage.bind(this);
	this.channel.send({
		command: "identify"
	});
	this.onAllQuestionsAnswered = onAllQuestionsAnswered;
	this.shipID = Math.floor((Math.random() * NB_SHIPS) + 1);
};

Sender.prototype = {
	senderId: null,
	name: null,
	channel: null,
	readyToPlay: false,
	questions: null,
	currentQuestion: 0,
	scorecard: null,
	isWinner: false,
	shipID: 1,
	onMessage: function(event) {
		console.log("Received message from: " + this.senderId + ": ", event);
		switch (event.message.command) {
			case 'identify':
				if(event.message.name) {
					console.log(this.senderId + " gave name: " + event.message.name);
					this.name = event.message.name;
				}
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
		this.isWinner = false;
		this.questions = questions;
		this.scorecard = Array();
		this.currentQuestion = 0;
	},
	checkAnswer: function(answer) {
		if (answer == this.questions[this.currentQuestion].result) {
			console.log(this.name + " " + answer + " is the right answer!");
			this.scorecard.push("1");
			console.log(this.name + " scorecard ", this.scorecard);
			this.currentQuestion++;
			if (this.currentQuestion < this.questions.length) {
				this.ask();
			} else {
				// Finished all questions!
				this.onAllQuestionsAnswered(this);
			}
		} else {
			console.log(this.name + " " + answer + " is wrong, try again...");
		}
	},
	onAllQuestionsAnswered: null,

}

/**
 * LearnController : main controller for our AngularJS app
 */
var LearnController = function($scope, QuestionFactory, $window, $translate) {
	var _this = this;

	$scope.senders = {};
	$scope.players = [];
	$scope.teacher = null;
	$scope.raceLength = $window.innerWidth;

	this.addSender = function(event) {
		$scope.$apply(function() {
			console.log("New sender connected");
			console.log(event);
			console.log(window.castReceiverManager.getSenders());

			console.log("Get Channel with " + event.senderId);

			var sender = new Sender(event.senderId, _this.bus.getCastChannel(event.senderId), _this.onPlayerAnsweredAllQuestions);

			$scope.senders[event.senderId] = sender;
			console.log("senders", $scope.senders);
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
				case 'identify':
					if(event.data.teacher) {
						console.log("Teacher is here!", event);
						$scope.teacher = $scope.senders[event.senderId];
					} else {
						console.log("Player identified.", event);
						$scope.players.push($scope.senders[event.senderId]);
					}
					break;
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
		// Reset previous questions
		_this.questions = [];

		// Prepare 10 questions
		for (var i = 0; i < NB_QUESTIONS; i++) {
			_this.questions[i] = QuestionFactory.getQuestion();
		}

		$scope.players.forEach(function(player, iPlayer, players) {
			player.setQuestions(_this.questions);
			player.ask();
		});

	}

	this.onPlayerAnsweredAllQuestions = function(player) {
		$scope.$apply(function() {
			console.log("winner: ", player.name);
			player.isWinner = true;
			var command = {
				command: 'endGame',
				winner: {
					senderId: player.senderId,
					name: player.name
				}
			};
			_this.bus.broadcast(command);
		});
	};
};



LearnController.$inject = ['$scope', 'QuestionFactory', '$window', '$translate'];
learnApp.controller('LearnController', LearnController);