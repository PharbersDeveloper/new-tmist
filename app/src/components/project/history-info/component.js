import Component from "@ember/component"

export default Component.extend( {
	positionalParams: ["provious"],
	classNames: ["history-info-wrapper"],
	actions: {
		performance() {
			this.set( "performance", {
				open: true
			} )
		},
		review( pid ) {
			this.transitionToRoute( "page.project.review", pid )
		}
	}
} )
