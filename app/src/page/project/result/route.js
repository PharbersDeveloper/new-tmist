import Route from "@ember/routing/route"
import RSVP from "rsvp"

export default Route.extend( {
	model( params ) {
		const project = this.modelFor( "page.project" ),
			proposal = project.belongsTo( "proposal" ),
			ids = project.hasMany( "results" ).ids(),
			hids = ids.map( x => {
				return "`" + `${x}` + "`"
			} ).join( "," ),
			results = this.store.query( "model/result", { filter: "(id,:in," + "[" + hids + "]" + ")"} ),
			evaluations = proposal.load().then( x => {
				const ids = x.hasMany( "evaluations" ).ids(),
					hids = ids.map( x => {
						return "`" + `${x}` + "`"
					} ).join( "," )

				return this.store.query( "model/evaluation", { filter: "(id,:in," + "[" + hids + "]" + ")"} )
			} )

		return RSVP.hash( {
			project: project,
			results: results,
			evaluations: evaluations
		} )
	}
} )