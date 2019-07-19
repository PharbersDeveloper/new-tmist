import Route from "@ember/routing/route"
import { A } from "@ember/array"
import { inject as service } from "@ember/service"
import RSVP from "rsvp"

export default Route.extend( {
	model( params ) {
		return RSVP.hash( {
			period: this.store.findRecord("model/period", params.period_id),
			project: this.modelFor("page.project")
		} )
	}
} )
