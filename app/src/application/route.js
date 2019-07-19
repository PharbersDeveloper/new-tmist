import Route from "@ember/routing/route"
import { inject as service } from "@ember/service"
// import RSVP from "rsvp"
// import { A } from "@ember/array"
// import { isEmpty } from "@ember/utils"
import ENV from "new-tmist/config/environment"
import Ember from "ember"

export default Route.extend( {
	intl: service(),
	cookies: service(),
	ajax: service(),
	oauthService: service( "service/oauth" ),

	beforeModel( { targetName } ) {
		this.get( "intl" ).setLocale( ["zh-CN"] )
		// 初始化 notice 页面的 notcie
		// if ( isEmpty( localStorage.getItem( "notice" ) ) ) {
		// localStorage.setItem( "notice", true )
		// }
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
