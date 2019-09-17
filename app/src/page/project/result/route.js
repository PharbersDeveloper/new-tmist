import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"

export default Route.extend( {
	facade: service( "service/exam-facade" ),
	ajax: service(),
	model() {
		return this.store.findRecord( "model/project", this.modelFor( "page.project" ).id, { reload: true } ).then( data => {

			const project = data,

				fids = project.hasMany( "finals" ).ids(),
				fhids = fids.map( x => {
					return "`" + `${x}` + "`"
				} ).join( "," ),

				finals = this.store.query( "model/final", { filter: "(id,:in," + "[" + fhids + "]" + ")" } ),

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
				reports = this.store.query( "model/report", { filter: condi } ),
				yoy = prs.load().then( x => {
					const id = x.get( "id" )

					return this.get( "ajax" ).request( "http://pharbers.com:9202/v1.0/CALC/yoy", {
						method: "GET",
						data: JSON.stringify( {
							"model": "tmrs_new",
							"query": {
								"proposal_id": id,
								"project_id": project.get( "id" ),
								"phase": project.periods.length - 1
							}
						}
						),
						dataType: "json"
					} )
				} ),
				mom = prs.load().then( x => {
					const id = x.get( "id" )

					return this.get( "ajax" ).request( "http://pharbers.com:9202/v1.0/CALC/mom", {
						method: "GET",
						data: JSON.stringify( {
							"model": "tmrs_new",
							"query": {
								"proposal_id": id,
								"project_id": project.get( "id" ),
								"phase": project.periods.length - 1

							}
						}
						),
						dataType: "json"
					} )

				} )

			return RSVP.hash( {
				finals: finals,
				project: project,
				// period: period,
				reports: reports,
				hospitals: hospitals,
				products: products,
				resources: resources,
				yoy,
				mom


				// summary: finals
			} )
		} )
	}
} )

