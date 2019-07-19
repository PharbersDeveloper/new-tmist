import Route from "@ember/routing/route"
import RSVP from "rsvp"

export default Route.extend( {
	model( params ) {
		return RSVP.hash( {
			period: this.store.findRecord("model/period", params.period_id),
			project: this.modelFor("page.project")
		} )
	}
} )
