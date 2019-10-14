import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"

export default Route.extend( {
	cookies: service(),
	beforeModel() {
		if ( window.localStorage.getItem( "isUcb" ) === "1" ) {
			this.transitionTo( "page.ucbprepare" )
		}
	},
	model() {
		// const accountId = this.cookies.read( "account_id" ),
		const tmp = this.store.query( "model/proposal", { filter: "(case,:eq,`tm`)" } ),
			ucb = this.store.query( "model/proposal", { filter: "(case,:eq,`ucb`)" } ),
			apm = this.store.query( "model/proposal", { filter: "(case,:eq,`apm`)" } )

		return RSVP.hash( {
			tmist: tmp,
			ucb: ucb,
			apm: apm
		} )
		// return this.store.query( "model/usable-proposal", { filter: "(accountId,:eq,`" + accountId + "`)" } ).then( res => {
		// 	let ucbProposal = res.filterBy( "id", "5cc5353beeefcc04515c46a3" ).get( "firstObject" ),
		// 		tmistProposal = res.filterBy( "id", "5cc54aceeeefcc04515c46cc" ).get( "firstObject" )

		// 	return RSVP.hash( {
		// 		ucbProposal: ucbProposal,
		// 		tmistProposal: tmistProposal,
		// 		prdiods: this.store.query( "model/project", { filter: "(:and,(accountId,:eq,`" + accountId + "`))" } ),
		// 		proposals: this.store.query( "model/proposal", { filter: "(:and,(accountId,:eq,`" + accountId + "`))" } ),
		// 		currentUCBProjects: this.store.query( "model/project", { filter: "(:and,(accountId,:eq,`" + accountId + "`),(status,:eq,0))" } ).then( res => {
		// 			res.filter( p => {
		// 				return p.get( "proposal.id" ) === ucbProposal.get( "id" )
		// 			} )
		// 		} ),
		// 		currentTmistProjects: this.store.query( "model/project", { filter: "(:and,(accountId,:eq,`" + accountId + "`),(status,:eq,0))" } ).then( res => {
		// 			window.console.log( tmistProposal.get( "id" ) )
		// 			res.filter( p => {
		// 				return p.get( "proposal.id" ) === tmistProposal.get( "id" )
		// 			} )
		// 		} )
		// 	} )

		// } )


		// return RSVP.hash( {
		// 	ucbProposal: ucbProposal,
		// 	tmistProposal: tmistProposal

		// 	// usableProposals: this.store.query( "model/usable-proposal", { filter: "(accountId,:eq,`" + accountId + "`)" } ).filterBy( "id", "5cc5353beeefcc04515c46a3" )
		// 	// currentProjects: this.store.query( "model/project", { filter: "(:and,(accountId,:eq,`" + accountId + "`),(status,:eq,0))" } ),
		// 	// historicalProjects: this.store.query( "model/project", { filter: "(:and,(accountId,:eq,`" + accountId + "`),(status,:eq,1))" } )
		// } )
	},
	afterModel( model ) {
		if ( window.location.href.indexOf( "tm" ) !== -1 ) {
			window.console.log( model.tmist )
			this.transitionTo( "page.prepare", model.tmist.get( "firstObject.id" ) )
		}
	}
} )
