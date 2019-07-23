import Route from "@ember/routing/route"
import RSVP from "rsvp"

export default Route.extend( {
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

		return RSVP.hash( {
			period: this.store.findRecord( "model/period", params.period_id ),
			project: project,
			hospitals: hospitals,
			products: products,
			resources: resources
		} )
	}
} )
