import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"
import { all } from "rsvp"

export default Route.extend( {
	cookies: service(),
	model( params ) {
		const accountId = this.cookies.read( "account_id" ),
			proposal = this.store.findRecord( "model/proposal", params.proposal_id ),
			provious = this.store.query( "model/project", {
				filter: "(:and," + "(proposal,:eq,`" + params.proposal_id + "`)," + "(accountId,:eq,`" + accountId + "`)," + "(status,:eq,1))"
			} ),

			evaluations = proposal.then( x => {
				const ids = x.hasMany( "evaluations" ).ids(),
					eids = ids.map( x => {
						return "`" + `${x}` + "`"
					} ).join( "," )

				return this.store.query( "model/evaluation", { filter: "(id,:in," + "[" + eids + "]" + ")" } )
			} )

			window.console.log( proposal )
			window.console.log( "proposal" )
			// evaluations = this.store.query( "model/evaluation" , {} )


		return provious.then( data => {
			let promiseAll = data.map( ele => {
					return ele.hasMany( "finals" ).load()
				} ),
				tmReportAll = data.map( ele => {
					const	condi00 = "(projectId,:eq,`" + ele.get( "id" ) + "`)",
						condi01 = "(phase,:eq," + ( ele.periods.length - 1 ) + ")",
						condi = "(:and," + condi00 + "," + condi01 + ")"

					return this.store.query( "model/report", { filter: condi } )
				} )


			return RSVP.hash( { provious: data, finals: all( promiseAll ), tmReports: all( tmReportAll ) } )


		} ).then( data => {
			let finals = data.finals,
				tmReports = data.tmReports,
				proviousReports = data.provious.map( ( ele, index ) => {
					window.console.log( tmReports[index] )
					window.console.log( tmReports[index].filter( x => x.get( "category" ).value === "Sales" ) )

					return {
						project: ele,
						reports: finals[index],
						tmReports: tmReports[index].filter( x => x.get( "category" ).value === "Sales" )
					}
				} )

			return RSVP.hash( {
				proposal: proposal,
				provious: provious,
				proviousReport:proviousReports.reverse(),
				evaluations: evaluations
				// tmReports: tmReports.then( r => r.filter( x => x.get( "category" ).value === "Sales" ) )
			} )
		} )
		// return RSVP.hash( {
		// 	proposal: proposal,
		// 	provious: provious,
		// 	proviousReport
		// } )
	}
} )
