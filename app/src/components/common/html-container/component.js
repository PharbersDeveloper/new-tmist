import Component from "@ember/component"
import $ from "jquery"

export default Component.extend( {
	elementId: "oauth",
	didInsertElement() {
		this._super( ...arguments )
		$( "#oauth" ).append( this.get( "content" ) )
	}
} )
