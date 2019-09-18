import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"

export default Route.extend( {
	cookies: service(),
	model() {
		return this.store.query( "model/proposal", { filter: "(:and," + "(case,:eq,`ucb`)" + ")"} ).then( res => {
			const accountId = this.cookies.read( "account_id" ),
				proposal = this.store.findRecord( "model/proposal", res.firstObject.id ),
				provious = this.store.query( "model/project", {
					filter: "(:and," + "(proposal,:eq,`" + res.firstObject.id + "`)," + "(accountId,:eq,`" + accountId + "`)," + "(status,:eq,0))" } ),
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
		} )
	}
} )
