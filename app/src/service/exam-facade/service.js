import Service from "@ember/service"
import { inject as service } from "@ember/service"
import examDelegate from "./exam-delegate/delegate"

export default Service.extend( {
	currentProject: null,
	currentPeriod: null,
	currentAnswers: null,
	operationAnswers: null,
	store: service(),
	delegate: null,
	
	// Common opt
	answersLoaded: async function() {
		if ( this.currentAnswers !== null && this.currentAnswers.length >= 0 ) {
			let tmp = await this.delegate.genBusinessOperatorAnswer( this.currentAnswers, this.currentPeriod )
			this.set( "operationAnswers", tmp )
		}
	}.observes( "currentAnswers" ).on( "init" ),

	// enterPeriodExam( aProject, aPeriod ) {
	// 	this.currentProject =  aProject
	// 	this.currentPeriod = aPeriod
	// },

	startPeriodExam( aProject, aPeriod ) {
		this.currentProject =  aProject
		const cPeriod = aPeriod.content ? aPeriod.content : aPeriod
		const fid = cPeriod.hasMany( "answers" ).ids().map( x => {
			return "`" + `${x}` + "`"
		} ).join( "," )

		this.store.query( "model/answer", { filter : "(id,:in," + "[" + fid + "]" + ")" } )
			.then( answers => {
				this.set( "currentPeriod", cPeriod )
				this.set( "delegate", examDelegate.create( this.currentProject.belongsTo( "proposal" ) ) )
				this.delegate.set( "store",this.store )
				this.set( "currentAnswers", answers )
			} )
	},
	clearPeriodExam() {
		this.set( "currentPeriod", null )
		this.operationAnswers.forEach( answer => {
			this.store.unloadRecord( answer )
		} )
		this.set( "operationAnswers", null )
	},
	saveCurrentInput( fcallback ) {
		/**
         * copy and swap
         */
		Promise.all( this.operationAnswers.map( answer => {
			return answer.save()
		} ) ).then( answers => {
			this.set( "currentAnswers", answers )
			this.currentPeriod.set( "answers", this.currentAnswers )
			return this.currentPeriod.save()
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
		this.operationAnswers.filter( x => x.get( "target.id" ) === aHospital.get( "id" ) && x.get("category") === "Business" ).forEach( answer => {
			answer.set( "resource", aResource )
		} )
	},
	resetBusinessAnswer( aHospital ) {
		this.operationAnswers.filter( x => x.get( "target.id" ) === aHospital.get( "id" ) && x.get("category") === "Business" ).forEach( answer => {
			answer.set( "salesTarget", -1 )
			answer.set( "budget", -1 )
			answer.set( "meetingPlaces", -1 )
			answer.set( "resource", null )
		} )
	},
	queryBusinessResources( aHospital ) {
		if ( this.operationAnswers ) {
			const result = this.operationAnswers.find( x => x.get( "target.id" ) === aHospital.id && x.get("category") === "Business" )

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
