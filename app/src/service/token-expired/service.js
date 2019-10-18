import Service from "@ember/service"
import { inject as service } from "@ember/service"
// import { set } from "@ember/object"

export default Service.extend( {
	cookies: service(),
	tokenExpired: false,
	setTimeoutToken() {
		let cookies = this.get( "cookies" )

		if ( cookies.read( "expiry" ) ) {
			let expiredTime = Date.parse( new Date( cookies.read( "expiry" ) ) ),
				nowTime = Date.parse( new Date( ) ),
				time = expiredTime - nowTime,
				countdown = time < 1000 * 60 * 10 ? 0 : time - 1000 * 60 * 10,
				toggle = function () {
					this.set( "tokenExpired", true )
					// if ( window.location.href.indexOf( "login" ) !== -1 ) {
					// 	this.set( "tokenExpired", false )
					// }
				}

			// test = 0
			// this.toggleToken()
			setTimeout( toggle.bind( this ), countdown )
		}
	}
} )
