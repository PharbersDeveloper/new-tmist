import Component from "@ember/component"
import { inject as service } from "@ember/service"
import Ember from "ember"

export default Component.extend( {
	positionalParams: ["proposal", "hospital", "quizs", "products", "resources"],
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
		}
	}
} )
