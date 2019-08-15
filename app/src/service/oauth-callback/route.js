import Route from "@ember/routing/route"
import { inject as service } from "@ember/service"

export default Route.extend( {
	oauthService: service( "service/oauth" ),
	queryParams: null,
	beforeModel ( transition ) {
		this.set( "queryParams", transition.queryParams )
	},
	actions: {
		didTransition() {
			this.oauthService.oauthCallback( this.queryParams )
			// window.location = "/"
		}
	}
} )
