import Component from "@ember/component"
import { computed } from "@ember/object"
import { inject as service } from "@ember/service"

export default Component.extend( {
	positionalParams: ["resources", "proposal", "kpis", "period"],
	picOSS: service( "service/pic-oss" ),
	currentResource: 0,
	lastPeriod: computed( function() {
		window.console.log( this.period.get( "last" ), this.period )
		return this.period.get( "last" )
	} )

} )
