import Component from "@ember/component"
import { computed } from "@ember/object"

export default Component.extend( {
	positionalParams: ["project", "period", "hospitals", "products", "resources", "preset", "answers"],
	currentName: computed( "products", function() {
		const cur = this.get( "products" ).find( x => x.productType === 0 )

		return cur ? cur.name : ""
	} )
} )
