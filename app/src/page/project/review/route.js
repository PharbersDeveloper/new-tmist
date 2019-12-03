import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"

export default Route.extend( {
	cookies: service(),
	facade: service( "service/exam-facade" ),
	model( ) {
		// const accountId = this.cookies.read( "account_id" ),
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

			quota = prs.load().then( x => {
				return x.belongsTo( "quota" ).load()
			} ),

			periodsIds = project.hasMany( "periods" ).ids(),
			pidsForSearch = periodsIds.map( x => {
				return "`" + `${x}` + "`"
			} ).join( "," ),

			periods = this.store.query( "model/period", { filter: "(id,:in," + "[" + pidsForSearch + "]" + ")" } ),
			period = periods.then( res => {
				return res.get( "lastObject" )
			} ),

			phase = project.get( "periods" ).length - 1

		this.facade.startPeriodExam( project )

		const presets = prs.load().then( res => {
				return this.facade.queryPeriodPresets( null, res, phase )
			} ),

			answers = Promise.all( [period, presets, resources] ).then( results => {
				const p = results[0],
					items = results[1].filter( x => x.category === 8 && x.phase === phase ),
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

			presetsByProject = this.store.query( "model/preset", { filter: "(projectId,:eq,`" + project.id + "`)" } ),
			curPresets = phase === 0 ? presets : presetsByProject


		return RSVP.hash( {
			period: period,
			project: project,
			proposal: prs.load().then(),
			hospitals: hospitals,
			products: products,
			resources: resources,
			presets: curPresets.then( x => x.filter( it => it.category === 8 && it.phase === phase ) ),
			productQuotas: presets.then( x => x.filter( it => it.category === 4 && it.phase === phase ) ),
			presetsByProject: presetsByProject.then( x => x.filter( it => it.category === 8 && it.projectId === project.id ) ),
			answers: answers,
			dragInfo: dragInfo.then( x => x.filter( it => it.category === 8 ) ),
			periods: periods,
			quota: quota
		} )
	}
} )
