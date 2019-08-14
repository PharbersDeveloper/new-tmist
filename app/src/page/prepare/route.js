import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"

export default Route.extend( {
	cookies: service(),
	model( params ) {
		const accountId = this.cookies.read( "account_id" )
		const proposal = this.store.findRecord("model/proposal", params.proposal_id)
		const provious = this.store.query("model/project", { filter: "(:and," + "(proposal,:eq,`" + proposal.id + "`)," + "(accountId,:eq,`" + accountId + "`))" } )

		return RSVP.hash( {
			proposal: proposal,
			// usableProposals: this.store.query( "model/usable-proposal", { filter: "(accountId,:eq,`" + accountId + "`)" } ).filterBy( "id", "5cc5353beeefcc04515c46a3" ),
			// currentProjects: this.store.query( "model/project", { filter: "(:and,(accountId,:eq,`" + accountId + "`),(status,:eq,0))" } ),
			// historicalProjects: this.store.query( "model/project", { filter: "(:and,(accountId,:eq,`" + accountId + "`),(status,:eq,1))" } )
		} )
	}
} )
