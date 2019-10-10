import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"

export default Route.extend( {
	facade: service( "service/exam-facade" ),
	runtimeConfig: service( "service/runtime-config" ),
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
			} ).join( "," ),

			phase = project.get( "periods" ).length - 1

		let periods = null,
			policies = null

		periods = this.store.query( "model/period", { filter: "(id,:in," + "[" + pidsForSearch + "]" + ")" } )

		window.console.log( "periodsIds" )

		this.facade.startPeriodExam( project )

		// get all preset by proposal
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

			kpiInfo = prs.load().then( x => {
				window.console.log( phase )
				const condi01 = "(proposalId,:eq,`" + x.id + "`)",
					condi02 = "(phase,:eq," + phase + ")",
					condi03 = "(category,:eq,2)",
					condi = "(:and," + condi01 + "," + condi02 + "," + condi03 + ")"

				return this.store.query( "model/preset", { filter: condi } )
			} ),
			presetsByProject = this.store.query( "model/preset", { filter: "(projectId,:eq,`" + project.id + "`)" } )

		policies = prs.load().then( x => {

			return RSVP.hash( { prsId: x.id, periods } )
		} ).then( data => {
			let sourtPeriods = data.periods.sortBy( "phase" )

			return this.store.query( "model/preset", { filter: "(:and," + "(proposalId,:eq,`" + data.prsId + "`)" + `,(phase,:eq,${sourtPeriods.lastObject.phase})` + "," + "(category,:eq,32)" + ")" } )
		} )

		const curPresets = phase === 0 ? presets : presetsByProject,
			budgetPreset = phase === 0 ? quota : presetsByProject.then( x => x.filter( it => it.category === 8 && it.phase === phase ) )

		// 2.3 周期分配结果等于第一周期分配结果 start
		if ( phase > 0 ) {
			presetsByProject.then( x => {
				x.filter( it => it.category === 8 && it.phase === phase ).forEach( preset => {
					answers.then( a => {
						const curAnswer = a.filter( x => x.get( "category" ) === "Business" ).find( ans => {
							const p = ans.belongsTo( "product" ).id() === preset.belongsTo( "product" ).id(),
								h = ans.belongsTo( "target" ).id() === preset.belongsTo( "hospital" ).id()

							return p && h
						} )

						if ( curAnswer ) {
							curAnswer.set( "resource", preset.resource )
						}

					} )
				} )
			} )
		}
		// end

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
			validation: validation,
			quota: quota,
			dragInfo: dragInfo.then( x => x.filter( it => it.category === 8 ) ),
			kpiInfo: kpiInfo,
			periods: periods,
			budgetPreset:budgetPreset,
			policies
		} )
	},
	setupController( controller, model ) {
		this._super( controller, model )
		this.controllerFor( "page.project.period" ).Subscribe()
		// this.controllerFor( "page.project.period" ).callE()
		// this.controllerFor( "page.project.period" ).set( "loadingForSubmit", true )
		this.controllerFor( "page.project.period" ).set( "taskModal", true )

		this.runtimeConfig.set( "proposalId",model.project.get( "proposal.id" ) )
		this.runtimeConfig.set( "projectId" , model.project.get( "id" ) )
	},
	afterModel( model ) {
		if ( model.project.current === model.periods.length ) {
			this.transitionTo( "page.project.result", model.project.get( "id" ) )
		}

		if ( model.period.phase < model.periods.length - 1 ) {
			this.transitionTo( "page.project.period", model.project.get( "id" ), model.periods.get( "lastObject.id" ) )
		}
	}
} )
