learnApp.factory('QuestionFactory', ['$translate',
	function QuestionFactory($translate) {
		var defaultConfiguration = {
			calculation: {
				addMaxInt: 10,
				subMaxInt: 10,
				multOperands1: "0 1 2 3 4 5 6 7 8 9",
				multMaxInt2: 10,
				subPositiveResult: true,
				operatorAdd: true,
				operatorSub: true,
				operatorMult: true
			}
		};

		var questionFactoryInstance = {
			// Configuration
			conf: defaultConfiguration,
			setConfig: function(newConf) {
				this.conf = newConf;
			},
			getConfig: function() {
				return this.conf;
			},
			getCalculationQuestion: function() {
				var operators = [];
				if (this.conf.calculation.operatorAdd) {
					operators.push('+');
				}
				if (this.conf.calculation.operatorSub) {
					operators.push('-');
				}
				if (this.conf.calculation.operatorMult) {
					operators.push('*');
				}

				var operator = operators[Math.floor(Math.random() * operators.length)];
				var max1 = this.conf.calculation.addMaxInt;
				var max2 = this.conf.calculation.addMaxInt;
				if (operator == '-') {
					max1 = this.conf.calculation.subMaxInt;
					max2 = this.conf.calculation.subMaxInt;
				} else if (operator == '*') {
					max1 = this.conf.calculation.multMaxInt1;
					max2 = this.conf.calculation.multMaxInt2;
				}
				var operand1 = Math.floor((Math.random() * max1) + 1);
				if(operator == '*') {
					var possibleOperands = this.conf.calculation.multOperands1.split(' ');
					operand1 = possibleOperands[Math.floor(Math.random() * possibleOperands.length)];
				}
				var operand2 = Math.floor((Math.random() * max2) + 1);
				var operation = operand1 + " " + operator + " " + operand2;
				if (this.conf.calculation.subPositiveResult && operator == "-" && operand2 > operand1) {
					operation = operand2 + " " + operator + " " + operand1;
				}
				var question = {
					question: $translate.instant("CALCULATE") + " " + operation + " ?",
					result: eval(operation)
				};
				return question;
			},
			getTypingQuestion: function() {
				var wordsList1 = $translate.instant("TYPING_WORDS_1").split(',');
				var wordsList2 = $translate.instant("TYPING_WORDS_2").split(',');
				var wordsList3 = $translate.instant("TYPING_WORDS_3").split(',');
				var possibleWords = wordsList1.concat(wordsList2).concat(wordsList3);
				var wordToType = possibleWords[Math.floor(Math.random() * possibleWords.length)];
				var question = {
					question: $translate.instant("TYPE_THIS_WORD") + wordToType,
					result: wordToType
				};
				return question;
			},
			getQuestion: function() {
				console.log("Select question generators available in this ", this);
				var possibleQuestionGenerators = [this.getCalculationQuestion.bind(this), this.getTypingQuestion.bind(this)];
				var questionGenerator = possibleQuestionGenerators[Math.floor(Math.random() * possibleQuestionGenerators.length)];
				console.log("Selected generator", questionGenerator, possibleQuestionGenerators);
				return questionGenerator();
			}
		}



		return questionFactoryInstance;
	}
]);