import Controller from "@ember/controller"

export default Controller.extend( {
	actions: {
		returnHistory( ) {
		// this.transitionToRoute( "page.history", pid )
			window.history.go( -1 )
		}
	}
} )
