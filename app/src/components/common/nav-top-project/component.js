import Component from "@ember/component"
import { inject as service } from "@ember/service"

export default Component.extend( {
	oauthService: service( "service/oauth" ),
	projectType: Number( localStorage.getItem( "projectType" ) ),
	positionalParams:["saveInputsWhenQuitModal"],
	actions: {
		toIndex() {
			const url = window.location.href

			if ( url.indexOf( "period" ) !== -1 ) {
				this.saveInputsWhenQuitModal()
			} else if ( localStorage.getItem( "isUcb" ) === "1" ) {
				window.location = "/ucbprepare"
			} else {
				window.location = "/"
			}
		},
		logOut() {
			this.oauthService.removeAuth()
			window.localStorage.clear()
			window.location = "/ucblogin"
		},
		logOutTM() {
			this.oauthService.removeAuth()
			window.localStorage.clear()
			window.location = "/login"
		}
	}

	// didReceiveAttrs() {
	// 	this.set( "projectType", Number( localStorage.getItem( "projectType" ) ) )
	// }
} )
