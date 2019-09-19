import Component from "@ember/component"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"

export default Component.extend( {
	picOSS: service( "service/pic-oss" ),
	positionalParams: ["hospital", "reports","policies"],
	classNames: ["bg-white"],
	localClassNames: "hospital",
	showContent: false,
	cur: computed( "reports", function() {
		return this.reports.filter( x => x.hospital.get( "id" ) === this.hospital.id ).sortBy( "product.name" )
	} ),
	currentPolicies: computed( "policies",function() {
		return this.policies.filter( policy=> policy.hospital.get( "id" ) === this.hospital.id )
	} ),
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
