import Component from "@ember/component"
import { inject as service } from "@ember/service"
import { computed, set } from "@ember/object"
import Ember from "ember"

export default Component.extend( {

	positionalParams: ["proposal", "hospital", "quizs", "products", "resources", "answers",
		"budgetValidationOuter", "salesTargetValidationOuter",
		"meetingPlacesValidationOuter", "visitTimeValidationOuter",
		"allocateRepresentatives", "resourceHospital", "cancelRepresentatives"],
	exam: service( "service/exam-facade" ),
	showContent: true,
	checked: false,
	hasResource: computed( "resourceHospital", function() {
		if ( this.quizs.get( "firstObject.answer.resource.id" ) ){
			return true
		}
		return false
	} ),
	givenMeetingPlaces: computed( "resourceHospital", function() {
		let cur = this.transNumber( this.quizs.get( "firstObject.answer.meetingPlaces" ) )

		window.console.log( this.quizs.get( "firstObject.answer.meetingPlaces" ) , "meetingPlaces")

		return cur
	} ),
	transNumber( input ) {
		let number = Number( input )

		if ( number === -1 ) {
			return 0
		} else {
			return number
		}
	},
	actions: {
		showContent() {
			this.toggleProperty( "showContent" )
		},
		changedResource( answer ) {
			this.toggleProperty( "checked" )

			if ( this.checked ) {
				this.allocateRepresentatives( answer )

			} else {
				this.cancelRepresentatives( answer )
			}
			// Ember.Logger.info( `change resources ${aResource.name}` )
			// this.exam.resetBusinessResources( this.answers,this.hospital, aResource )
			// this.set( "resource", aResource )
		},
		resetAnswer() {
			this.exam.resetBusinessAnswer( this.hospital )
			this.set( "resource", null )
		},
		budgetValidation( answer, input ) {
			this.budgetValidationOuter( answer, input )
		},
		salesTargetValidation( answer, input ) {
			this.salesTargetValidationOuter( answer, input )
		},
		meetingPlacesValidation( answer, input ) {
			let cur = this.transNumber( answer.get( input ) )

			set( this, "givenMeetingPlaces", cur )

			this.meetingPlacesValidationOuter( answer, input )
		},
		visitTimeValidation( curAnswer ) {
			this.visitTimeValidationOuter( curAnswer )
		}
	}
} )
