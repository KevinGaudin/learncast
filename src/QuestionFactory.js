learnApp.factory('QuestionFactory', ['$translate', function QuestionFactory($translate) {
	var defaultConfiguration = {
		addMaxInt: 10,
		subMaxInt: 10,
		multMaxInt1: 10,
		multMaxInt2: 10,
		subPositiveResult: true,
		operatorAdd: true,
		operatorSub: true,
		operatorMult: true
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
		getQuestion: function() {
			var operators = [];
			if (this.conf.operatorAdd) {
				operators.push('+');
			}
			if (this.conf.operatorSub) {
				operators.push('-');
			}
			if (this.conf.operatorMult) {
				operators.push('*');
			}

			var operator = operators[Math.floor(Math.random() * operators.length)];
			var max1 = this.conf.addMaxInt;
			var max2 = this.conf.addMaxInt;
			if (operator == '-') {
				max1 = this.conf.subMaxInt;
				max2 = this.conf.subMaxInt;
			} else if (operator == '*') {
				max1 = this.conf.multMaxInt1;
				max2 = this.conf.multMaxInt2;
			}
			var operand1 = Math.floor((Math.random() * max1) + 1);
			var operand2 = Math.floor((Math.random() * max2) + 1);
			var operation = operand1 + " " + operator + " " + operand2;
			if (this.conf.subPositiveResult && operator == "-" && operand2 > operand1) {
				operation = operand2 + " " + operator + " " + operand1;
			}
			var question = {
				question: $translate.instant("CALCULATE") + " " + operation + " ?",
				result: eval(operation)
			};
			return question;
		}

	}



	return questionFactoryInstance;
}]);