import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"

export default Route.extend( {
	cookies: service(),
	setupController( controller, model ) {
		this._super( ...arguments )
		this.controller.set( "currentProposal", model.usableProposals.firstObject.proposal )
	},
	model() {
		const accountId = this.cookies.read( "account_id" )

		return RSVP.hash( {
			usableProposals: this.store.query( "model/usable-proposal", { filter: "(accountId,:eq,`" + accountId + "`)" } ),
			currentProjects: this.store.query( "model/project", { filter: "(:and,(accountId,:eq,`" + accountId + "`),(status,:eq,0))" } ),
			historicalProjects: this.store.query( "model/project", { filter: "(:and,(accountId,:eq,`" + accountId + "`),(status,:eq,1))" } )
		} )
	}
} )
