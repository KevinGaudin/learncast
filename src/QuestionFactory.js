learnApp.factory('QuestionFactory', function() {
	var questionFactoryInstance = {
		// Configuration
		addMaxInt: 10,
		subMaxInt: 10,
		multMaxInt1: 10,
		multMaxInt2: 10,
		subPositiveResult: true,
		operatorAdd: true,
		operatorSub: true,
		operatorMult: true,
		getQuestion: function() {
			var operators = [];
			if(this.operatorAdd) {
				operators.push('+');
			}
			if(this.operatorSub) {
				operators.push('-');
			}
			if(this.operatorMult) {
				operators.push('*');
			}

			var operator = operators[Math.floor(Math.random() * operators.length)];
			var max1 = this.addMaxInt;
			var max2 = this.addMaxInt;
			if(operator == '-') {
				max1 = this.subMaxInt;
				max2 = this.subMaxInt;
			} else if(operator == '*') {
				max1 = this.multMaxInt1;
				max2 = this.multMaxInt2;
			}
			var operand1 = Math.floor((Math.random() * max1) + 1);
			var operand2 = Math.floor((Math.random() * max2) + 1);
			var operation = operand1 + " " + operator + " " + operand2;
			if(this.subPositiveResult && operator == "-" && operand2 > operand1) {
				operation = operand2 + " " + operator + " " + operand1;
			}
			var question = {
				question: "Combien font " + operation + " ?",
				result: eval(operation)
			};
			return question;
		}

	}



	return questionFactoryInstance;
});