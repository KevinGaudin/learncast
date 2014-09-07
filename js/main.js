    window.onload = function() {
    	window.castReceiverManager = cast.receiver.CastReceiverManager.getInstance();
        bus = window.castReceiverManager.getCastMessageBus('urn:x-cast:com.sample.hello');
    	window.castReceiverManager.start();

/*    	window.castReceiverManager.onSenderDisconnected = function(event) {
    		if (window.castReceiverManager.getSenders().length == 0 &&
    			event.reason == cast.receiver.system.DisconnectReason.REQUESTED_BY_SENDER) {
    			window.close();
    		}
    	}*/
    }