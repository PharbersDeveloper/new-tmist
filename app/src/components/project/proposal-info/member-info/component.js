import Component from "@ember/component"
import { later } from "@ember/runloop"

export default Component.extend( {
	positionalParams: ["resources"],
	currentResource: 0

} )
