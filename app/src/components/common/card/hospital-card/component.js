import Component from "@ember/component"
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["hospital", "reports"],
	classNames: ["mb-4", "bg-white"],
	localClassNames: "hospital",
	showContent: false,
	cur: computed( "reports", function() {
		debugger
		return this.reports.filter(x => x.hospital.id == this.hospital.id)
	} ),
	icon: computed( "showContent", function () {
		let showContent = this.get( "showContent" )

		return showContent ? "right" : "down"
	} ),
	actions: {
		showContent() {
			this.toggleProperty( "showContent" )
		}
	},
} )
