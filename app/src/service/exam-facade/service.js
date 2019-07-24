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
	queryPeriodPresets( aPeriod ) {
		return this.delegate.getCurrentPresetsWithPeriod( aPeriod )
	},
	queryPeriodAnswers( aPeriod, presets, resources ) {
		return this.delegate.answersForPresets( aPeriod, presets, resources )
	},
	clearPeriodExam() {
		this.set( "currentPeriod", null )
		this.operationAnswers.forEach( answer => {
			this.store.unloadRecord( answer )
		} )
		this.set( "operationAnswers", null )
	},
	saveCurrentInput(period, answers, fcallback ) {
		/**
         * copy and swap
		 * TODO: 只写了新建流程
         */
		Promise.all( answers.map( answer => {
			return answer.save()
		} ) ).then( answers => {
			this.set( "delegate.currentAnswers", answers )
			period.set( "answers", answers)
			return period.save()
		} ).then( period => {
			fcallback( period )
		} )
	},


	/*==============================================================*/

	/****************************************************************
	 * Business Exam
	 * business operation logic
	 ****************************************************************/
	resetBusinessResources( aHospital, aResource ) {
		this.operationAnswers.filter( x => x.get( "target.id" ) === aHospital.get( "id" ) && x.get( "category" ) === "Business" ).forEach( answer => {
			answer.set( "resource", aResource )
		} )
	},
	resetBusinessAnswer( aHospital ) {
		this.operationAnswers.filter( x => x.get( "target.id" ) === aHospital.get( "id" ) && x.get( "category" ) === "Business" ).forEach( answer => {
			answer.set( "salesTarget", -1 )
			answer.set( "budget", -1 )
			answer.set( "meetingPlaces", -1 )
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
