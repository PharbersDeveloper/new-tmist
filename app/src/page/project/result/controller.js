import Controller from "@ember/controller"

export default Controller.extend( {
	actions: {
		toReport() {
			this.transitionToRoute( "page.project.report" )
		}
	}
} )
