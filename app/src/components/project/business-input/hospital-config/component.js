import Component from "@ember/component"
import { inject as service } from "@ember/service"
import Ember from "ember"
// import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["proposal", "hospital", "quizs", "products"],
	exam: service( "service/exam-facade" ),
	// resource: computed("exam.operationAnswers", "hospital", function() {
	// return this.exam.bs.queryBusinessResources(this.hospital)
	// } ),
	actions: {
		changedResource( aResource ) {
			Ember.Logger.info( `change resources ${aResource.name}` )
			this.exam.bs.resetBusinessResources( this.hospital, aResource )
			this.set( "resource", aResource )
		},
		resetAnswer() {
			this.exam.bs.resetBusinessAnswer( this.hospital )
			this.set( "resource", null )
		}
	}
} )
