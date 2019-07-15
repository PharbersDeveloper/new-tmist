import Route from "@ember/routing/route"
import { inject as service } from "@ember/service"
import RSVP from "rsvp"

export default Route.extend( {
	oauthService: service( "service/oauth" ),
	showNav: false,
	model() {
		return RSVP.hash( {
			page: this.oauthService.oauthOperation()
		} )
	}
} )
