import Component from "@ember/component"
import { inject as service } from "@ember/service"
import Ember from "ember"

export default Component.extend( {
	positionalParams: ["proposal", "hospital", "quizs", "products", "resources", "answers",
		"budgetValidationOuter", "salesTargetValidationOuter",
		"meetingPlacesValidationOuter", "visitTimeValidationOuter"],
	exam: service( "service/exam-facade" ),
	actions: {
		changedResource( aResource ) {
			Ember.Logger.info( `change resources ${aResource.name}` )
			this.exam.resetBusinessResources( this.answers,this.hospital, aResource )
			this.set( "resource", aResource )
		},
		resetAnswer() {
			this.exam.resetBusinessAnswer( this.hospital )
			this.set( "resource", null )
		},
		budgetValidation() {
			this.budgetValidationOuter()
		},
		salesTargetValidation() {
			this.salesTargetValidationOuter()
		},
		meetingPlacesValidation() {
			this.meetingPlacesValidationOuter()
		},
		visitTimeValidation( curAnswer ) {
			this.visitTimeValidationOuter( curAnswer )
		}
	}
} )
