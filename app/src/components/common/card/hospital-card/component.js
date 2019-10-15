import Component from "@ember/component"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"

export default Component.extend( {
	picOSS: service( "service/pic-oss" ),
	positionalParams: ["hospital", "reports","policies"],
	classNames: ["bg-white"],
	localClassNames: "hospital",
	showContent: false,
	hospitalDrugstore: computed( function() {
		let arr = ["省人民医院", "会南市五零一医院", "会东市医科大学附属第二医院"],
			hospitalName = this.hospital.get( "name" )

		return arr.includes( hospitalName )
	} ),
	cur: computed( "reports", function() {
		return this.reports.filter( x => x.hospital.get( "id" ) === this.hospital.id ).sort(
			( a,b )=> a.get( "product.name" ).localeCompare( b.get( "product.name" ), "zh" )
		)
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
