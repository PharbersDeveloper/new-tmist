import Component from "@ember/component"
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["resources", "proposal", "kpis", "period"],
	currentResource: 0,
	lastPeriod: computed( function() {
		window.console.log( this.period.get( "last" ), this.period )
		return this.period.get( "last" )
	} )

} )
