import Controller from "@ember/controller"

export default Controller.extend( {
	actions: {
		toIndex() {
			this.transitionToRoute( "/" )
		}
	}
} )
