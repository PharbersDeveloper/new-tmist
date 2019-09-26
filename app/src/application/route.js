import Route from "@ember/routing/route"
import { inject as service } from "@ember/service"
import ENV from "new-tmist/config/environment"
// import Ember from "ember"

export default Route.extend( {
	intl: service(),
	cookies: service(),
	ajax: service(),
	oauthService: service( "service/oauth" ),

	beforeModel( { targetName } ) {
		window.localStorage.setItem( "isUcb", 0 )
		// window.localStorage.setItem( "isUcb", 1 ) //UCB专版
		this.get( "intl" ).setLocale( ["zh-CN"] )
		this.oauthService.judgeAuth( targetName )
	},
	actions: {
		error( error, transition ) {
			// Ember.Logger.error( error )
			// Ember.Logger.error( transition )
			window.console.log( error )
			window.console.log( transition )
			if ( ENV.environment === "production" ) {
				this.transitionTo( ENV.OAuth.AuthEndpoint )
			}
		}
	}
} )
