import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"
import { all } from "rsvp"

export default Route.extend( {
	cookies: service(),
	model( params ) {
		const accountId = this.cookies.read( "account_id" ),
			proposal = this.store.findRecord( "model/proposal", params.proposal_id ),
			provious = this.store.query( "model/project", {
				filter: "(:and," + "(proposal,:eq,`" + params.proposal_id + "`)," + "(accountId,:eq,`" + accountId + "`)," + "(status,:eq,1))"
			} )

		return provious.then( data => {
			let promiseAll = data.map( ele => {
				return ele.hasMany( "finals" ).load()
			} )

			return RSVP.hash( { provious: data, finals: all( promiseAll ) } )


		} ).then( data => {
			let finals = data.finals,
				proviousReports = data.provious.map( ( ele, index ) => {
					return {
						project: ele,
						reports: finals[index]
					}
				} )

			return RSVP.hash( {
				proposal: proposal,
				provious: provious,
				proviousReport:proviousReports
			} )
		} )
		// return RSVP.hash( {
		// 	proposal: proposal,
		// 	provious: provious,
		// 	proviousReport
		// } )
	}
} )
