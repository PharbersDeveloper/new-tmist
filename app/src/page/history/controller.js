import Controller from "@ember/controller"
// import { inject as service } from "@ember/service"

export default Controller.extend( {
	// runtimeConfig: service( "service/runtime-config" )
	projectType: Number( localStorage.getItem( "projectType" ) ),
	noNavButton: true,
	actions: {
		performance() {
			this.set( "performance", {
				open: true
			} )
		},
		returnPrepare( pid ) {
			if ( window.localStorage.getItem( "isUcb" ) === "1" ) {
				this.transitionToRoute( "page.ucbprepare" )
			} else {
				this.transitionToRoute( "page.prepare", pid )
			}

		},
		review( pid ) {
			this.transitionToRoute( "page.project.review", pid )
		}
	}

} )
