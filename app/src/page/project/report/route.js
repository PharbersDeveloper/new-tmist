import Route from "@ember/routing/route"

export default Route.extend( {
	model( params ) {
		// const project = this.modelFor( "page.project" ),
		// 	ids = project.hasMany( "periods" ).ids(),
		// 	hids = ids.map( x => {
		// 		return "`" + `${x}` + "`"
		// 	} ).join( "," ),
		// 	periods = this.store.query( "model/period", { filter: "(id,:in," + "[" + hids + "]" + ")"} )

		// return RSVP.hash( {
		// 	periods: periods,
		// 	project: project
		// } )

		// return this.store.query( "model/project" )

		return this.modelFor( "page.project" ).finals.lastObject
	}
} )
