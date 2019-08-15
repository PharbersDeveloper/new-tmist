import Controller from "@ember/controller"
// import { inject as service } from "@ember/service"

export default Controller.extend( {
	// runtimeConfig: service( "service/runtime-config" ),
	actions: {
		toPrepare( tid ) {
			if (tid === "none") {

			} else {
				this.transitionToRoute( "page.prepare", tid )
			}
		}
	}
} )
