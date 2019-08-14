import Component from "@ember/component"
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["product"],
	classNames: ["mb-4", "bg-white"],
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
