import Service from "@ember/service"
import { inject as service } from "@ember/service"
import { computed } from "@ember/object"

export default Service.extend( {
	cookies: service(),
	tokenExpired: false,
	remainTime: "",
	showRemainTime: computed( "remainTime", function () {
		if ( this.remainTime === "0秒" ) {
			return true
		}
		return false
	} ),
	setTimeoutToken() {
		let cookies = this.get( "cookies" )

		if ( cookies.read( "expiry" ) ) {
			// let expiredTime = 1572589776000,
			let expiredTime = Date.parse( new Date( cookies.read( "expiry" ) ) ),
				nowTime = Date.parse( new Date( ) ),
				time = expiredTime - nowTime,
				countdown = time < 1000 * 60 * 10 ? 0 : time - 1000 * 60 * 10,
				toggle = function () {
					this.set( "tokenExpired", true )
				},
				countTime = function () {
					// let expired = 1572589776000, 
					let expired = Date.parse( new Date( cookies.read( "expiry" ) ) ),
						now = Date.parse( new Date( ) ),
						remainTime = expired - now,
						s = Math.floor( remainTime / 1000 )

					if ( s > 60 ) {
						let m = Math.floor( s / 60 )

						this.set( "remainTime", m + "分钟" )
					} else {
						this.set( "remainTime", s + "秒" )
					}
					// window.console.log( "cookie expired" )
				},
				interval = setInterval( countTime.bind( this ), 1000 ),
				clearCountInterval = function () {
					clearInterval( interval )
				}

			setTimeout( toggle.bind( this ), countdown )
			setTimeout( clearCountInterval.bind( this ), time )
		}
	}
} )
