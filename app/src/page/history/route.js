import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"


export default Route.extend( {
	cookies: service(),
	model( params ) {
		const accountId = this.cookies.read( "account_id" ),
			proposal = this.store.findRecord( "model/proposal", params.proposal_id ),
			provious = this.store.query( "model/project", {
				filter: "(:and," + "(proposal,:eq,`" + params.proposal_id + "`)," + "(accountId,:eq,`" + accountId + "`)," + "(status,:eq,1))" } ),
			proviousReport = provious.then( ps => {
				return ps.map( p => {
					return { project: p, reports: p.finals }

				} )
			} )
			// report = provious.then(ps => {
			// 	ps.forEach(p => {
			// 		p.x.hasMany( "targets" ).ids()
			// 	})
			// })

		return RSVP.hash( {
			proposal: proposal,
			provious: provious,
			proviousReport
		} )
	}
} )
