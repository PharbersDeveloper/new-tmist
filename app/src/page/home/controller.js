import Controller from "@ember/controller"

export default Controller.extend( {
	actions: {
		toPrepare() {
			this.transitionToRoute( "page.prepare" )
		}
	}
} )
