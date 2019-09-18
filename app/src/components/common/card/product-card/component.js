import Component from "@ember/component"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"


export default Component.extend( {
	picOSS: service( "service/pic-oss" ),
	positionalParams: ["product"],
	classNames: ["bg-white"],
	localClassNames: "product",
	showContent: true,
	icon: computed( "showContent", function () {
		let showContent = this.get( "showContent" )

		return showContent ? "right" : "down"
	} ),
	actions: {
		showContent() {
			this.toggleProperty( "showContent" )
		}
	}
} )
