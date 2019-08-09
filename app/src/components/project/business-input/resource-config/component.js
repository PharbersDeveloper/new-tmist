import Component from "@ember/component"

export default Component.extend( {
	positionalParams: ["resource"],
	showContent: true,
	actions: {
		showContent( rs ) {
			this.toggleProperty( "showContent" )
			this.set( "curResource", rs )
		}
	}
} )
