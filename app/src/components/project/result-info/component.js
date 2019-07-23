import Component from "@ember/component"
// import ENV from 'new-tmist/config/environment';

export default Component.extend( {
	actions: {
		toResult() {
			this.transitionToRoute( "page-result" )
		},
		toIndex() {
			window.location = "/welcome"
		}
	}
} )
