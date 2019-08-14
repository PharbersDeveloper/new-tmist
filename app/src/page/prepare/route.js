import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"

export default Route.extend( {
	cookies: service(),
	model() {
		const accountId = this.cookies.read( "account_id" )

		return RSVP.hash( {

			usableProposals: this.store.query( "model/usable-proposal", { filter: "(accountId,:eq,`" + accountId + "`)" } ).filterBy( "id", "5cc5353beeefcc04515c46a3" ),
			currentProjects: this.store.query( "model/project", { filter: "(:and,(accountId,:eq,`" + accountId + "`),(status,:eq,0))" } ),
			historicalProjects: this.store.query( "model/project", { filter: "(:and,(accountId,:eq,`" + accountId + "`),(status,:eq,1))" } )
		} )
	}
} )
