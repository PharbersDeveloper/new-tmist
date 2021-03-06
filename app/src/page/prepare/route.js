import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"

export default Route.extend( {
	cookies: service(),
	model( params ) {
		const accountId = this.cookies.read( "account_id" ),
			proposal = this.store.findRecord( "model/proposal", params.proposal_id ),
			provious = this.store.query( "model/project", {
				filter: "(:and," + "(proposal,:eq,`" + params.proposal_id + "`)," + "(accountId,:eq,`" + accountId + "`)," + "(status,:eq,0))" } ),
			periodsLength = provious.then( res => {
				let cur = res.get( "lastObject" )

				if ( cur ) {
					return cur.hasMany( "periods" ).ids().length
				} else {
					return 0
				}
			} )

		return RSVP.hash( {
			proposal: proposal,
			provious: provious,
			periodsLength: periodsLength
		} )
	}
	// setupController( controller , model ) {
	// 	this._super( controller , model )
	// 	this.controllerFor( "page.prepare" ).Subscribe()
	// }
} )
