angular.module('learncast.speech', []).
factory('speech', function() {
    var fallbackSpeechSynthesis = window.speechSynthesisPolyfill;
    var fallbackSpeechSynthesisUtterance = window.SpeechSynthesisUtterancePolyfill;

    var msg = new fallbackSpeechSynthesisUtterance('Bonjour');
    msg.lang = 'fr-FR';
    msg.volume = 1.0;
    msg.rate = 1.0;
    msg.onend = function(event) {
        console.log('Finished in ' + event.elapsedTime + ' seconds.');
    };

    function sayIt(text) {
        msg.text = text;

        fallbackSpeechSynthesis.speak(msg);
    }


    return {
        sayText: sayIt
    };
});