import Service from "@ember/service"
import { inject as service } from "@ember/service"
import examDelegate from "./exam-delegate/delegate"

export default Service.extend( {
	store: service(),
	delegate: null,
	startPeriodExam( aProject ) {
		this.set( "delegate", examDelegate.create( aProject.belongsTo( "proposal" ) ) )
		this.delegate.set( "store",this.store )
	},
	queryPeriodPresets( aPeriod, aProposal, phase ) {
		return this.delegate.getCurrentPresetsWithPeriod( aPeriod, aProposal, phase )
	},
	queryPeriodAnswers( aPeriod, presets, resources ) {
		return this.delegate.answersForPresets( aPeriod, presets, resources )
	},
	// clearPeriodExam() {
	// 	this.set( "currentPeriod", null )
	// 	this.operationAnswers.forEach( answer => {
	// 		this.store.unloadRecord( answer )
	// 	} )
	// 	this.set( "operationAnswers", null )
	// },
	saveCurrentInput( period, answers, fcallback , errCallback ) {
		/**
         * copy and swap
		 * TODO: 只写了新建流程
         */
		Promise.all( answers.map( answer => {
			return answer.save()
		} ) ).then( answers => {
			this.set( "delegate.currentAnswers", answers )
			period.set( "answers", answers )
			return period.save()
		} ).then( period => {
			fcallback( period )
		} ).catch( err => {
			errCallback( err )
		} )
	},


	/*==============================================================*/

	/****************************************************************
	 * Business Exam
	 * business operation logic
	 ****************************************************************/
	resetBusinessResources( answers, aHospital, aResource ) {
		window.console.log( answers.length )
		answers.filter( x => x.get( "target.id" ) === aHospital.get( "id" ) && x.get( "category" ) === "Business" ).forEach( answer => {
			// this.store.peekRecord( "resource", aResource.id )
			answer.set( "resource", aResource )
			// answer.resource = aResource
		} )
	},
	cancelBusinessResource( answers, aHospital ) {
		answers.filter( x => x.get( "target.id" ) === aHospital.get( "id" ) && x.get( "category" ) === "Business" ).forEach( answer => {
			// this.store.peekRecord( "resource", aResource.id )
			answer.set( "visitTime", 0 )
			answer.set( "salesTarget", 0 )
			answer.set( "budget", 0 )
			answer.set( "meetingPlaces", 0 )
			answer.set( "resource", null )
			// answer.resource = aResource
		} )
	},
	resetBusinessAnswer( answers, aHospital ) {
		answers.filter( x => x.get( "target.id" ) === aHospital && x.get( "category" ) === "Business" ).forEach( answer => {
			answer.set( "salesTarget", 0 )
			answer.set( "budget", 0 )
			answer.set( "meetingPlaces", 0 )
			answer.set( "visitTime", 0 )
			answer.set( "resource", null )
		} )
	},
	queryBusinessResources( aHospital ) {
		if ( this.operationAnswers ) {
			const result = this.operationAnswers.find( x => x.get( "target.id" ) === aHospital.id && x.get( "category" ) === "Business" )

			return result ? result : null
		} else {
			return null
		}
	}

	/*==============================================================*/
	/*==============================================================*/

	/****************************************************************
	 * Management Exam
	 * management operation logic
	 ****************************************************************/

	/*==============================================================*/
} )
