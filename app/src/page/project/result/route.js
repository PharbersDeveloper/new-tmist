import Route from "@ember/routing/route"
import RSVP from "rsvp"

export default Route.extend( {
	model() {
		const project = this.modelFor( "page.project" ),
			condi00 = "(projectId,:eq,`" + project.get( "id" ) + "`)",
			condi01 = "(phase,:eq," + ( project.periods.length - 1 ) + ")",
			condi = "(:and," + condi00 + "," + condi01 + ")",
			reports = this.store.query( "model/report", { filter: condi } )

		return RSVP.hash( {
			project: project,
			reports: reports
			// summary: finals
		} )
	}
} )