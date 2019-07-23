import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"

export default Route.extend( {
	facade: service( "service/exam-facade" ),
	model( params ) {
		const project = this.modelFor( "page.project" ),
			prs = project.belongsTo( "proposal" ),

			hospitals = prs.load().then( x => {
				const ids = x.hasMany( "targets" ).ids(),
					hids = ids.map( x => {
						return "`" + `${x}` + "`"
					} ).join( "," )

				return this.store.query( "model/hospital", { filter: "(id,:in," + "[" + hids + "]" + ")"} )
			} ),

			products = prs.load().then( x => {
				const ids = x.hasMany( "products" ).ids(),
					hids = ids.map( x => {
						return "`" + `${x}` + "`"
					} ).join( "," )

				return this.store.query( "model/product", { filter: "(id,:in," + "[" + hids + "]" + ")"} )
			} ),

			resources = prs.load().then( x => {
				const ids = x.hasMany( "resources" ).ids(),
					hids = ids.map( x => {
						return "`" + `${x}` + "`"
					} ).join( "," )

				return this.store.query( "model/resource", { filter: "(id,:in," + "[" + hids + "]" + ")"} )
			} ),

			period = this.store.findRecord( "model/period", params.period_id )

		this.facade.startPeriodExam( project )

		const presets = period.then( prd => {
				return this.facade.queryPeriodPresets( prd )
			} ),

		 answers = Promise.all( [period, presets, resources] ).then( results => {
				const p = results[0],
					items = results[1],
					people = results[2]

				return this.facade.queryPeriodAnswers( p, items, people )
			} )

		return RSVP.hash( {
			period: period,
			project: project,
			hospitals: hospitals,
			products: products,
			resources: resources,
			presets: presets,
			answers: answers
		} )
	}
} )
