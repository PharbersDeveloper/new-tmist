import Component from "@ember/component"
import { inject as service } from "@ember/service"

export default Component.extend( {
	oauthService: service( "service/oauth" ),
	actions: {
		logOut() {
			this.oauthService.removeAuth()
			window.localStorage.clear()
			window.location = "/login"
		}
	}
} )
