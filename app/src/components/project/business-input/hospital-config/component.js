import Component from "@ember/component"
import { inject as service } from "@ember/service"
import Ember from "ember"

export default Component.extend( {
	positionalParams: ["proposal", "hospital", "quizs", "products", "resources", "budgetValidationOuter", "salesTargetValidationOuter", "meetingPlacesValidationOuter"],
	exam: service( "service/exam-facade" ),
	actions: {
		changedResource( aResource ) {
			Ember.Logger.info( `change resources ${aResource.name}` )
			this.exam.resetBusinessResources( this.hospital, aResource )
			this.set( "resource", aResource )
		},
		resetAnswer() {
			this.exam.resetBusinessAnswer( this.hospital )
			this.set( "resource", null )
		},
		budgetValidation() {
			this.budgetValidationOuter()
			// get from validation
			// let allBudget = 100000

			// window.console.log( this.quizs )
			// this.quizs.forEach( quiz => {
			// 	allBudget -= quiz.answer.bugget
			// 	if ( allBudget < 0 ) {
			// 		this.set( "warning", {
			// 			open: true,
			// 			title: "经理时间超额",
			// 			detail: "经理时间设定已超过限制，请重新分配。"
			// 		} )
			// 	}
			// } )
		},
		salesTargetValidation() {
			this.salesTargetValidationOuter()
		},
		meetingPlacesValidation() {
			this.meetingPlacesValidationOuter()
		}
	}
} )
