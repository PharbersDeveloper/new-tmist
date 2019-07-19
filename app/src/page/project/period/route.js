import Route from "@ember/routing/route"
import { inject as service } from "@ember/service"
import RSVP from "rsvp"
// import { A } from "@ember/array"

export default Route.extend( {
	cookies: service(),
	// createManagerInput() {
	// 	return this.get( "store" ).createRecord( "managerinput", {
	// 		strategyAnalysisTime: "",
	// 		adminWorkTime: "",
	// 		clientManagementTime: "",
	// 		kpiAnalysisTime: "",
	// 		teamMeetingTime: ""
	// 	} )
	// },
	// createRepInputs( resourceConfigs ) {
	// 	let promiseArray = A( [] )

	// 	promiseArray = resourceConfigs.map( ele => {
	// 		return this.get( "store" ).createRecord( "representativeinput", {
	// 			resourceConfigId: ele.id,
	// 			resourceConfig: ele,
	// 			productKnowledgeTraining: 0,
	// 			salesAbilityTraining: 0,
	// 			regionTraining: 0,
	// 			performanceTraining: 0,
	// 			vocationalDevelopment: 0,
	// 			assistAccessTime: "",
	// 			teamMeeting: "",
	// 			abilityCoach: ""
	// 		} )
	// 	} )
	// 	return promiseArray
	// },
	// //	生成 managerinput
	// generateManagerInput( resourceConfigs ) {
	// 	return {
	// 		managerInput: this.createManagerInput(),
	// 		representativeInputs: this.createRepInputs( resourceConfigs )
	// 	}
	// },
	// // 判断是否有 managerinput
	// hasManagerInput( paper, resourceConfigs ) {
	// 	// 应该根据 paper 中的 state 属性
	// 	let state = paper.get( "state" ),
	// 		reDeploy = Number( localStorage.getItem( "reDeploy" ) ) === 1

	// 	if ( state === 1 && !reDeploy ) {
	// 		return {
	// 			managerInput: this.get( "store" ).peekAll( "managerinput" ).lastObject,
	// 			representativeInputs: this.get( "store" ).peekAll( "representativeinput" )
	// 		}
	// 	}
	// 	return this.generateManagerInput( resourceConfigs )
	// },
	// // 判断是否有 businessinput
	// isHaveBusinessInput( paper, destConfigs, goodsConfig ) {
	// 	let state = paper.get( "state" ),
	// 		reDeploy = Number( localStorage.getItem( "reDeploy" ) ) === 1


	// 	if ( state === 1 && !reDeploy ) {
	// 		return this.get( "store" ).peekAll( "businessinput" )
	// 	}
	// 	return this.generateBusinessInputs( destConfigs, goodsConfig )
	// },
	// // normalFlow(newBusinessInputs) {
	// // 	return newBusinessInputs;
	// // },
	// // 生成 businessinputs
	// generateBusinessInputs( destConfigs, goodsConfig ) {
	// 	let promiseArray = A( [] )

	// 	promiseArray = destConfigs.map( ele => {
	// 		return this.get( "store" ).createRecord( "businessinput", {
	// 			destConfig: ele,
	// 			destConfigId: ele.id,
	// 			representativeId: "",
	// 			resourceConfigId: "",
	// 			resourceConfig: null,
	// 			salesTarget: "",
	// 			budget: "",
	// 			goodsConfig,
	// 			meetingPlaces: 0,
	// 			visitTime: ""
	// 		} )
	// 	} )
	// 	return promiseArray
	// },
	// beforeModel({ params }) {
	// 	let proposalId = params['page-scenario']['proposal_id'],
	// 		cookies = this.get('cookies'),
	// 		store = this.get('store');

	// 	$.ajax({
	// 		method: 'POST',
	// 		url: `/v0/GeneratePaper?proposal-id=${proposalId}
	// 			&account-id=${cookies.read('account_id')}`,
	// 		headers: {
	// 			'Content-Type': 'application/json', // 默认值
	// 			'Accept': 'application/json',
	// 			'Authorization': `Bearer ${cookies.read('access_token')}`
	// 		},
	// 		data: {},
	// 		success: function (res) {
	// 			store.pushPayload(res);
	// 		},
	// 		error: function () {
	// 		}
	// 	});
	// },
	model( ) {
		// debugger
		const project = this.modelFor( "page.project" )

		return RSVP.hash( {
			period: this.store.findRecord("model/period", params.period_id),
			project: this.modelFor("page.project")
		} )
	}
} )
