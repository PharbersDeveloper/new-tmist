import Route from "@ember/routing/route"
import { inject as service } from "@ember/service"
import ENV from "new-tmist/config/environment"
import Ember from "ember"

export default Route.extend( {
	intl: service(),
	cookies: service(),
	ajax: service(),
	oauthService: service( "service/oauth" ),

	beforeModel( { targetName } ) {
		this.get( "intl" ).setLocale( ["zh-CN"] )
		this.oauthService.judgeAuth( targetName )
	},
	actions: {
		error( error, transition ) {
			Ember.Logger.error( error )
			Ember.Logger.error( transition )
			if ( ENV.environment === "production" ) {
				window.location = ENV.OAuth.AuthEndpoint
			}
		}
	}
} )
