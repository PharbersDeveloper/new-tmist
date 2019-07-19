import Route from "@ember/routing/route"
import RSVP from "rsvp"
import { inject as service } from "@ember/service"

export default Route.extend( {
	cookies: service(),
	// ajax: service(),
	// beforeModel() {
	// 	const cookies = this.get('cookies');

	// 	let token = cookies.read('access_token');

	// 	if (!token) {
	// 		this.transitionTo('login');
	// 	}
	// },
	// activate() {
	// this._super( ...arguments )
	// let applicationController = this.controllerFor( "application" )

	// // refresh = localStorage.getItem('refresh');
	// applicationController.set( "testProgress", 0 )
	// localStorage.removeItem( "reDeploy" )

	// this.refresh();
	// 如果 refresh 为 undefined 不刷新,并将refresh 设置为1。
	// 在下一页面，
	// if (isEmpty(refresh)) {
	// 	localStorage.setItem('refresh', 1);
	// } else {
	// 	localStorage.removeItem('refresh');
	// 	window.location.reload(true);
	// }
	// },
	setupController( controller, model ) {
		this._super( ...arguments )
		this.controller.set( "currentProposal", model.usableProposals.firstObject.proposal )
	},
	model() {
		const accountId = this.cookies.read( "account_id" )

		return RSVP.hash( {
			usableProposals: this.store.query( "model/usable-proposal", { filter: "(accountId,:eq,`" + accountId + "`)" } ),
			currentProjects: this.store.query( "model/project", { filter: "(:and,(accountId,:eq,`" + accountId + "`),(status,:eq,0))" } ),
			historicalProjects: this.store.query( "model/project", { filter: "(:and,(accountId,:eq,`" + accountId + "`),(status,:eq,1))" } )
		} )

		// let applicationModel = this.modelFor( "application" ),
		// 	store = this.get( "store" ),
		// 	cookies = this.get( "cookies" ),
		// 	useableProposals = A( [] ),
		// 	accountId = cookies.read( "account_id" ),
		// 	papers = A( [] )

		// if ( !isEmpty( applicationModel ) ) {
		// 	return RSVP.hash( {
		// 		papers: applicationModel.papers,
		// 		useableProposals: applicationModel.useableProposals,
		// 		detailProposal: applicationModel.detailProposal,
		// 		detailPaper: applicationModel.detailPaper,
		// 		scenario: applicationModel.scenario
		// 	} )
		// }
		// return store.query( "useableProposal", {
		// 	"account-id": accountId
		// } ).then( data => {
		// 	useableProposals = data
		// 	let promiseArray = A( [] )

		// 	promiseArray = useableProposals.map( ele => {
		// 		return ele.get( "proposal" )
		// 	} )
		// 	return RSVP.Promise.all( promiseArray )
		// } ).then( data => {
		// 	let useableProposalIds = data,
		// 		promiseArray = A( [] ),
		// 		ajax = this.get( "ajax" )

		// 	promiseArray = useableProposalIds.map( ele => {
		// 		return ajax.request( `/v0/GeneratePaper?proposal-id=${ele.id}
		// 		&account-id=${cookies.read( "account_id" )}`, {
		// 			method: "POST",
		// 			data: {}
		// 		} )
		// 	} )
		// 	return RSVP.Promise.all( promiseArray )

		// } ).then( data => {
		// 	data.forEach( ele => {
		// 		store.pushPayload( ele )
		// 	} )
		// 	papers = store.peekAll( "paper" )
		// 	return RSVP.hash( {
		// 		results: A( [] ),
		// 		papers,
		// 		useableProposals,
		// 		detailProposal: useableProposals.get( "firstObject" ),
		// 		detailPaper: papers.get( "firstObject" )
		// 	} )
		// } )
	}
} )
