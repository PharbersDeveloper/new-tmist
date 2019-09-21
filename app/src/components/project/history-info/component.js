import Component from "@ember/component"
import { inject as service } from "@ember/service"

export default Component.extend( {
	positionalParams: ["provious", "periods", "proviousReport"],
	classNames: ["history-info-wrapper"],
	exportService: service( "service/export-report" ),
	actions: {
		exportReport( project ) {
			this.exportService.exportReport( project, project.get( "periods" ).length )
		},
		exportInput( project ) {
			this.exportService.exportInput( project, project.get( "periods" ).length )
		},
		performance() {

			this.set( "performance", {
				open: true
			} )
		},
		review( pid ) {
			this.transitionToRoute( "page.project.review", pid )
		},
		toReport( project ) {
			window.location = "/project/" + project.id + "/result"
		}
	}
} )
