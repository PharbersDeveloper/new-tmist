import Component from "@ember/component"

export default Component.extend( {
	projectType: Number( localStorage.getItem( "projectType" ) ),
	actions: {
		toIndex() {
			window.location = "/"
		}
	}

	// didReceiveAttrs() {
	// 	this.set( "projectType", Number( localStorage.getItem( "projectType" ) ) )
	// }
} )
