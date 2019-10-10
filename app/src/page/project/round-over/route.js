import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"
import { all } from "rsvp"


export default Route.extend( {
	cookies: service(),
	model() {
		// const accountId = this.cookies.read( "account_id" ),
		const project = this.modelFor( "page.project" ),
			reports = this.modelFor( "page.project" ).finals,
			accountId = this.cookies.read( "account_id" ),
			proposal = project.belongsTo( "proposal" ),
			provious = proposal.load().then( x => {
				let proposalId = x.id

				return this.store.query( "model/project", {
					filter: "(:and," + "(proposal,:eq,`" + proposalId + "`)," + "(accountId,:eq,`" + accountId + "`)," + "(status,:eq,1))"
				} )
			} ),
			condi00 = "(projectId,:eq,`" + project.get( "id" ) + "`)",
			condi01 = "(phase,:eq," + ( project.periods.length - 1 ) + ")",
			condi = "(:and," + condi00 + "," + condi01 + ")",
			tmReports = this.store.query( "model/report", { filter: condi } )
		// provious = this.store.query( "model/project", {
		// 	filter: "(:and," + "(proposal,:eq,`" + params.proposal_id + "`)," + "(accountId,:eq,`" + accountId + "`)," + "(status,:eq,0))" } )

		// ids = project.hasMany( "periods" ).ids(),
		// hids = ids.map( x => {
		// 	return "`" + `${x}` + "`"
		// } ).join( "," ),
		// periods = this.store.query( "model/period", { filter: "(id,:in," + "[" + hids + "]" + ")"} )
		return provious.then( data => {
			let promiseAll = data.map( ele => {
				return ele.hasMany( "finals" ).load()
			} )

			return RSVP.hash( { provious: data, finals: all( promiseAll ) } )


		} ).then( data => {
			let finals = data.finals,
				proviousReports = data.provious.map( ( ele, index ) => {
					return {
						project: ele,
						reports: finals[index]
					}
				} )

			proviousReports = proviousReports.slice( 0, proviousReports.length - 1 )

			return RSVP.hash( {
				proposal: proposal,
				provious: provious,
				proviousReport:proviousReports,
				project: project,
				reports: reports,
				tmReports: tmReports.then( r => r.filter( x => x.get( "category" ).value === "Sales" ) )
			} )
		} )
		// return RSVP.hash( {
		// 	// periods: periods,
		// 	project: project,
		// 	reports: reports
		// 	// provious: provious
		// } )
	}
} )
