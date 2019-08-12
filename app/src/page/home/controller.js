import Controller from "@ember/controller"
// import { inject as service } from "@ember/service"

export default Controller.extend( {
	// runtimeConfig: service( "service/runtime-config" ),
	actions: {
		toPrepare( type ) {
			// this.get( "runtimeConfig" ).set( "projectType", type )
			localStorage.setItem( "projectType", type )
			this.transitionToRoute( "page.prepare" )
		}
	}
} )
