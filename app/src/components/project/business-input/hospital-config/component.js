import Component from "@ember/component"
import { inject as service } from "@ember/service"
import { computed, set } from "@ember/object"
import { isEmpty } from "@ember/utils"

export default Component.extend( {
	localClassNames: "hospital-config-component",
	runtimeConfig: service( "service/runtime-config" ),
	// localClassNameBindings: A( ["hospital-config-component"] ),
	positionalParams: ["proposal", "hospital", "quizs", "products", "resources", "answers", "curResource",
		"budgetValidationOuter", "salesTargetValidationOuter",
		"meetingPlacesValidationOuter", "visitTimeValidationOuter",
		"allocateRepresentatives", "resourceHospital", "cancelRepresentatives",
		"selectHospital", "curHospitalId"],
	exam: service( "service/exam-facade" ),
	popperOption: {
		// preventOverflow: { padding: 50 },
		keepTogether: { enabled: false },
		// preventOverflow: { enabled: false },
		preventOverflow: { padding: 0 },
		// arrow: { enabled: true },
		offset: { enabled: true, offset: "0, 10" }
	},
	hospitalDrugstore: computed( function() {
		let arr = ["省人民医院", "会南市五零一医院", "会东市医科大学附属第二医院"],
			hospitalName = this.hospital.get( "name" )

		return arr.includes( hospitalName )
	} ),
	sortQuizs: computed( "quizs",function() {
		let quizs = this.quizs

		if ( isEmpty( quizs ) ) {
			return quizs
		}
		return quizs//.sortBy( "preset.product.name" )
	} ),
	showContent: true,
	checked:  computed( function() {
		if ( this.sortQuizs.get( "firstObject.answer.resource.id" ) ){
			return true
		}
		return false
	} ),
	disabledInput: computed( "resourceHospital", function() {
		return !this.hasResource
	} ),
	hasResource: computed( "resourceHospital", function() {
		if ( this.sortQuizs.get( "firstObject.answer.resource.id" ) ){
			return true
		}
		this.set( "showContent", true )
		return false
	} ),
	givenMeetingPlaces: computed( "resourceHospital", function() {
		let cur = this.transNumber( this.sortQuizs.get( "firstObject.answer.meetingPlaces" ) )

		window.console.log( this.sortQuizs.get( "firstObject.answer.meetingPlaces" ) , "meetingPlaces" )

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
	didUpdate() {
		this._super( ...arguments )
	},
	onHidePopover( ) {
		this.runtimeConfig.set( "popover",false )
	},
	actions: {
		selectCurHospital( hid ) {
			this.onHidePopover( )
			this.toggleProperty( "showContent" )
			this.selectHospital( hid )
		},
		hidePopover( ) {
			this.onHidePopover( )

		},
		changedResource( answer ) {
			this.onHidePopover( )

			if ( answer.get( "resource.id" ) ) {
				this.cancelRepresentatives( answer )

			} else {
				this.allocateRepresentatives( answer )
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
