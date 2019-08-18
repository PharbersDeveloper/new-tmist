import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"

export default Route.extend( {
	facade: service( "service/exam-facade" ),
	model( param ) {
		console.log( "*" )
		console.log( "*" )
		console.log( "*" )
		console.log( param )
		console.log( this.modelFor( "page.project" ) )
		console.log( this.modelFor( "page.project.period" ) )
		const project = this.modelFor( "page.project" ),
			prs = project.belongsTo( "proposal" ),
			hospitals = prs.load().then( x => {
				const ids = x.hasMany( "targets" ).ids(),
					hids = ids.map( x => {
						return "`" + `${x}` + "`"
					} ).join( "," )

				return this.store.query( "model/hospital", { filter: "(id,:in," + "[" + hids + "]" + ")" } )
			} ),

			products = prs.load().then( x => {
				const ids = x.hasMany( "products" ).ids(),
					hids = ids.map( x => {
						return "`" + `${x}` + "`"
					} ).join( "," )

				return this.store.query( "model/product", { filter: "(id,:in," + "[" + hids + "]" + ")" } )
			} ),

			resources = prs.load().then( x => {
				const ids = x.hasMany( "resources" ).ids(),
					hids = ids.map( x => {
						return "`" + `${x}` + "`"
					} ).join( "," )

				return this.store.query( "model/resource", { filter: "(id,:in," + "[" + hids + "]" + ")" } )
			} ),
			condi00 = "(projectId,:eq,`" + project.get( "id" ) + "`)",
			condi01 = "(phase,:eq," + ( project.periods.length - 1 ) + ")",
			condi = "(:and," + condi00 + "," + condi01 + ")",
			reports = this.store.query( "model/report", { filter: condi } )

		return RSVP.hash( {
			// proposal: proposal,
			project: project,
			// period: period,
			reports: reports,
			hospitals: hospitals,
			products: products,
			resources: resources


			// summary: finals
		} )
	}
} )

