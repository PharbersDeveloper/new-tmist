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

			validation = prs.load().then( x => {
				return x.belongsTo( "validation" ).load()
			} ),

			quota = prs.load().then( x => {
				return x.belongsTo( "quota" ).load()
			} ),

			period = this.store.findRecord( "model/period", params.period_id )

		this.facade.startPeriodExam( project )

		const presets = period.then( prd => {
				return this.facade.queryPeriodPresets( prd, prs, 0 )
			} ),

		 answers = Promise.all( [period, presets, resources] ).then( results => {
				const p = results[0],
					items = results[1].filter( x => x.category == 8 && x.phase == 0 ),
					people = results[2]

				return this.facade.queryPeriodAnswers( p, items, people )
			} )

		const dragInfo = 
			prs.load().then( x => {
				const condi01 = "(proposalId,:eq,`" + x.id + "`)"
				const condi02 = "(phase,:eq,0)"
				const condi03 = "(category,:eq,8)"
				const condi = "(:and," + condi01 + "," + condi02 + "," + condi03 + ")"
				return this.store.query("model/preset", { filter: condi} )
			} )

		const kpiInfo = prs.load().then( x => {
			const condi01 = "(proposalId,:eq,`" + x.id + "`)"
			const condi02 = "(phase,:eq,0)"
			const condi03 = "(category,:eq,2)"
			const condi = "(:and," + condi01 + "," + condi02 + "," + condi03 + ")"
			return this.store.query("model/preset", { filter: condi} )
		} )

		return RSVP.hash( {
			period: period,
			project: project,
			hospitals: hospitals,
			products: products,
			resources: resources,
			presets: presets.then( x=> x.filter( it => it.category == 8 && it.phase == 0 ) ),
			productQuotas: presets.then( x=> x.filter( it => it.category == 4 && it.phase == 0 ) ),
			answers: answers,
			validation: validation,
			quota: quota,
			dragInfo: dragInfo,
			kpiInfo: kpiInfo
		} )
	},
	setupController( controller , model ) {
		this._super( controller , model )
		this.controllerFor( "page.project.period" ).Subscribe()
		this.controllerFor( "page.project.period" ).callE()
	}
} )
