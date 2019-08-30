import Component from "@ember/component"

export default Component.extend( {
	projectType: Number( localStorage.getItem( "projectType" ) ),
	positionalParams:["saveInputsWhenQuitModal"],
	actions: {
		toIndex() {
			const url = window.location.href

			if ( url.indexOf( "period" ) !== -1 ) {
				this.saveInputsWhenQuitModal()
			} else {
				window.location = "/"
			}
		}
	}

	// didReceiveAttrs() {
	// 	this.set( "projectType", Number( localStorage.getItem( "projectType" ) ) )
	// }
} )
