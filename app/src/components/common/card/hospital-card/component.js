import Component from "@ember/component"
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["hospital", "reports"],
	classNames: ["mb-4", "bg-white"],
	localClassNames: "hospital",
	showContent: false,
	cur: computed( "reports", function() {
		return this.reports.filter( x => x.hospital.get( "id" ) === this.hospital.id ).sortBy( "product.name" )
	} ),
	icon: computed( "showContent", function () {
		let showContent = this.get( "showContent" )

		return showContent ? "right" : "down"
	} ),
	selfPayPercentage: computed( "hospital",function() {
		return this.hospital.selfPayPercentage * 100
	} ),
	actions: {
		showContent() {
			this.toggleProperty( "showContent" )
		}
	}
} )
