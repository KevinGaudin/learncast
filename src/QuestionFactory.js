learnApp.factory('QuestionFactory', function() {
	var questionFactoryInstance = {
		getQuestion: function() {
			var OPERATORS = Array("+", "-");

			var operand1 = Math.floor((Math.random() * 10) + 1);
			var operand2 = Math.floor((Math.random() * 10) + 1);
			var operator = OPERATORS[Math.floor(Math.random() * OPERATORS.length)];
			var operation = operand1 + " " + operator + " " + operand2;
			if(operator == "-" && operand2 > operand1) {
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