import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"
import Ember from "ember"

export default Route.extend( {
	facade: service( "service/exam-facade" ),
	model( params ) {
		const project = this.modelFor( "page.project" )
		const prs = project.belongsTo( "proposal" )

		const hospitals = prs.load().then( x => {
			const ids = x.hasMany( "targets" ).ids(),
				hids = ids.map( x => {
					return "`" + `${x}` + "`"
				} ).join( "," )

			return this.store.query( "model/hospital", { filter: "(id,:in," + "[" + hids + "]" + ")"} )
		} )

		const products = prs.load().then( x => {
			const ids = x.hasMany( "products" ).ids(),
				hids = ids.map( x => {
					return "`" + `${x}` + "`"
				} ).join( "," )

			return this.store.query( "model/product", { filter: "(id,:in," + "[" + hids + "]" + ")"} )
		} )

		const resources = prs.load().then( x => {
			const ids = x.hasMany( "resources" ).ids(),
				hids = ids.map( x => {
					return "`" + `${x}` + "`"
				} ).join( "," )

			return this.store.query( "model/resource", { filter: "(id,:in," + "[" + hids + "]" + ")"} )
		} )

		const period = this.store.findRecord( "model/period", params.period_id )
		period.then( prd => {
			this.facade.startPeriodExam(project, prd)
		})

		return RSVP.hash( {
			period: period,
			project: project,
			hospitals: hospitals,
			products: products,
			resources: resources
		} )
	},
	deactivate() {
		Ember.Logger.info("exist exams")
	}
} )
