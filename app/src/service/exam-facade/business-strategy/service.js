import Service from "@ember/service"
import { inject as service } from "@ember/service"
import businessDelegate from "./business-delegate"
import { computed } from "@ember/object"
import Ember from "ember"

export default Service.extend( {
	currentAnswers: null,
	operationAnswers: null,
	// currentProject: null,
	currentPeriod: null,
	store: service(),
	delegate: null,
	startPeriodBusinessExam( aProject, aPeriod ) {
		const ids = aPeriod.answers.map( x => x.id )

		Promise.all( ids.map( id => {
			return this.store.find( "model/answer", id )
		} ) ).then( answers => {
			// this.set("currentProject", aProject)
			this.set( "currentPeriod", aPeriod )
			this.set( "delegate", businessDelegate.create( aProject.proposal ) )
			this.delegate.set( "store",this.store )
			this.set( "currentAnswers", answers )
		} )
	},
	clearPeriodBusinessExam() {
		this.set( "currentPeriod", null )
		this.operationAnswers.forEach( answer => {
			this.store.unloadRecord( answer )
		} )
		this.set( "operationAnswers", null )
	},
	saveCurrentBussinessInput( fcallback ) {
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
	endCurrentBusinessExam() {

	},
	// answersLoaded: async function() {
	// 	if ( this.currentAnswers !== null && this.currentAnswers.length === 0 ) {
	// 		let tmp = await this.delegate.genBusinessOperatorAnswer( this.currentAnswers, this.currentPeriod )

	// 		this.set( "operationAnswers", tmp )
	// 	} else if ( this.currentAnswers !== null && this.currentAnswers.length > 0 ) {
	// 		Ember.Logger.info( "need copy and swap" )
	// 		let tmp = await this.delegate.genBusinessOperatorAnswer( this.currentAnswers, this.currentPeriod )

	// 		// console.log( tmp.firstObject.product.get( "id" ) )
	// 		this.set( "operationAnswers", tmp )
	// 	} else {
	// 		// Ember.Logger.info("do nothing")
	// 	}
	// }.observes( "currentAnswers" ).on( "init" ),

	answersLoaded() {
		return this.temp.observes( "currentAnswers" ).on( "init" )
	},
	async temp() {
		if ( this.currentAnswers !== null && this.currentAnswers.length === 0 ) {
			let tmp = await this.delegate.genBusinessOperatorAnswer( this.currentAnswers, this.currentPeriod )

			this.set( "operationAnswers", tmp )
		} else if ( this.currentAnswers !== null && this.currentAnswers.length > 0 ) {
			Ember.Logger.info( "need copy and swap" )
			let tmp = await this.delegate.genBusinessOperatorAnswer( this.currentAnswers, this.currentPeriod )

			// console.log( tmp.firstObject.product.get( "id" ) )
			this.set( "operationAnswers", tmp )
		} else {
			// Ember.Logger.info("do nothing")
		}
	},
	// operation logic
	resetBusinessResources( aHospital, aResource ) {
		this.operationAnswers.filter( x => x.get( "target.id" ) === aHospital.get( "id" ) ).forEach( answer => {
			answer.set( "resource", aResource )
		} )
	},
	resetBusinessAnswer( aHospital ) {
		this.operationAnswers.filter( x => x.get( "target.id" ) === aHospital.get( "id" ) ).forEach( answer => {
			answer.set( "salesTarget", -1 )
			answer.set( "budget", -1 )
			answer.set( "meetingPlaces", -1 )
			answer.set( "resource", null )
		} )
	},
	queryBusinessResources( aHospital ) {
		if ( this.operationAnswers ) {
			const result = this.operationAnswers.find( x => x.get( "target.id" ) === aHospital.id )

			return result ? result : null
		} else {
			return null
		}
	}
} )
