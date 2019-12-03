import Route from "@ember/routing/route"
import { inject as service } from "@ember/service"
import ENV from "new-tmist/config/environment"
import { set } from "@ember/object"
// import Ember from "ember"

export default Route.extend( {
	intl: service(),
	cookies: service(),
	ajax: service(),
	oauthService: service( "service/oauth" ),
	tokenExpiredService: service( "service/token-expired" ),
	beforeModel( { targetName } ) {
		window.localStorage.setItem( "isUcb", 0 )
		// window.localStorage.setItem( "isUcb", 1 ) //UCB专版
		this.get( "intl" ).setLocale( ["zh-CN"] )
		this.oauthService.judgeAuth( targetName )
	},
	// model() {
	// 	return {
	// 		tokenExpired: false
	// 	}
	// },
	afterModel( ) {
		this.tokenExpiredService.setTimeoutToken()
		// 	let cookies = this.get( "cookies" ),
		// 		expiredTime = Date.parse( new Date( cookies.read( "expiry" ) ) ),
		// 		nowTime = Date.parse( new Date( ) ),
		// 		time = expiredTime - nowTime - 1000 * 60 * 10,
		// 		countdown = time > 0 ? time : 0,
		// 		toggle = function () {
		// 			set( model, "tokenExpired", true )
		// 			if ( window.location.href.indexOf( "login" ) !== -1 ) {
		// 				set( model, "tokenExpired", false )
		// 			}
		// 		}
		// 		// test = 0
		// 		// this.toggleToken()


	// 	setTimeout( toggle.bind( this ), countdown )
	// 	// setTimeout( toggle.bind( this ), test )
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
