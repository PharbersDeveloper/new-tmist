import Route from "@ember/routing/route"
import { inject as service } from "@ember/service"
// import RSVP from "rsvp"
// import { A } from "@ember/array"
// import { isEmpty } from "@ember/utils"
import ENV from "new-tmist/config/environment"
import Ember from "ember"

export default Route.extend( {
	intl: service(),
	cookies: service(),
	ajax: service(),
	oauthService: service( "service/oauth" ),

	beforeModel( { targetName } ) {
		this.get( "intl" ).setLocale( ["zh-CN"] )
		// 初始化 notice 页面的 notcie
		// if ( isEmpty( localStorage.getItem( "notice" ) ) ) {
		// localStorage.setItem( "notice", true )
		// }
		this.oauthService.judgeAuth( targetName )
	},
	// model() {
	// 	let store = this.get( "store" ),
	// 		cookies = this.get( "cookies" ),
	// 		useableProposals = A( [] ),
	// 		accountId = cookies.read( "account_id" ),
	// 		papers = A( [] )

	// 	if ( isEmpty( accountId ) ) {
	// 		return
	// 	}
	// 	return store.query( "useableProposal", {
	// 		"account-id": accountId
	// 	} ).then( data => {
	// 		useableProposals = data
	// 		let promiseArray = A( [] )

	// 		promiseArray = useableProposals.map( ele => {
	// 			return ele.get( "proposal" )
	// 		} )
	// 		return RSVP.Promise.all( promiseArray )
	// 	} ).then( data => {
	// 		let useableProposalIds = data,
	// 			promiseArray = A( [] ),
	// 			ajax = this.get( "ajax" )

	// 		// promiseArray = useableProposalIds.map(ele => {
	// 		// 	return store.query('paper', {
	// 		// 		'proposal-id': ele.id,
	// 		// 		'account-id': accountId
	// 		// 	});
	// 		// });
	// 		promiseArray = useableProposalIds.map( ele => {
	// 			return ajax.request( `/v0/GeneratePaper?proposal-id=${ele.id}
	// 			&account-id=${cookies.read( "account_id" )}`, { method: "POST", data: {} } )
	// 		} )
	// 		return RSVP.Promise.all( promiseArray )

	// 	} ).then( data => {
	// 		data.forEach( ele => {
	// 			store.pushPayload( ele )
	// 		} )
	// 		papers = store.peekAll( "paper" )

	// 		return RSVP.hash( {
	// 			papers,
	// 			useableProposals,
	// 			detailProposal: useableProposals.get( "firstObject" ),
	// 			detailPaper: papers.get( "firstObject" )
	// 		} )
	// 	} )
	// },
	actions: {
		error( error, transition ) {
			Ember.Logger.error( error )
			Ember.Logger.error( transition )
			if ( ENV.environment === "production" ) {
				window.location = ENV.OAuth.AuthEndpoint
			}
		}
	}
} )
