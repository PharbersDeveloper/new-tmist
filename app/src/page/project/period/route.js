import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"
import { A } from "@ember/array"

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

			validation = prs.load().then( x => {
				return x.belongsTo( "validation" ).load()
			} ),

			quota = prs.load().then( x => {
				return x.belongsTo( "quota" ).load()
			} ),

			period = this.store.findRecord( "model/period", params.period_id ),

			periodsIds = project.hasMany( "periods" ).ids(),
			pidsForSearch = periodsIds.map( x => {
				return "`" + `${x}` + "`"
			} ).join( "," )

		let periods = null,
			policies = null

		if ( periodsIds.length ) {
			periods = this.store.query( "model/period", { filter: "(id,:in," + "[" + pidsForSearch + "]" + ")" } )
		} else {
			periods = A( [period] )
		}


		this.facade.startPeriodExam( project )

		const presets = period.then( prd => {
				return this.facade.queryPeriodPresets( prd, prs, 0 )
			} ),

			answers = Promise.all( [period, presets, resources] ).then( results => {
				const p = results[0],
					items = results[1].filter( x => x.category == 8 && x.phase == 0 ),
					people = results[2]

				return this.facade.queryPeriodAnswers( p, items, people )
			} ),

			dragInfo =
				prs.load().then( x => {
					const condi01 = "(proposalId,:eq,`" + x.id + "`)",
						condi02 = "(phase,:eq,0)",
						condi03 = "(category,:eq,8)",
						condi = "(:and," + condi01 + "," + condi02 + "," + condi03 + ")"

					return this.store.query( "model/preset", { filter: condi } )
				} ),

			kpiInfo = prs.load().then( x => {
				const condi01 = "(proposalId,:eq,`" + x.id + "`)",
					condi02 = "(phase,:eq,0)",
					condi03 = "(category,:eq,2)",
					condi = "(:and," + condi01 + "," + condi02 + "," + condi03 + ")"

				return this.store.query( "model/preset", { filter: condi } )
			} )

		policies = prs.load().then( x => {

			return RSVP.hash( { prsId: x.id, periods } )
		} ).then( data => {
			let sourtPeriods = data.periods.sortBy( "phase" )

			return this.store.query( "model/preset", { filter: "(:and," + "(proposalId,:eq,`" + data.prsId + "`)" + `,(phase,:eq,${sourtPeriods.lastObject.phase})` + "," + "(category,:eq,32)" + ")" } )
		} )

		return RSVP.hash( {
			period: period,
			project: project,
			hospitals: hospitals,
			products: products,
			resources: resources,
			presets: presets.then( x => x.filter( it => it.category == 8 && it.phase == 0 ) ),
			productQuotas: presets.then( x => x.filter( it => it.category == 4 && it.phase == 0 ) ),
			answers: answers,
			validation: validation,
			quota: quota,
			dragInfo: dragInfo,
			kpiInfo: kpiInfo,
			periods: periods,
			policies
		} )
	},
	setupController( controller, model ) {
		this._super( controller, model )
		this.controllerFor( "page.project.period" ).Subscribe()
		this.controllerFor( "page.project.period" ).callE()
	}
} )
