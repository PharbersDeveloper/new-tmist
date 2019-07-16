import Route from "@ember/routing/route"
import { inject as service } from "@ember/service"
import ENV from "new-tmist/config/environment"

export default Route.extend( {
	oauthService: service( "service/oauth" ),
	queryParams: null,
	beforeModel ( transition ) {
		this.set( "queryParams", transition.queryParams )
	},
	actions: {
		didTransition() {
			this.oauthService.oauthCallback( this.queryParams )
			this.transitionTo( ENV.OAuth.IndexEndpoint )
		}
	}
} )
