import Controller from "@ember/controller"
import { inject as service } from "@ember/service"
// import ENV from "new-tmist/config/environment"
// import { A } from "@ember/array"
// import { isEmpty } from "@ember/utils"
// import RSVP from "rsvp"
// import Ember from "ember"
// const { keys } = Object

export default Controller.extend( {
	cookies: service(),
	oauthService: service( "service/oauth" ),
	showNavbar: true,

	actions: {
		endMission() {
			this.transitionToRoute( "page.welcome" )
		}
	}
} )
