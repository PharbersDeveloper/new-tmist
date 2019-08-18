import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"


export default Route.extend( {
	cookies: service(),
	model( params ) {
		const accountId = this.cookies.read( "account_id" ),
			project = this.modelFor( "page.project" ),
			report = this.modelFor( "page.project" ).finals.lastObject
		// provious = this.store.query( "model/project", {
		// 	filter: "(:and," + "(proposal,:eq,`" + params.proposal_id + "`)," + "(accountId,:eq,`" + accountId + "`)," + "(status,:eq,0))" } )

		// ids = project.hasMany( "periods" ).ids(),
		// hids = ids.map( x => {
		// 	return "`" + `${x}` + "`"
		// } ).join( "," ),
		// periods = this.store.query( "model/period", { filter: "(id,:in," + "[" + hids + "]" + ")"} )

		return RSVP.hash( {
			// periods: periods,
			project: project,
			report: report
			// provious: provious
		} )
	}
} )
