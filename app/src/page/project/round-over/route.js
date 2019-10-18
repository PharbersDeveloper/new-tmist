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
			tmReports = this.store.query( "model/report", { filter: condi } ),
			evaluations = proposal.load().then( x => {
				const ids = x.hasMany( "evaluations" ).ids(),
					eids = ids.map( x => {
						return "`" + `${x}` + "`"
					} ).join( "," )

				return this.store.query( "model/evaluation", { filter: "(id,:in," + "[" + eids + "]" + ")" } )
			} )

			window.console.log( proposal )
			window.console.log( "proposal" )
		// evaluations = this.store.query( "model/evaluation", {} )
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
				} ),
				tmReportAll = data.map( ele => {
					const	condi0 = "(projectId,:eq,`" + ele.get( "id" ) + "`)",
						cond1 = "(phase,:eq," + ( ele.periods.length - 1 ) + ")",
						cond = "(:and," + condi0 + "," + cond1 + ")"

					return this.store.query( "model/report", { filter: cond } )
				} )

			return RSVP.hash( { provious: data, finals: all( promiseAll ), tmReports: all( tmReportAll ) } )


		} ).then( data => {
			let finals = data.finals,
				tmProReports = data.tmReports,
				proviousReports = data.provious.map( ( ele, index ) => {
					return {
						project: ele,
						reports: finals[index],
						tmReports: tmProReports[index].filter( x => x.get( "category" ).value === "Sales" )
					}
				} ),

			 historyReports = proviousReports.slice( 0, proviousReports.length - 1 )

			return RSVP.hash( {
				proposal: proposal,
				provious: provious,
				proviousReport: proviousReports.reverse(),
				historyReports: historyReports.reverse(),
				project: project,
				reports: reports,
				tmReports: tmReports.then( r => r.filter( x => x.get( "category" ).value === "Sales" ) ),
				evaluations: evaluations
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
