import Route from "@ember/routing/route"
import RSVP from "rsvp"


export default Route.extend( {
	model( params ) {
		const project = this.modelFor( "page.project" ),
			provious = this.store.query( "model/project", {
				filter: "(:and," + "(proposal,:eq,`" + params.proposal_id + "`)," + "(accountId,:eq,`" + accountId + "`)," + "(status,:eq,0))" } )

		// ids = project.hasMany( "periods" ).ids(),
		// hids = ids.map( x => {
		// 	return "`" + `${x}` + "`"
		// } ).join( "," ),
		// periods = this.store.query( "model/period", { filter: "(id,:in," + "[" + hids + "]" + ")"} )

		return RSVP.hash( {
			// periods: periods,
			project: project,
			provious: provious
		} )
	}
} )
